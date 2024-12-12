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
            <h2 class="dialog-message">{{ props.errorMessage }}</h2>
          </slot>
        </div>
        <slot name="description"> </slot>
        <button
          @click="submit"
          class="dialog-button"
          :disabled="!props.allConfirmed"
        >
          {{ props.submitText || "click outside" }}
        </button>
      </dialog>

      <div class="dialog-underlay" v-if="show" @click="closeDialog"></div>
    </teleport>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps([
  "errorMessage",
  "submitText",
  "show",
  "userActive",
  "allConfirmed",
]);
const emits = defineEmits(["confirmAction", "close"]);

// const openFlag = ref(true);

const submit = () => {
  emits("confirmAction");
};
const closeDialog = () => {
  if (props.errorMessage) emits("close");
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
  background: rgba(190, 196, 208, 0.295);
  backdrop-filter: blur(10px);
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
  background: rgb(160, 255, 200);
  border: none;
}

.dialog-content-container.user-active {
  background: white;
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
