<template>
  <nav>
    <ul>
      <li>
        <button
          type="button"
          id="button-calendar"
          data-button-id="calendar"
          class="btn-primary-nav flip-button"
          :class="{ flipped: props.toggleProfile || $props.isAdmin }"
          :disabled="props.toggleProfile || isAdmin"
        >
          <span class="front" inert>calendar</span>
          <span class="back" inert>dash:</span>
        </button>
      </li>
      <li>
        <button
          type="button"
          id="button-dash"
          class="btn-primary-nav flip-button"
          :class="{ flipped: props.toggleProfile || $props.isAdmin }"
          data-button-id="dashboard"
        >
          <span class="front" inert>goals</span>
          <span class="back" inert>requests</span>
        </button>
      </li>
      <li>
        <button
          type="button"
          id="button-profile"
          class="btn-primary-nav"
          data-button-id="profile"
          :disabled="props.isAdmin"
        ></button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps(["toggleProfile", "isAdmin"]);
</script>

<style scoped>
* {
  font-family: "Poppins", Sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
nav {
  position: relative;
}
ul {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  background: transparent;
  border-radius: 60px;
}

.btn-primary-nav {
  flex: 1;
  box-sizing: border-box;
  width: max-content;
  height: 100%;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  margin: 0rem 0.5rem;
  font-size: 3rem;
  font-family: inherit;
  font-weight: bolder;
  background: none;
  border: solid 1px rgb(218, 218, 218);
  border-bottom: solid 3px rgb(218, 218, 218);
}
.btn-primary-nav.flip-button {
  height: 100%;
  position: relative;
  min-width: 16rem;
}

.btn-primary-nav.flip-button span {
  height: 100%;
  width: 100%;
  font-size: 3rem;
  top: 0;
  left: 0;
  transition: all 0.4s;
}

button:active {
  border: solid 1px rgb(1, 217, 229);
  border-bottom: solid 2px rgb(0, 242, 255);
  color: rgb(4, 167, 172);
}
.front {
  display: block;
  backface-visibility: hidden;
  transform: rotateX(0deg);
}
.flip-button.flipped > .front {
  opacity: 0;
  transform: rotateX(180deg);
}
.back {
  align-items: center;
  justify-content: center;
  display: flex;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  backface-visibility: hidden;
  transform: rotateX(180deg);
  opacity: 0;
  /* border: solid; */
  line-height: 3rem;
}

.flip-button.flipped > .back {
  transform: rotateX(0deg);
  opacity: 1;
}

#button-calendar.flipped {
  border-color: transparent;
  /* padding: 0rem; */
  /* margin: 0; */
  /* width: max-content; */
}

#button-profile {
  height: 6rem;
  aspect-ratio: 1/1;
  background-image: url(/src/assets/user.png);
  background-size: cover;
}
</style>
