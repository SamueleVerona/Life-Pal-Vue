let timer;
export default {
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
      const resError = resData.error.message.replaceAll("_", " ");
      console.warn(resData.error);

      throw new Error(
        resError[0] + resError.toLowerCase().slice(1) ||
          "Something is wrong with your credentials.\nCheck and try again"
      );
    }

    const isLockedUser =
      resData.localId === "BFQ0zvsDfFN3nZs8i9BHECOCSiH3" ||
      resData.localId === "55ZyLPwfc0UUdoBTJHgWAWQ9WIc2"
        ? true
        : false;

    const isAdmin = resData.localId === "2h8Fu1qGD5aF6ZUgzy7uD1ZVJB93";

    const tokenExpMS = +resData.expiresIn * 1000;
    const tokenExp = new Date().getTime() + tokenExpMS;

    timer = setTimeout(() => {
      context.dispatch("logout");
      return;
    }, tokenExpMS);

    localStorage.setItem("sessionToken", resData.idToken);
    localStorage.setItem("userToken", resData.localId);
    localStorage.setItem("tokenExp", tokenExp);
    localStorage.setItem("isAdmin", isAdmin);
    localStorage.setItem("isLockedUser", isLockedUser);

    context.commit("setUser", {
      sessionToken: resData.idToken,
      userToken: resData.localId,
      isAdmin,
      isLockedUser,
      isAuth: true,
    });

    context.dispatch("getData", { type: "all" });
  },
  async autoLogin(context) {
    const sessionToken = localStorage.getItem("sessionToken");
    const userToken = localStorage.getItem("userToken");
    const tokenExp = localStorage.getItem("tokenExp");
    const isAdmin = localStorage.getItem("isAdmin");
    const isLockedUser = localStorage.getItem("isLockedUser");

    const newTokenExp = +tokenExp - new Date().getTime();
    if (newTokenExp < 1000) {
      context.dispatch("logout");
      return Promise.resolve(false);
    }

    timer = setTimeout(() => {
      context.dispatch("logout");
    }, newTokenExp);

    if (sessionToken && userToken) {
      context.commit("setUser", {
        sessionToken,
        userToken,
        isAdmin: JSON.parse(isAdmin),
        isLockedUser: JSON.parse(isLockedUser),
        isAuth: true,
      });

      await context.dispatch("getData", { type: "all" });
      return Promise.resolve(true);
    }

    context.dispatch("logout");
    return Promise.resolve(false);
  },
  logout(context) {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("tokenExp");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isLockedUser");

    clearTimeout(timer);
    context.dispatch("resetData");
    context.commit("logout");
  },

  async deleteAccount(context) {
    const token = context.getters.sessionToken;

    const dataDeleted = await context.dispatch("deleteData", {
      type: "account",
    });
    if (dataDeleted) {
      const delRequest = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyBBOAHr41imvdiIj9qPxRR0Ek2AZr_iTH",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken: token }),
        }
      );

      const resData = await delRequest.json();

      if (!delRequest.ok) {
        console.warn(resData.error.code, resData.error.message);
        throw new Error(
          resData.error.message || "Couldn't delete your account.\nTry again"
        );
      }

      context.commit("logout");
    }
  },
};
