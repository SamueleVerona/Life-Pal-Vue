export default {
  logout(state) {
    state.sessionToken = null;
    state.userToken = null;
    state.tokenExp = null;
    state.userId = null;
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
  setExpiredGoals(state, expGoals) {
    state.expiredGoals = expGoals;
  },
};
