export default {
  logout(state) {
    state.sessionToken = null;
    state.userToken = null;
    state.tokenExp = null;
    state.userId = null;
  },

  setGoal(state, newGoal) {
    const userId = newGoal.userId;
    const goalToAdd = newGoal.newGoal;
    state.users.find((user) => user.email === userId).goals.push(goalToAdd);

    console.log("someting");
  },
  deleteData(state, goalsToRemove) {
    const userId = goalsToRemove.userId;
    const goalsArr = goalsToRemove.goalsArr;

    goalsArr.forEach((goalId) => {
      state.users.find(({ email }) => email === userId).goals = state.users
        .find(({ email }) => email === userId)
        .goals.filter((goal) => goal.id !== goalId);
    });
  },
  setUser(state, payload) {
    state.sessionToken = payload.sessionToken;
    state.userToken = payload.userToken;
    state.tokenExp = payload.tokenExp;
    state.userId = payload.email;
  },
  loadGoals(state, goals) {
    state.userGoals = goals;
  },
};
