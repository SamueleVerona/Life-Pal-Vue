<template>
  <div>
    <teleport to="body">
      <dialog
        open
        v-if="show"
        class="dialog-wrapper"
        :class="{ 'user-active': props.userActive }"
      >
        <div
          class="dialog-content-container"
          :class="{ 'user-active': props.userActive }"
        >
          <slot name="title">
            <h2 class="dialog-message">{{ props.message }}</h2>
          </slot>
        </div>
        <slot name="description"> </slot>
        <button @click="closeDialog" class="dialog-button">
          {{ props.message }}
        </button>
      </dialog>
      <div class="dialog-underlay" @click="closeDialog" v-if="show"></div>
    </teleport>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps(["message", "show", "userActive"]);
const emits = defineEmits(["close"]);

const closeDialog = () => {
  emits("close");
};
</script>

<style>
* {
  font-family: "Poppins", sans-serif;
}
.dialog-underlay {
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

.dialog-wrapper {
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}

.dialog-message {
  font-size: 3rem;
  padding: 4rem 3rem;
  width: max-content;
  color: white;
}

.dialog-button {
  font-size: 3rem;
  padding: 1rem 0rem;
  width: 100%;
  min-height: max-content;
  background: white;
  border: none;
}

.dialog-content-container.user-active {
  scrollbar-width: thin;
  scrollbar-color: rgb(120, 37, 253) rgba(3, 3, 255, 0);
  overflow-y: auto;
}

.dialog-wrapper.user-active {
  height: 500px;
  width: 50%;

  background: transparent;

  scrollbar-width: thin;
  scrollbar-color: rgb(120, 37, 253) rgba(3, 3, 255, 0);
  overflow-y: auto;
}
</style>
