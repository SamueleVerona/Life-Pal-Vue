<template>
  <nav>
    <ul>
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
  emit("gotten-text", (time.value = gottenText.slice(0, -1).toLowerCase()));
};
</script>

<style scoped>
nav {
  display: flex;
  margin: auto 0;
  margin-left: 2rem;
  padding: 1rem;
  height: 80vh;
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
  width: 18rem;
  height: 8rem;
  border-radius: 10px;
  border: none;
  margin: 0.6rem 0;

  font-size: 3rem;
  background: linear-gradient(90deg, #ffeb3b 0%, #f0f3bd 100%);
}
</style>
