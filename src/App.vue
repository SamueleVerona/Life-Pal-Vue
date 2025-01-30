<template>
  <router-view v-slot="slotProps">
    <transition name="app">
      <component :is="slotProps.Component"></component>
    </transition>
  </router-view>
</template>

<style lang="scss">
@import "@/assets/styles/fonts.css";
@mixin global-format {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
  overflow: hidden;
}

* {
  @include global-format;
  &::before,
  &::after {
    @include global-format;
  }
  font-family: "Helvetica Neue"-apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Arial, sans-serif;
  font-kerning: none;
}

html {
  -webkit-text-size-adjust: 100%;
  color: #2c3e50;
}

body {
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}

:root {
  --font-stack: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI",
    Roboto, Arial, sans-serif;
  --fc-neutral-bg-color: rgba(200, 177, 246, 0.526);

  --hover-default: rgb(0, 201, 208);
  --active-default: rgb(0, 159, 164);

  --confirm-default: white;
  --confirm-delete: rgb(243, 243, 243);
  --confirm-delete-hover: rgb(255, 58, 58);

  --confirm-change: rgb(160, 255, 200);
  --warning: rgb(220, 160, 127);
  --warning-dark: rgb(219, 139, 96);

  --danger-light: rgb(249, 81, 109);
  --danger-dark: rgb(255, 58, 58);

  --glow-default-light: rgba(252, 178, 31, 0.336);
  --glow-default-dark: rgba(252, 178, 31, 0.781);

  --glow-positive-light: rgba(31, 252, 116, 0.16);
  --glow-positive-dark: rgba(31, 252, 116, 0.781);

  --glow-negative-dark: rgb(255, 81, 81);
  --glow-negative-light: rgba(255, 81, 81, 0.147);

  --theme-bkg: linear-gradient(70deg, #d9eef81b 20%, #e7dfffdb 100%);
  --theme-secondary-light: rgb(144, 224, 174);
  --theme-secondary-mid: rgb(115, 209, 149);
  --theme-secondary-dark: rgb(91, 176, 123);

  --theme-primary-light: rgb(166, 161, 255);
  --theme-primary-mid: rgb(140, 134, 255);
  --theme-primary-dark: rgb(112, 104, 255);
  --theme-day: rgb(76, 159, 255);
  --theme-week: rgb(170, 74, 129);
  --theme-month: rgb(55, 185, 113);

  --basic-shadow: 0.2rem 0.4rem 0.8rem rgba(128, 128, 128, 0.434);
}

#app {
  display: block;

  @mixin default-flex-centered {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.app-enter-from {
  opacity: 0;
}
.app-leave-to {
  opacity: 0;
}

.app-enter-active {
  transition: opacity 0.7s ease;
}
.app-leave-active {
  transition: opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.app-enter-to,
.app-leave-from {
  opacity: 1;
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
