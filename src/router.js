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
      props: true,
    },
    {
      name: "user-home",
      path: "/userHome",
      component: UserHome,
      props: true,
      beforeEnter(to, from, next) {
        if (store.getters.userToken) {
          to.meta.userId = store.getters.userToken;
          to.meta.isAuth = true;
          next();
        } else {
          to.meta.isAuth = false;

          next("/landing");
        }
      },
    },
  ],
});

// router.beforeEach((to, from, next) => {
//   if (to.name === "user-home" && store.getters.auth.userID) next();
//   else {
//     next(false);
//   }
// });

export default router;
