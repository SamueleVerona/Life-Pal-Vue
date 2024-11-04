<template>
  <nav>
    <ul>
      <li>
        <base-button text-content="All Goals" @get-text="getText"
          >All Goals</base-button
        >
      </li>
      <li v-for="division in props.timeDivs" :key="division">
        <base-button :text-content="division" @get-text="getText"></base-button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const time = ref("day");
const props = defineProps(["timeDivs"]);
const emit = defineEmits(["gotten-text"]);

const getText = function (gottenText) {
  emit("gotten-text", (time.value = gottenText));
};
</script>

<style scoped>
nav {
  display: flex;
  margin: auto 0;
  margin-left: 2rem;
  padding: 0.5rem;
  /* height: 80vh; */
  text-align: center;

  background: linear-gradient(90deg, #89f7fe 0%, #66a6ff 100%);
  border-radius: 20px;

  box-shadow: 1rem 1rem 0.5rem rgba(128, 128, 128, 0.308);
}

ul {
  list-style: none;
  background: transparent;
}

button {
  width: 13rem;
  height: 8rem;
  border-radius: 15px;
  border: none;
  margin: 0.2rem 0;
  font-size: 3rem;
  background: linear-gradient(90deg, #ffc26d 0%, #f3e6bd 100%);
}
</style>
