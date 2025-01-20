import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const authModule = {
  state() {
    return {
      sessionToken: null,
      userToken: null,
      userIsAdmin: false,
      userIsLocked: true,
      isAuth: false,
    };
  },
  mutations,
  actions,
  getters,
};

export default authModule;
