export default {
  logout(context) {
    context.commit("logout");
  },
  setGoal(context, newGoal) {
    context.commit("setGoal", newGoal);
  },
  async deleteData(context, goalsToRemove) {
    const sessionToken = context.getters.sessionToken;
    const UID = context.getters.userToken;
    const curGoals = context.getters.userGoals;

    try {
      const deletePromises = goalsToRemove.map((goalId) => {
        const index = curGoals.findIndex(({ id }) => id === goalId);
        console.log(index);

        return fetch(
          `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${UID}/goals/${index}.json?auth=${sessionToken}`,
          {
            method: "DELETE",
          }
        );
      });

      const deleted = await Promise.allSettled(deletePromises);

      deleted.forEach((res) => {
        console.log(res.value);
        console.log(res);
        if (res.status === "rejected")
          throw new Error("Failed to fetch, invalid URL ");
        if (!res.value.ok) {
          throw new Error("Deleting failed");
        } else {
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

      const res = await fetch(
        `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${UID}.json?auth=${sessionToken}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goals: [...curGoals, payload.goal] }),
        }
      );

      const resData = await res.json();
      if (!res.ok) {
        const error = new Error(resData.message || "Failed to fetch");
        throw error;
      }

      // console.log(resData);
      context.dispatch("getData");
    } catch (err) {
      console.log(err.message);
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

      if (!res.ok) return "Failed fetching";

      let goals = [];
      let checkedGoals;

      if (resData) {
        checkedGoals = await context.dispatch("checkData", resData);
        goals = checkedGoals;
      }

      context.commit("loadGoals", goals);
    } catch (err) {
      console.log(err);
    }
  },
  async checkData(context, goalsToCheck) {
    const UID = context.getters.userToken;
    const sessionToken = context.getters.sessionToken;

    function rateCalc(start, end) {
      const totalTime = new Date(end).getTime() - new Date(start).getTime();
      const elapsedTime = Date.now() - new Date(start).getTime();
      const rate = (elapsedTime / totalTime) * 100;

      if (new Date(end).getTime() <= Date.now()) return 100;
      else {
        return Math.min(rate, 100).toFixed(0);
      }
    }

    let goals = [];
    let toBePatched = [];

    Object.values(goalsToCheck).forEach((goal) => {
      if (rateCalc(goal.started, goal.compDate) === 100) {
        goal.isCompleted = true;
        toBePatched.push(goal);
      } else {
        goals.push(goal);
      }
    });

    if (toBePatched.length > 0) {
      const patchPromises = toBePatched.map((goal) => {
        fetch(
          `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${UID}/goals.json?auth=${sessionToken}`,
          {
            method: "PATCH",
            body: JSON.stringify({ goal }),
          }
        );
      });

      console.log(patchPromises);
      const patched = await Promise.all(patchPromises);
      patched.forEach((res) => {
        console.log(res);

        if (!res.ok) {
          throw new Error(`Failed to patch goal `);
        } else {
          goals.push(res);
        }
      });
    }

    return goals;
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
      console.log(err);
      throw new Error("Could not Log In");
    }
  },
};
