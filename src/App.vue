<template>
  <router-view> </router-view>
</template>

<!-- <script>
import TheHeader from "./components/UI/TheHeader.vue";

export default {
  components: {
    TheHeader,
  },
};
</script> -->

<style>
:root {
  --fc-neutral-bg-color: rgba(200, 177, 246, 0.526);
  --glow-item-card-light: rgba(252, 178, 31, 0.336);
  --glow-item-card-dark: rgba(252, 178, 31, 0.781);
  --glow-dash-comp-dark: rgba(31, 252, 116, 0.781);
  --glow-dash-comp-light: rgba(31, 252, 116, 0.16);
  --glow-dash-fail-dark: rgb(255, 81, 81);
  --glow-dash-fail-light: rgba(255, 81, 81, 0.147);
  --item-goal-day: rgb(76, 159, 255);
  --item-goal-week: rgb(255, 100, 188);
  --item-goal-month: rgb(62, 209, 128);
  --basic-shadow: 0rem 0.3rem 0.8rem rgba(128, 128, 128, 0.434);

  --dialog-button-color-default-green: rgb(160, 255, 200);
  --dialog-button-color-default-earth: rgb(220, 160, 127);

  --dialog-button-color-delete: rgb(243, 243, 243);
  --dialog-button-color-delete-darker: rgb(255, 58, 58);

  --dialog-wrapper-color-default: rgb(140, 81, 249);
  --dialog-wrapper-color-delete: rgb(249, 81, 109);
}
#app {
  font-family: "Afacad Flux", Sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 62.5%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-style: normal;
  overflow: hidden;
}

@media screen and (max-width: 2048px) {
  html {
    font-size: 62.5%;
  }
}
@media screen and (max-width: 500px) {
  html {
    font-size: 50%;
  }
}
</style>
