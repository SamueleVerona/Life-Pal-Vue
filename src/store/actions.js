export default {
  userLogin(context, userCred) {
    const users = context.rootGetters.users;

    users.forEach((user) => {
      if (
        user.email === userCred.email &&
        user.password === userCred.password
      ) {
        context.commit("userLogin", userCred);
        console.log("same creds");
      } else {
        throw new Error("This user doesn't exist! Sign up instead!");
      }
    });

    // context.commit("userLogin", userCred);
  },
  setNewUser(context, userCred) {
    const users = context.rootGetters.users;

    if (users.some((user) => user.email === userCred.email)) {
      // console.log("setUser error");
      throw new Error("User already exists! Log in insted");
    } else if (!userCred.email) {
      // console.log("setUser error");

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
  remGoal(context, goalIdArr) {
    context.commit("remGoal", goalIdArr);
  },
};
