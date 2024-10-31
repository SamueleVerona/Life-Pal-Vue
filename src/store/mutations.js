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
    state.goals.push(newGoal);
  },
  remGoal(state, goalIdArr) {
    goalIdArr.forEach((id) => {
      state.goals = state.goals.filter((goal) => goal.id !== id);
    });
  },
};
