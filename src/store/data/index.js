import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const dataModule = {
  state() {
    return {
      userGoals: [],
      finishedGoals: [],
      unfinishedGoals: [],
      expiredGoals: [],
      allRequests: [],
    };
  },
  mutations,
  getters,
  actions,
};

export default dataModule;
