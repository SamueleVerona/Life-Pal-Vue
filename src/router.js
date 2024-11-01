import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "./components/pages/LandingPage.vue";
import HomePage from "./components/pages/HomePage.vue";
import UserSign from "./components/pages/UserSign.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/landing" },
    { path: "/landing", component: LandingPage },
    {
      path: "/users",
      component: UserSign,
      children: [{ path: ":home", component: HomePage, props: true }],
    },
  ],
});

// router.beforeEnter((to, from, next)=>{
//   if(to === '/home' && from === 'users' )

// })

export default router;
