<template>
  <div>
    <dialog open v-if="isVisible">
      <slot name="title"> </slot>
      <slot name="description"> </slot>
      <button @click="closeDialog">Close</button>
    </dialog>
    <div class="underlay" v-if="isVisible" @click="closeDialog"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isVisible = ref(true);

const closeDialog = () => {
  isVisible.value = false;
};
</script>

<style scoped>
.underlay {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.359);
  width: 100vw;
  height: 90vh;
  z-index: -1;
}

dialog {
  display: flex;
  flex-direction: column;

  background-color: rgb(81, 249, 249);
  border-radius: 20px;
  border: solid rgba(0, 0, 0, 0.188) 2px;
  box-shadow: 1rem 1rem 3rem rgba(128, 128, 128, 0.333);
  z-index: 1;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* width: 25rem;
  height: 30rem; */
}

h2,
p,
button {
  font-size: 3rem;
  padding: 1rem;
}

button {
  justify-self: end;
}
</style>
