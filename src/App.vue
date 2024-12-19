<template>
  <the-header></the-header>
  <router-view> </router-view>
</template>

<script>
import TheHeader from "./components/UI/TheHeader.vue";

export default {
  components: {
    TheHeader,
  },
};
</script>

<style>
:root {
  --fc-neutral-bg-color: rgba(200, 177, 246, 0.526);
}
#app {
  font-family: "Afacad Flux", Sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-style: normal;
  font-size: 62.5%;
  overflow: hidden;
}
</style>
