import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "./components/pages/LandingPage.vue";
import HomePage from "./components/pages/HomePage.vue";
import UserSign from "./components/pages/UserSign.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/landing", component: LandingPage },
    { path: "/home", component: HomePage },
    { path: "/users", component: UserSign },
  ],
});

export default router;
