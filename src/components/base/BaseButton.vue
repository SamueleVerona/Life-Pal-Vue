<template>
  <button @click="sendText">
    {{ props.textContent }}
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps(["textContent"]);
const emit = defineEmits(["get-text"]);

const sendText = function () {
  emit("get-text", props.textContent);
};
</script>

<style scoped>
button {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  line-height: 2rem;
}

button:active {
  background: linear-gradient(to top right, rgb(141, 255, 181), transparent),
    linear-gradient(to top left, rgb(63, 187, 92), transparent),
    linear-gradient(to top, rgb(189, 141, 255), transparent);
  border: none;
  box-shadow: 0.5rem 0.5rem 0.5rem rgba(91, 47, 157, 0.089);
}
</style>
