import { createStore } from "vuex";

import authModule from "./auth/index.js";
import dataModule from "./data/index.js";

const store = createStore({
  modules: {
    authModule,
    dataModule,
  },
});

export default store;
