export default {
  setUser(state, payload) {
    state.sessionToken = payload.sessionToken;
    state.userToken = payload.userToken;
    state.tokenExp = payload.tokenExp;
    state.userId = payload.email;
    state.userIsAdmin = payload.isAdmin;
  },
  logout(state) {
    state.sessionToken = null;
    state.userToken = null;
    state.tokenExp = null;
    state.userId = null;
    state.userIsAdmin = false;
  },
};
