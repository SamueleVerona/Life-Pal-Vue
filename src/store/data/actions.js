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
    return Object.entries(item[1].requests).map((req) => {
      return { ...req[1], databaseId: req[0] };
    });
  });
  return parsedArray;
}

export default {
  async deleteData(context, goalsToRemove) {
    const sessionToken = context.getters.sessionToken;
    const UID = context.getters.userToken;
    const curGoals = context.getters.userGoals;

    try {
      const validNames = new Set(curGoals.map(({ databaseId }) => databaseId));

      const deletePromises = goalsToRemove.map((goalId) => {
        if (validNames.has(goalId)) {
          return fetch(
            `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${UID}/goals/${goalId}.json?auth=${sessionToken}`,
            {
              method: "DELETE",
            }
          );
        } else {
          return new Promise((_, reject) =>
            reject("Goal at index does not exist")
          );
        }
      });

      const deleted = await Promise.allSettled(deletePromises);

      const someRejected = deleted.some((res) => res.status === "rejected");
      if (someRejected) {
        throw new Error("Deleting failed, invalid URL ");
      } else {
        context.dispatch("getData");
        context.commit("setExpiredGoals", []);
      }
    } catch (err) {
      throw err.message;
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
        throw new Error(resData.message || "Failed to load new goal");
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
      if (!res.ok) throw new Error("Failed fetching");

      if (payload.type === "all") {
        if (!isAdmin) {
          const requests = resData.requests
            ? setDatabaseId(resData.requests)
            : [];

          const goals = await context.dispatch("checkGoals", resData.goals);

          context.commit("loadData", { goals, requests });
        } else {
          const allUsersRequests = parseAdminRequests(resData);
          context.commit("loadRequests", [...allUsersRequests]);
        }
      } else if (payload.type === "goal") {
        context.commit("loadGoals", Object.values(resData));
      } else {
        context.commit("loadRequests", Object.values(resData));
      }
    } catch (err) {
      throw err.message;
    }
  },
  checkGoals(context, goals) {
    const expired = [];

    const checkedGoals = Object.entries(goals).map((goal) => {
      if (!goal[1].databaseId) goal[1].databaseId = goal[0];

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
          `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${UID}/goals/${goal.goalId}.json?auth=${sessionToken}`,
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
        throw new Error("Patching failed");
      } else {
        context.dispatch("getData");
      }

      //QUESTION:
      //WOULD PATCHING THE LOCAL COPY DIRECTLY ALSO, BE FASTER THAN REFETCHING?
    } catch (err) {
      throw err.message;
    }
  },
};

// NEED A FUNCTION FOR SENDING BUG REPORTS OR SUGGESTIONS (BASICLY  requests)
//--SET UP ADMIN PROFILE: ✔
//--NEEDS TO HAVE ACCESS TO ALL MESSAGES (FILTERABLE FOR USER)
//--NEEDS OPTION TO REPLY TO USERS
//--NEEDS OPTION TO ACCEPT OR REJECT A REQUEST AND OPTIONALLY REPLY WITH A MESSAGE

//--USER:
//--NEEDS CARD FOR SENDING MESSAGES ✔
//--NEEDS FILTER OPTION FOR SEEING PENDING/ACCEPTED/REJECTED REQUESTS ✔
//--NEEDS 'REQUESTS' SECTIONS ON DATABASE ✔
//--NEEDS WAY TO SEE REPLIES FROM ADMIN
//--(REQUESTS WILL HAVE 'ACCEPTED' OR 'REJECTED' MARK WITH OPTIONAL MESSAGE ATTACHED)
