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
              type: "day",
              isCompleted: false,
              started: "2024-11-05",
              compDate: "2025-01-04",
            },
            {
              id: "g2",
              title: "Gestione",
              desc: "mi gestisco",
              type: "week",
              isCompleted: false,
              started: "2024-11-05",
              compDate: "2025-01-04",
            },
            {
              id: "g3",
              title: "Azione",
              desc: "mi attivo",
              type: "month",
              isCompleted: false,
              started: "2024-11-05",
              compDate: "2025-01-04",
            },
            {
              id: "g4",
              title: "Azione",
              desc: "mi attivo",
              type: "year",
              isCompleted: true,
              started: "2024-06-04",
              compDate: "2024-11-05",
            },
            {
              id: "g5",
              title: "Esempio",
              desc: "desc es",
              type: "month",
              isCompleted: false,
              started: "2024-11-05",
              compDate: "2025-11-04",
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
