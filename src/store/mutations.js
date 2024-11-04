export default {
  userLogin(state, userCred) {
    state.auth.userId = userCred.email;
    state.auth.userPwd = userCred.password;
  },
  setNewUser(state, userCred) {
    state.users.push(userCred);
    state.auth.userId = userCred.email;
    state.auth.userPwd = userCred.password;
  },
  logout(state) {
    state.auth.userId = "";
    state.auth.userPwd = "";
  },

  setGoal(state, newGoal) {
    const userId = newGoal.userId;
    const goalToAdd = newGoal.newGoal;
    state.users.find((user) => user.email === userId).goals.push(goalToAdd);
  },
  remGoal(state, goalsToRemove) {
    const userId = goalsToRemove.userId;
    const goalsArr = goalsToRemove.goalsArr;

    console.log(goalsToRemove);

    goalsArr.forEach((goalId) => {
      state.users.find(({ email }) => email === userId).goals = state.users
        .find(({ email }) => email === userId)
        .goals.filter((goal) => goal.id !== goalId);
    });
  },
};
