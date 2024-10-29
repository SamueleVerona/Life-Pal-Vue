<template>
  <router-view>
    <!-- <landing-page> </landing-page> -->
    <home-page></home-page>
  </router-view>
</template>

<script>
// import LandingPage from "./components/pages/LandingPage.vue";
import HomePage from "./components/pages/HomePage.vue";
export default {
  components: {
    // LandingPage,
    HomePage,
  },
};
</script>

<style>
#app {
  font-family: "Poppins", sans-serif;
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
