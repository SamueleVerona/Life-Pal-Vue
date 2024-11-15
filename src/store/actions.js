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

    let updGoals = [];

    goalsToRemove.goalsArr.forEach((id) =>
      curGoals.forEach((goal) => {
        if (goal.id !== id) updGoals.push(goal);
        else {
          updGoals = [];
        }
      })
    );
    context.state.userGoals = updGoals;

    try {
      const res = await fetch(
        `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${UID}.json?auth=${sessionToken}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goals: [...updGoals] }),
        }
      );

      const resData = await res.json();
      // console.log(res);
      if (!res.ok) {
        const error = new Error(resData.message || "Failed to fetch");
        throw error;
      }

      // console.log(resData);
      // context.dispatch("getData");
    } catch (err) {
      console.log(err.message);
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
    function rateCalc(start, end) {
      const totalTime = new Date(end).getTime() - new Date(start).getTime();
      const elapsedTime = Date.now() - new Date(start).getTime();
      const rate = (elapsedTime / totalTime) * 100;

      if (new Date(end).getTime() <= Date.now()) return 100;
      else {
        return Math.min(rate, 100).toFixed(0);
      }
    }

    try {
      const UID = context.getters.userToken;
      const token = context.getters.sessionToken;

      const res = await fetch(
        `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${UID}/goals.json?auth=${token}`
      );

      const resData = await res.json();
      if (!res.ok) return "Failed fetching";

      const goals = [];

      resData.forEach(async (goal) => {
        if (rateCalc(goal.started, goal.compDate) === 100) {
          goal.isCompleted = true;

          const res = await fetch(
            `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users/${UID}/goals.json?auth=${token}`,
            {
              method: "PATCH",
              body: JSON.stringify({ goal }),
            }
          );

          if (!res.ok) throw new Error("Patching Failed");
          console.log(res.json());
        }
        goals.push(goal);
      });

      context.commit("loadGoals", goals);
    } catch (err) {
      console.log(err);
    }
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

      if (payload.mode === "logIn") context.dispatch("getData");

      // if (payload.mode === "signUp")
      //   context.dispatch("sendData", {
      //     isFirstGoal: true,
      //     goal: {
      //       id: "g0",
      //       title: "A goal",
      //       desc: "goal's description",
      //       type: "day",
      //       isCompleted: false,
      //       started: "",
      //       compDate: "",
      //     },
      //   });
    } catch (err) {
      console.log(err);
      throw new Error("Could not Log In");
    }
  },
};
