function filterGoals(goalsArr) {
  const finished = goalsArr.filter((goal) => goal.isCompleted || goal.isFailed);

  const unfinished = goalsArr.filter(
    (goal) => !goal.isCompleted && !goal.isFailed
  );

  return { finished, unfinished };
}

export default {
  deleteData(state, goalsToRemove) {
    const userId = goalsToRemove.userId;
    const goalsArr = goalsToRemove.goalsArr;
    goalsArr.forEach((goalId) => {
      state.users.find(({ email }) => email === userId).goals = state.users
        .find(({ email }) => email === userId)
        .goals.filter((goal) => goal.id !== goalId);
    });
  },
  loadData(state, data) {
    const filteredGoals = filterGoals(data.goals);

    state.allRequests = data.requests;
    state.userGoals = data.goals;
    state.finishedGoals = filteredGoals.finished;
    state.unfinishedGoals = filteredGoals.unfinished;
  },
  loadGoals(state, goals) {
    const filteredGoals = filterGoals(goals);

    state.userGoals = goals;
    state.finishedGoals = filteredGoals.finished;
    state.unfinishedGoals = filteredGoals.unfinished;
  },
  loadRequests(state, requests) {
    state.allRequests = requests;
  },
  setExpiredGoals(state, expGoals) {
    state.expiredGoals = expGoals;
  },
};
