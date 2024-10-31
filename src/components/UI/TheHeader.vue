<template>
  <header>
    <h1>Life Pal</h1>
    <router-link :to="goTo">{{ switchBtn }}</router-link>
    <h2 id="user" v-if="!user.value">
      {{ sessionID }}
    </h2>
    <button id="logout" @click="logout" v-if="!user.value">Logout</button>
  </header>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, ref, onUpdated, onBeforeMount } from "vue";
import { useStore } from "vuex";

const thisRoute = useRoute();
const store = useStore();
const user = ref("");
onBeforeMount(() => (user.value = store.getters.auth.userId));

onUpdated(() => (user.value = store.getters.auth.userId));

const sessionID = computed(() => {
  if (user.value === "") return "Login";
  else {
    return user.value;
  }
});

const switchBtn = computed(() =>
  thisRoute.path === "/users" ? "Start Planning" : "Sign Up"
);

const goTo = computed(() => {
  if (thisRoute.path === "/users") {
    return "/home";
  } else {
    return "/users";
  }
});

function logout() {
  store.dispatch("logout");
  user.value = store.getters.auth.userId;
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

a,
#user,
#logout {
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
