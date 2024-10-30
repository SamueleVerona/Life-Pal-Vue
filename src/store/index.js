import { createStore } from "vuex";
import getters from "./getters.js";
import actions from "./actions.js";
import mutations from "./mutations.js";

const store = createStore({
  state() {
    return {
      goals: [
        {
          id: "g1",
          title: "Prearazione",
          desc: "mi preparo",
          date: "",
          type: "day",
        },
        {
          id: "g2",
          title: "Gestione",
          desc: "mi gestisco",
          date: "",
          type: "week",
        },
        {
          id: "g3",
          title: "Azione",
          desc: "mi attivo",
          date: "",
          type: "month",
        },
        {
          id: "g4",
          title: "Azione",
          desc: "mi attivo",
          date: "",
          type: "month",
        },
      ],
      timeDivisions: ["Days", "Weeks", "Months", "Years", "Decades"],
    };
  },
  actions,
  mutations,
  getters,
});

export default store;
