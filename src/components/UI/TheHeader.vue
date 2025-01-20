<template>
  <header>
    <h1>Life Pal</h1>
    <router-link :to="toPath">{{ pathText }}</router-link>
  </header>
</template>

<script setup>
import { useRoute } from "vue-router";
// import { useStore } from "vuex";
import { computed } from "vue";

const route = useRoute();
// const store = useStore();
const pathText = computed(() => (route.params.isAuth ? "Log Out" : "Sign In"));
const toPath = computed(() => (route.params.isAuth ? "/landing" : "UserSign"));
</script>

<style scoped>
* {
  font-size: 62.5%;
}

header {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 1rem 1rem;
  height: 10vh;
  background: linear-gradient(90deg, #b7f8db 0%, #50a7c2 100%);
}

h1 {
  font-size: 5rem;
  text-wrap: nowrap;
}

#user {
  text-decoration: none;
  font-size: 3rem;
  color: #2c3e50;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.816);
  padding: 0.5rem 1rem;
  border-radius: 10px;
}

#logout {
  color: #d26262;
  border-radius: 30px;
  font-size: 2.5rem;
  font-weight: 600;
  padding: 1rem;
  border: none;
  text-wrap: nowrap;
}

a:active {
  color: rgb(224, 48, 133);
}

a {
  color: #bc6060;

  text-decoration: none;
  font-size: 3rem;
  background: rgba(255, 255, 255, 0.816);
  padding: 1rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
}

a:hover {
  color: #60bcb3;
  cursor: pointer;
}
</style>
