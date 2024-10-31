export default {
  userLogin(context, userCred) {
    const users = context.rootGetters.users;
    console.log(userCred);

    users.forEach((user) => {
      if (
        user.email === userCred.email &&
        user.password === userCred.password
      ) {
        context.commit("userLogin", userCred);
        console.log("same creds");
      } else {
        context.commit("setNewUser", userCred);
      }
    });

    // context.commit("userLogin", userCred);
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
