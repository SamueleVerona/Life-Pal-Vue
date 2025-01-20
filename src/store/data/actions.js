import * as helpers from "../helpers/dataHelpers.js";

export default {
  async deleteData(context, payload) {
    const sessionToken = context.getters.sessionToken;
    const UID = context.getters.userToken;
    let urlMod;
    let itemMod;

    const deletionType = payload.type;
    let itemsToDelete = payload.items;

    if (deletionType === "account") itemsToDelete = [0];

    const deletePromises = itemsToDelete.map((item) => {
      if (deletionType === "goal") {
        urlMod = UID + "/goals";
        itemMod = item.id;
      } else if (deletionType === "request") {
        urlMod = item.userId + "/requests";
        itemMod = item.id;
      } else {
        urlMod = UID;
        itemMod = "";
      }

      return fetch(
        `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${urlMod}/${itemMod}.json?auth=${sessionToken}`,
        {
          method: "DELETE",
        }
      );
    });

    const resData = await Promise.allSettled(deletePromises);

    const resStatuses = resData.map((res) => {
      return { status: res.value.status, message: res.value.statusText };
    });
    const someRejected = resStatuses.some((res) => res.status != 200);

    if (someRejected) {
      const error = resStatuses.reduce((accum, curr) => {
        accum.push(curr.status);
        return "errors: (" + accum + ")";
      }, []);
      console.warn(error);
      throw new Error("Couldn't delete your data.\nTry again");
    } else {
      if (deletionType !== "account") {
        context.dispatch("getData", { type: payload.type });
      } else {
        return true;
      }
    }
  },
  async sendData(context, payload) {
    try {
      const sessionToken = context.getters.sessionToken;
      const UID = context.getters.userToken;
      const curGoals = context.getters.userGoals;
      const curReq = context.getters.allRequests;

      let urlMod = UID;
      let method;
      let body;
      let itemsArr;

      if (payload.type === "request") {
        urlMod += "/requests";
        itemsArr = curReq;
      } else {
        urlMod += "/goals";
        itemsArr = curGoals;
      }

      if (itemsArr.length > 0) {
        method = "POST";
        body = JSON.stringify({ ...payload.data, userId: UID });
      } else {
        const id = helpers.generateId();
        method = "PUT";
        body = JSON.stringify({ [id]: { ...payload.data, userId: UID } });
      }

      const res = await fetch(
        `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${urlMod}.json?auth=${sessionToken}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }
      );

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(
          resData.message || "Failed to load new goal.\nTry again"
        );
      }

      context.dispatch("getData", { type: payload.type });
    } catch (err) {
      throw err.message;
    }
  },
  async getData(context, payload) {
    try {
      const UID = context.getters.userToken;
      const token = context.getters.sessionToken;
      const isAdmin = context.getters.userIsAdmin;

      let urlMod;

      if (!isAdmin) {
        if (payload.type === "all") {
          urlMod = UID;
        } else if (payload.type === "goal") {
          urlMod = UID + "/goals";
        } else {
          urlMod = UID + "/requests";
        }
      } else {
        urlMod = "";
      }

      const res = await fetch(
        `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${urlMod}.json?auth=${token}`
      );

      const resData = await res.json();

      if (!res.ok) throw new Error("Couldn't retrieve data.\n Try again");

      if (!isAdmin) {
        if (payload.type === "all") {
          if (!resData) {
            context.commit("loadData", { goals: [], requests: [] });
            return;
          }

          const requests = resData.requests
            ? helpers.setDatabaseId(resData.requests)
            : [];

          const goals = resData.goals
            ? await context.dispatch(
                "checkGoals",
                helpers.setDatabaseId(resData.goals)
              )
            : [];

          context.commit("loadData", { goals, requests });
        } else if (payload.type === "goal") {
          const goals = resData
            ? await context.dispatch(
                "checkGoals",
                helpers.setDatabaseId(resData)
              )
            : [];

          context.commit("loadGoals", goals);
        } else {
          const requests = resData ? helpers.setDatabaseId(resData) : [];

          context.commit("loadRequests", requests);
        }
      } else {
        let allUsersRequests = resData
          ? helpers.parseAdminRequests(resData)
          : [];
        context.commit("loadRequests", [...allUsersRequests]);
      }
    } catch (err) {
      throw err.message;
    }
  },
  checkGoals(context, goals) {
    const expired = [];

    const checkedGoals = goals.map((goal) => {
      if (!goal.isCompleted && !goal.isFailed) {
        const isExpired = helpers.checkforCompletion(goal);
        if (isExpired) {
          expired.push(goal);
        }
      }
      return goal;
    });

    context.commit("setExpiredGoals", expired);
    return checkedGoals;
  },

  async confirmExpired(context, goalsToPatch) {
    const sessionToken = context.getters.sessionToken;
    const UID = context.getters.userToken;

    const goalsToArray = Object.values(goalsToPatch);

    try {
      const deletePromises = goalsToArray.map((goal) => {
        return fetch(
          `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${UID}/goals/${goal.itemId}.json?auth=${sessionToken}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isCompleted: goal.isCompleted,
              isFailed: goal.isFailed,
            }),
          }
        );
      });

      const patched = await Promise.allSettled(deletePromises);

      const someRejected = patched.some((res) => res.status === "rejected");

      if (someRejected) {
        throw new Error("Couldn't set goals status.\nTry again");
      } else {
        context.dispatch("getData", { type: "goal" });
      }
    } catch (err) {
      throw err.message;
    }
  },
  async changeReqState(context, reqsToPatch) {
    const sessionToken = context.getters.sessionToken;

    try {
      const deletePromises = reqsToPatch.map((req) => {
        return fetch(
          `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${req.userId}/requests/${req.itemId}.json?auth=${sessionToken}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              itemLabel: req.itemLabel,
              reply: req.reply,
            }),
          }
        );
      });

      const patched = await Promise.allSettled(deletePromises);

      const someRejected = patched.some((res) => res.status === "rejected");
      if (someRejected) {
        throw new Error("Couldn't change requests status.\nTry again");
      } else {
        context.dispatch("getData", { type: "request" });
      }
    } catch (err) {
      throw err.message;
    }
  },
  resetData(context) {
    context.commit("resetData");
  },
};
//SUGGESTION:
//PATCHING THE LOCAL COPY DIRECTLY BEFORE REFETCHING (LAZY LOADING)
