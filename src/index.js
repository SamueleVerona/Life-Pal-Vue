import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "./components/pages/LandingPage.vue";
import HomePage from "./components/pages/HomePage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/landing", component: LandingPage },
    { path: "/home", component: HomePage },
  ],
});

export default router;
