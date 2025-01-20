export default {
  setUser(state, payload) {
    state.sessionToken = payload.sessionToken;
    state.userToken = payload.userToken;
    state.userIsAdmin = payload.isAdmin;
    state.userIsLocked = payload.isLockedUser;
    state.isAuth = payload.isAuth;
  },
  logout(state) {
    state.sessionToken = null;
    state.userToken = null;
    state.userIsAdmin = false;
    state.userIsLocked = true;
    state.isAuth = false;
  },
};
