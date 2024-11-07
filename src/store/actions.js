export default {
  userLogin(context, userCred) {
    const users = context.getters.users;

    if (
      users.some(
        (user) =>
          user.email === userCred.email && user.password === userCred.password
      )
    ) {
      context.commit("userLogin", userCred);
    } else {
      throw new Error("This user doesn't exist! Sign up instead!");
    }
  },
  setNewUser(context, userCred) {
    const users = context.rootGetters.users;

    if (users.some((user) => user.email === userCred.email)) {
      throw new Error("User already exists! Log in insted");
    } else if (!userCred.email) {
      throw new Error("Fields must not be empty");
    } else {
      context.commit("setNewUser", userCred);
    }
  },
  logout(context) {
    context.commit("logout");
  },
  setGoal(context, newGoal) {
    context.commit("setGoal", newGoal);
  },
  remGoal(context, goalsToRemove) {
    context.commit("remGoal", goalsToRemove);
  },

  async sendData(context, payload) {
    try {
      // const newUser = payload.userToken;

      const token = payload.token;

      const res = await fetch(
        ` https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=` +
          token,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goals: [] }),
        }
      );

      const resData = await res.json();
      if (!res.ok) {
        console.log(resData);
        const error = new Error(resData.message || "Failed to fetch");
        throw error;
      }

      console.log(resData);
    } catch (err) {
      console.log(err.message);
    }
  },
  async getData(context) {
    // const userId = context.getters.userToken;
    const token = context.getters.token;

    const res = await fetch(
      `https://life-pal-89067-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=` +
        token
    );

    const resData = res.json();

    if (!res.ok) return "Failed fetching";

    return resData;
  },
  async signUp(context, payload) {
    // key = AIzaSyBBOAHr41imvdiIj9qPxRR0Ek2AZr_iTHk

    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBBOAHr41imvdiIj9qPxRR0Ek2AZr_iTHk",
        {
          method: "POST",
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }),
        }
      );
      const resData = await res.json();
      if (!res.ok) {
        console.log(resData);
        throw new Error(resData.message || "Failed to Sign Up");
      }
      context.commit("setUser", {
        sessionToken: resData.idToken,
        userToken: resData.localId,
        tokenExp: resData.expiresIn,
        email: resData.email,
      });

      context.dispatch("sendData", {
        token: resData.idToken,
        userToken: resData.localId,
      });
      throw new Error("Signed Up successfully");
    } catch (err) {
      throw err.message;
    }
  },
  async signIn(context, payload) {
    // key = AIzaSyBBOAHr41imvdiIj9qPxRR0Ek2AZr_iTHk

    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBBOAHr41imvdiIj9qPxRR0Ek2AZr_iTHk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }),
        }
      );
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
    } catch (err) {
      console.log(err);
      throw new Error("Could not Log In");
    }
  },
};
