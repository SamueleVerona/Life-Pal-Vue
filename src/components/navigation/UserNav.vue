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
          <span class="back" inert>dashboard:</span>
        </button>
      </li>
      <li>
        <button
          type="button"
          id="button-dash"
          class="btn-primary-nav flip-button"
          :class="{ flipped: props.toggleProfile || $props.isAdmin }"
          :disabled="props.toggleProfile || props.isAdmin"
          data-button-id="dashboard"
        >
          <span class="front" inert>dashboard</span>
          <span class="back" inert>requests</span>
        </button>
      </li>
      <li>
        <button
          type="button"
          id="button-unsub"
          class="btn-primary-nav"
          data-button-id="unsub"
          v-if="!props.isAdmin && props.toggleProfile && !props.isLocked"
        >
          delete account
        </button>
      </li>
      <li>
        <button
          type="button"
          id="button-log"
          class="btn-primary-nav"
          v-if="props.toggleProfile || props.isAdmin"
          data-button-id="log"
        >
          log out
        </button>
      </li>
      <li>
        <button
          type="button"
          id="button-profile"
          class="btn-primary-nav"
          data-button-id="profile"
          :disabled="props.isAdmin"
          :toggled="props.toggleProfile"
        ></button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps(["toggleProfile", "isAdmin", "isLocked"]);
</script>

<style scoped>
* {
  font-family: "Poppins", Sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* color: #2c3e50; */
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
}

.btn-primary-nav {
  flex: 1;
  box-sizing: border-box;
  width: max-content;
  padding: 0.5rem 1rem;

  font-size: 3rem;
  font-family: inherit;
  font-weight: bolder;
  background: none;
  border: none;
  color: inherit;

  cursor: pointer;
  transition: color 0.1s ease-out;
}
#button-calendar {
  border-right: solid 1px rgb(218, 218, 218);
}
#button-calendar.flipped {
  border: none;
}

.btn-primary-nav.flip-button {
  height: 100%;
  position: relative;
}

span {
  display: block;
  height: 100%;
  font-size: 3rem;

  transition: transform 0.4s ease;
}

span.front {
  backface-visibility: hidden;
  transform: rotateX(0deg);
}

span.back {
  position: absolute;
  align-content: center;
  top: 0;
  left: 0;

  min-width: 100%;

  backface-visibility: hidden;
  transform: rotateX(180deg);
  opacity: 0;
  line-height: 3rem;
}
.btn-primary-nav.flip-button.flipped {
  width: 20rem;
  border: none;
}

.flip-button.flipped .front {
  opacity: 0;
  transform: rotateX(180deg);
}

.flip-button.flipped span.back {
  transform: rotateX(0deg);
  opacity: 1;
}
#button-dash.flipped {
  width: 16rem;
}

.btn-primary-nav:not(:disabled):hover {
  color: rgb(4, 167, 172);
}
button:not(:disabled):active {
  border-color: rgb(1, 217, 229);
  color: rgb(4, 167, 172);
}

#button-profile {
  margin-left: 0.5rem;
  margin-right: 2rem;
  height: 6rem;
  aspect-ratio: 1/1;
  background-image: url(/src/assets/user.png);
  background-size: cover;
  background-clip: border-area;
  border: solid 2px rgb(221, 221, 221);
  border-radius: 100%;
  transition: all 0.2s ease;
}

#button-profile:hover,
#button-profile[toggled="true"] {
  border-color: rgb(1, 217, 229);
}
#button-log {
  border: none;
  border-left: solid 1px rgb(218, 218, 218);

  color: rgb(0, 145, 255);
}
#button-unsub {
  border: none;
  border-left: solid 1px rgb(218, 218, 218);

  color: rgb(121, 0, 127);
}
#button-log:hover,
#button-unsub:hover {
  color: rgb(255, 0, 38);
}

@media screen and (max-width: 900px) {
  #button-calendar.flipped {
    display: none;
  }
}

@media screen and (max-width: 600px) {
  .btn-primary-nav.flip-button.flipped {
    display: none;
  }
  .btn-primary-nav,
  span {
    font-size: 2.5rem;
  }
  #button-log {
    border: none;
  }
  #button-unsub {
    border: none;

    border-right: solid 1px rgb(218, 218, 218);
  }
}
</style>
