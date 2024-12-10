import { createStore } from "vuex";
import getters from "./getters.js";
import actions from "./actions.js";
import mutations from "./mutations.js";

const store = createStore({
  state() {
    return {
      sessionToken: null,
      userToken: null,
      tokenExp: null,
      userId: null,
      userGoals: [],
      expiredGoals: [],
    };
  },
  actions,
  mutations,
  getters,
});

export default store;
