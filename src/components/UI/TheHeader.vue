<template>
  <header>
    <h1>Life Pal</h1>
    <a :href="toHref" @click="goTo">{{ switchBtn }}</a>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, ref } from "vue";

const router = useRouter();
const thisRoute = useRoute();
const toHref = ref("");

const switchBtn = computed(() =>
  thisRoute.path === "/users" ? "Start Planning" : "Sign Up"
);

function goTo() {
  if (thisRoute.path === "/users") {
    router.push("/home");
    toHref.value = "/home";
  } else {
    router.push("/users");
    toHref.value = "/users";
  }
}
</script>

<style scoped>
* {
  font-size: 62.5%;
}

header {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 1rem 5rem;
  height: 10vh;
  background: linear-gradient(90deg, #b7f8db 0%, #50a7c2 100%);
}

h1 {
  font-size: 5rem;
}

a {
  text-decoration: none;
  font-size: 3rem;
  color: #2c3e50;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.816);
  padding: 1rem;
  border-radius: 10px;
}
a:active {
  color: rgb(224, 48, 133);
}
</style>
