export default {
  logout(context) {
    context.commit("logout");
  },
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
      let urlMod;
      let method;
      let body;

      if (curGoals.length > 0) {
        urlMod = UID + "/goals";
        method = "POST";
        body = JSON.stringify(payload);
      } else {
        const id = Date.now().toString(36);
        urlMod = UID;
        method = "PUT";
        body = JSON.stringify({ goals: { [id]: payload } });
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
        const error = new Error(resData.message || "Failed to load new goal");
        throw error;
      }

      context.dispatch("getData");
    } catch (err) {
      throw err.message;
    }
  },
  async getData(context) {
    try {
      const UID = context.getters.userToken;
      const token = context.getters.sessionToken;

      const res = await fetch(
        `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${UID}/goals.json?auth=${token}`
      );

      const resData = await res.json();
      if (!res.ok) throw new Error("Failed fetching");

      let goals = [];

      if (resData) {
        goals = await context.dispatch("checkData", resData);
      }
      context.commit("loadGoals", goals);
    } catch (err) {
      throw err.message;
    }
  },
  checkData(context, goalsToCheck) {
    const TODAY_MS = Date.now();
    // function checkCompletion(goal) {
    //   const totalTime =
    //     new Date(goal.compDate).getTime() - new Date(goal.started).getTime();
    //   const elapsedTime = Date.now() - new Date(goal.started).getTime();
    //   const rate = (elapsedTime / totalTime) * 100;
    //   if (rate === 100 || rate < 0) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }

    function checkforCompletion(goal) {
      const completionTime =
        typeof goal.compDate === "number"
          ? goal.compDate
          : new Date(goal.compDate).getTime();

      if (TODAY_MS >= completionTime && !goal.isCompleted && !goal.isFailed)
        return true;
      else false;
    }

    const expired = [];

    const checkedGoals = Object.entries(goalsToCheck).map((goal) => {
      if (!goal[1].databaseId) goal[1].databaseId = goal[0];

      const isExpired = checkforCompletion(goal[1]);

      if (isExpired) {
        expired.push(goal[1]);
      }

      return goal[1];
    });
    context.commit("setExpiredGoals", expired);

    console.log(context.getters.expiredGoals);

    return checkedGoals;
  },
  async signup(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "signup",
    });
  },
  async login(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "login",
    });
  },
  async auth(context, payload) {
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBBOAHr41imvdiIj9qPxRR0Ek2AZr_iTHk";

    if (payload.mode === "signup") {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBBOAHr41imvdiIj9qPxRR0Ek2AZr_iTHk";
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Failed to Log In");
      }

      context.commit("setUser", {
        sessionToken: resData.idToken,
        userToken: resData.localId,
        tokenExp: resData.expiresIn,
        email: resData.email,
      });

      context.dispatch("getData");
    } catch (err) {
      throw new Error("Could not Log In");
    }
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
      //WOULD PATCHING THE LOCAL COPY DIRECTLY ALSO BE FASTER THAN REFETCHING?
    } catch (err) {
      throw err.message;
    }
  },

  //pseudoFunction(){
  //get goals from database
  // check if there's no remaining time for every goal,
  // if time is zero display modal for goals that need confirmation,
  // get goal's id,
  //add a "MARK AS COMPLETED" or "MARK AS FAILED" button,
  //change the corresponding property to true or false,
  //send data back to database and to local copy,
  //resume normal funcioning
  // once every

  // }
};
