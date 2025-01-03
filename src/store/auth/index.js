import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const authModule = {
  state() {
    return {
      sessionToken: null,
      userToken: null,
      tokenExp: null,
      userId: null,
      userIsAdmin: false,
    };
  },
  mutations,
  actions,
  getters,
};

export default authModule;
