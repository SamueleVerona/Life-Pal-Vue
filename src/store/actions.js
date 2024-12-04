export default {
  logout(context) {
    context.commit("logout");
  },
  async deleteData(context, goalsToRemove) {
    const sessionToken = context.getters.sessionToken;
    const UID = context.getters.userToken;
    const curGoals = context.getters.userGoals;
    console.log(goalsToRemove);

    try {
      const validNames = new Set(curGoals.map(({ name }) => name));
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

      deleted.forEach((res) => {
        if (res.status === "rejected")
          throw new Error(res.reason || "Failed to fetch, invalid URL ");
        else {
          context.dispatch("getData");
        }
      });
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
  checkData(_, goalsToCheck) {
    function checkCompletion(goal) {
      const totalTime =
        new Date(goal.compDate).getTime() - new Date(goal.started).getTime();
      const elapsedTime = Date.now() - new Date(goal.started).getTime();
      const rate = (elapsedTime / totalTime) * 100;
      if (rate === 100 || rate < 0) {
        return true;
      } else {
        return false;
      }
    }
    const checked = Object.entries(goalsToCheck).map((goal) => {
      if (!goal[1].name) goal[1].name = goal[0];
      checkCompletion(goal[1]) === true
        ? goal[1].isCompleted
        : (goal[1].isCompleted = false);
      return goal[1];
    });

    return checked;
  },
  async signUp(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "signUp",
    });
  },
  async logIn(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "logIn",
    });
  },
  async auth(context, payload) {
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBBOAHr41imvdiIj9qPxRR0Ek2AZr_iTHk";

    if (payload.mode === "signUp") {
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
};
