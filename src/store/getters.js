export default {
  auth(state) {
    return state.auth;
  },
  users(state) {
    return state.users;
  },
  goals(state) {
    return state.goals;
  },
  token(state) {
    return state.sessionToken;
  },
  userToken(state) {
    return state.userToken;
  },
  userId(state) {
    return state.userId;
  },
};
