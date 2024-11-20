<template>
  <nav>
    <ul>
      <li>
        <base-button
          text-content="All Goals"
          @get-text="getText('type')"
          id="button-all"
        ></base-button>
      </li>
      <li v-for="division in props.timeDivs" :key="division">
        <base-button :text-content="division" @get-text="getText"></base-button>
      </li>
      <li>
        <base-button
          text-content="Completed"
          @get-text="getText('completed')"
          id="button-comp"
        ></base-button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps(["timeDivs"]);
const emits = defineEmits(["sendText"]);

const getText = function (gottenText) {
  emits("sendText", gottenText);
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
#button-all {
  background: linear-gradient(90deg, #d68a1f 0%, #f3e6bd 100%);
}
#button-comp {
  background: linear-gradient(90deg, #72fa53 0%, #ddf3bd 100%);
}
</style>
