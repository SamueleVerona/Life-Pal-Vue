<template>
  <div>
    <teleport to="body">
      <dialog
        open
        v-if="show"
        class="dialog-wrapper"
        :class="{ 'user-active': props.userActive }"
        :style="{ background: props.wrapperBackground }"
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
          @mousedown="submit"
          class="dialog-button"
          :class="{ 'user-active': props.userActive }"
          :style="{ background: props.buttonBackground }"
          :disabled="!props.allConfirmed"
        >
          {{ props.submitText || "click outside" }}
        </button>
      </dialog>
      <div class="dialog-underlay" v-if="show" @mousedown="closeDialog">
        <span class="dialog-underlay-text" v-if="!props.userActive">back</span>
      </div>
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
  "buttonBackground",
  "wrapperBackground",
]);
const emits = defineEmits(["confirmAction", "close"]);

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

.dialog-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  transform: translate(-50%, -50%);
  background-color: var(--dialog-wrapper-color-default);
  border-radius: 20px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  z-index: 200;
  max-width: calc(70vw -100px);
  /* padding: 1rem 0rem; */
}
.dialog-underlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(190, 196, 208, 0.295);
  backdrop-filter: blur(10px);
  height: 100%;
  width: 100%;
  font-size: 4rem;
  color: rgb(128, 128, 128);
  z-index: 100;
}

.dialog-underlay-text:hover {
  color: rgb(0, 0, 0);
  font-weight: 500;
}
.dialog-underlay-text {
  position: absolute;
  bottom: 10rem;
  font-size: 3.5rem;
  cursor: pointer;
  transition: all 0.1s ease;
}

.dialog-message {
  font-size: 3rem;
  padding: 4rem 3rem;
  width: 100%;
  color: white;
  text-align: center;
  white-space-collapse: preserve-breaks;
}

.dialog-button {
  font-size: 2.5rem;
  padding: 1rem 0rem;
  width: 100%;
  min-height: max-content;
  background: var(--dialog-button-color-default);
  border: none;
  font-weight: 500;
}

.dialog-button.user-active:enabled:hover {
  font-weight: 500;
}

.dialog-button:not(.user-active):enabled:hover {
  color: rgb(167, 0, 67);
  background: var(--dialog-button-color-delete-darker);
  /* font-weight: 600; */
  cursor: pointer;
}

.dialog-content-container.user-active {
  max-height: 80vh;
  padding: 1rem 0rem;
  background: white;
  scrollbar-width: thin;
  scrollbar-color: rgb(120, 37, 253) rgba(3, 3, 255, 0);
  overflow-y: auto;
  box-sizing: border-box;
}

.dialog-wrapper.user-active {
  height: max-content;
  width: 50%;

  background: transparent;

  scrollbar-width: thin;
  scrollbar-color: rgb(120, 37, 253) rgba(3, 3, 255, 0);
  overflow-y: auto;
}
</style>
