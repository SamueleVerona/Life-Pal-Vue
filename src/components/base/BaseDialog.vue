<template>
  <div>
    <teleport to="body">
      <dialog open v-if="show">
        <slot name="title">
          <h2>{{ props.message }}</h2>
        </slot>
        <slot name="description"> </slot>
        <button @click="closeDialog">Close</button>
      </dialog>
      <div class="underlay" @click="closeDialog" v-if="show"></div>
    </teleport>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps(["message", "show"]);
const emits = defineEmits(["close"]);

const closeDialog = () => {
  emits("close");
};
</script>

<style scoped>
* {
  font-family: "Poppins", sans-serif;
}
.underlay {
  position: fixed;
  top: 10vh;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(169, 181, 202, 0.171);
  backdrop-filter: blur(3px);
  height: 100vh;
  width: 100%;
}

dialog {
  display: flex;
  flex-direction: column;
  background-color: rgb(140, 81, 249);
  border-radius: 20px;
  border: none;
  z-index: 1;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 20vh;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}

h2,
p {
  font-size: 3rem;
  padding: 4rem 3rem;
  width: max-content;
  color: white;
}

button {
  font-size: 3rem;
  width: 100%;
  height: 100%;
  background: white;
  border: none;
}
</style>
