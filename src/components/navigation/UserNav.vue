<template>
  <nav>
    <ul>
      <li>
        <button
          id="button-calendar"
          :disabled="activeFlag"
          @mousedown="switchActive"
        >
          calendar
        </button>
      </li>
      <li>
        <button
          id="button-dash"
          :disabled="!activeFlag"
          @mousedown="switchActive"
        >
          dashboard
        </button>
      </li>
      <li></li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const activeFlag = ref(false);
function switchActive() {
  activeFlag.value = !activeFlag.value;
}
</script>

<style scoped>
* {
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
ul {
  padding: 0;
  list-style: none;
  background: transparent;
  display: flex;
  justify-content: space-evenly;
  height: 100%;
}

button {
  box-sizing: border-box;
  width: max-content;
  height: 100%;
  padding: 0.5rem 1.5rem;
  /* border: solid 1px rgb(218, 218, 218);

  border-bottom: solid 4px rgb(218, 218, 218); */
  border-radius: 30px;

  margin: 0rem 0.5rem;
  font-size: 3rem;
  font-family: inherit;
  font-weight: bolder;
  background: none;
}
button:disabled,
button:active {
  border: solid 1px rgb(1, 217, 229);
  border-bottom: solid 3px rgb(0, 242, 255);
  color: rgb(4, 167, 172);
}
button:enabled {
  border: solid 1px rgb(218, 218, 218);
  border-bottom: solid 4px rgb(218, 218, 218);
}
</style>
