function checkforCompletion(goal) {
  const TODAY_MS = Date.now();
  const completionTime =
    typeof goal.compDate === "number"
      ? goal.compDate
      : new Date(goal.compDate).getTime();

  if (TODAY_MS >= completionTime && !goal.isCompleted && !goal.isFailed)
    return true;
  else false;
}
function generateId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < 22; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length - 1);
    id += characters[randomIndex];
  }
  return id;
}
function setDatabaseId(dataObject) {
  const parsedArray = Object.entries(dataObject).map((item) => {
    if (!item[1].databaseId) item[1].databaseId = item[0];
    return item[1];
  });

  return parsedArray;
}
function parseAdminRequests(dataObject) {
  const parsedArray = Object.entries(dataObject).flatMap((item) => {
    return item[1].requests
      ? Object.entries(item[1].requests).map((req) => {
          return { ...req[1], databaseId: req[0] };
        })
      : [];
  });
  return parsedArray;
}

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
        const id = generateId();
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
      const isAdmin = context.rootGetters.userIsAdmin;

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
            ? setDatabaseId(resData.requests)
            : [];

          const goals = resData.goals
            ? await context.dispatch("checkGoals", setDatabaseId(resData.goals))
            : [];

          context.commit("loadData", { goals, requests });
        } else if (payload.type === "goal") {
          const goals = resData
            ? await context.dispatch("checkGoals", setDatabaseId(resData))
            : [];

          context.commit("loadGoals", goals);
        } else {
          const requests = resData ? setDatabaseId(resData) : [];

          context.commit("loadRequests", requests);
        }
      } else {
        let allUsersRequests = resData ? parseAdminRequests(resData) : [];
        context.commit("loadRequests", [...allUsersRequests]);
      }
    } catch (err) {
      throw err.message;
    }
  },
  checkGoals(context, goals) {
    const expired = [];

    const checkedGoals = Object.entries(goals).map((goal) => {
      const isExpired = checkforCompletion(goal[1]);
      if (isExpired) {
        expired.push(goal[1]);
      }

      return goal[1];
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

      //QUESTION:
      //WOULD PATCHING THE LOCAL COPY DIRECTLY ALSO, BE FASTER THAN REFETCHING?
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

      //QUESTION:
      //WOULD PATCHING THE LOCAL COPY DIRECTLY ALSO, BE FASTER THAN REFETCHING?
    } catch (err) {
      throw err.message;
    }
  },
};

// NEED A FUNCTION FOR SENDING BUG REPORTS OR SUGGESTIONS (BASICLY  requests)✔
//--SET UP ADMIN PROFILE: ✔
//--NEEDS OPTION TO REPLY TO USERS✔
//--NEEDS OPTION TO ACCEPT OR REJECT A REQUEST AND OPTIONALLY REPLY WITH A MESSAGE✔

//--USER:
//--NEEDS CARD FOR SENDING MESSAGES ✔
//--NEEDS FILTER OPTION FOR SEEING PENDING/ACCEPTED/REJECTED REQUESTS ✔
//--NEEDS 'REQUESTS' SECTIONS ON DATABASE ✔
//--NEEDS WAY TO SEE REPLIES FROM ADMIN✔
//--(REQUESTS WILL HAVE 'ACCEPTED' OR 'REJECTED' MARK WITH OPTIONAL MESSAGE ATTACHED)✔
