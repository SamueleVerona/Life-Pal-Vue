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
      throw new Error(
        resData.error.message.replace("_", " ").toLowerCase() ||
          "Something went wrong"
      );
    }

    const isAdmin = resData.localId === "2h8Fu1qGD5aF6ZUgzy7uD1ZVJB93";

    context.commit("setUser", {
      sessionToken: resData.idToken,
      userToken: resData.localId,
      tokenExp: resData.expiresIn,
      email: resData.email,
      isAdmin,
    });

    context.dispatch("getData", { type: "all" });
  },
  logout(context) {
    context.commit("logout");
  },
};
