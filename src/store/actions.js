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
};
