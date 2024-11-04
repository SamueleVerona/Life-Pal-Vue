import { createStore } from "vuex";
import getters from "./getters.js";
import actions from "./actions.js";
import mutations from "./mutations.js";

const store = createStore({
  state() {
    return {
      auth: {
        userId: "",
        userPwd: "",
      },
      users: [
        {
          email: "test@test",
          password: "ppp",
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
            {
              id: "g5",
              title: "Esempio",
              desc: "desc es",
              date: "",
              type: "month",
            },
          ],
        },
        {
          email: "zulu@zulu",
          password: "ggg",
          goals: [
            {
              id: "g1",
              title: "Zulu prep",
              desc: "mi preparo",
              date: "",
              type: "day",
            },
            {
              id: "g2",
              title: "Zulu gest",
              desc: "mi gestisco",
              date: "",
              type: "week",
            },
            {
              id: "g3",
              title: "Zulu act",
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
        },
      ],
    };
  },
  actions,
  mutations,
  getters,
});

export default store;
