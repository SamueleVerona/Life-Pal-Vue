import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "./components/pages/LandingPage.vue";
import UserHome from "./components/pages/UserHome.vue";
import UserSign from "./components/pages/UserSign.vue";
import store from "./store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/landing" },
    { path: "/landing", component: LandingPage },
    {
      path: "/userSign",
      component: UserSign,
      async beforeEnter(_, _1, next) {
        const tryLogin = await store.dispatch("autoLogin");
        tryLogin ? next("/userHome") : next();
      },
    },

    {
      name: "user-home",
      path: "/userHome",
      component: UserHome,
      beforeEnter(_, _1, next) {
        const isAuth = store.getters.isAuth;
        isAuth ? next() : next("/userSign");
      },
    },
    { path: "/:catchAll(.*)", redirect: "/landing" },
  ],
});

export default router;
