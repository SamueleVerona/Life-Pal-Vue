<template>
  <div>
    <teleport to="body">
      <transition name="dialog-tran">
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
      </transition>
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
  background: var(--dialog-wrapper-color-default);
  border-radius: 20px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  z-index: 200;

  /* min-width: calc(80vw -100px); */

  max-width: calc(70vw -100px);
  /* padding: 1rem 0rem; */
}

.dialog-wrapper.user-active {
  height: max-content;
  width: 60%;
  background: transparent;
  scrollbar-width: thin;
  scrollbar-color: rgb(120, 37, 253) rgba(3, 3, 255, 0);
  overflow-y: auto;
  border-radius: 45px;
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
  transition: all 0.2s ease;
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
  line-height: 3.5rem;
  padding: 4rem 3rem;
  width: 100%;
  color: white;
  text-align: center;
  white-space-collapse: preserve-breaks;
  font-weight: 500;
}

.dialog-button {
  font-size: 2.5rem;
  padding: 1rem 0rem;
  width: 100%;
  min-height: max-content;
  background: var(--dialog-button-color-default);
  border: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.dialog-button:enabled:hover {
  font-weight: 500;
  cursor: pointer;
}

.dialog-button:not(.user-active):enabled:hover {
  color: rgb(167, 0, 67);
  background: var(--dialog-button-color-delete-darker);
}

.dialog-content-container.user-active {
  max-height: 80vh;
  padding: 1rem 0rem;
  background: rgb(244, 241, 255);
  scrollbar-width: thin;
  scrollbar-color: rgb(120, 37, 253) rgba(3, 3, 255, 0);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0rem 1rem;
  border: none;
}

.dialog-tran-enter-from,
.dialog-tran-leave-to {
  opacity: 0;
  transform-origin: left;
}

.dialog-tran-enter-active,
.dialog-tran-leave-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.dialog-tran-enter-to,
.dialog-tran-leave-from {
  transform-origin: center;
  opacity: 1;
}
</style>
