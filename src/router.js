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
      path: "/:userId",
      component: UserHome,
      props: true,
      beforeEnter(to, fom, next) {
        if (store.getters.userToken) {
          to.params.userId = store.getters.userToken;
          to.params.isAuth = true;
          to.params.goalType = "";
          next();
        } else {
          to.params.isAuth = false;

          next("/userSign");
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
