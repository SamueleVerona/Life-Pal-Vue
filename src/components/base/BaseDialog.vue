<template>
  <div>
    <teleport to="body">
      <transition name="dialog">
        <dialog
          open
          v-if="show"
          class="dialog"
          :class="{ 'mode--expired-goals': props.userActive }"
          :style="{ background: props.wrapperBackground }"
        >
          <section
            class="dialog__content"
            :class="{ 'mode--expired-goals': props.userActive }"
          >
            <slot name="content">
              <p class="dialog__message">{{ props.errorMessage }}</p>
            </slot>
          </section>
          <button
            @mousedown="submit"
            class="dialog__btn"
            :class="{ 'mode--expired-goals': props.userActive }"
            :style="{ background: props.buttonBackground }"
            :disabled="!props.allConfirmed"
          >
            {{ props.submitText || "click outside" }}
          </button>
        </dialog>
      </transition>
      <div class="dialog__underlay" v-if="show" @mousedown="closeDialog">
        <span class="underlay__text" v-if="!props.userActive">back</span>
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

<style lang="scss" scoped>
* {
  font-family: "Poppins", sans-serif;
}
.dialog__underlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  font-size: 4rem;
  color: rgb(128, 128, 128);
  background: rgba(190, 196, 208, 0.295);
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;

  .underlay__text {
    position: absolute;
    bottom: 10rem;
    font-size: 3rem;
    cursor: pointer;
    transition: all 0.1s ease;

    &:hover {
      color: rgb(0, 0, 0);
      font-weight: 500;
    }
  }
}

.dialog {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40rem;
  z-index: 200;
  border-radius: 30px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);

  &.mode--expired-goals {
    height: max-content;
    width: 60%;
    overflow-y: auto;
    border-radius: 45px;
    background: transparent;
    scrollbar-width: thin;
    scrollbar-color: rgb(120, 37, 253) rgba(3, 3, 255, 0);
  }

  .dialog__content {
    &.mode--expired-goals {
      max-height: 80vh;
      padding: 0.5rem 0rem;
      box-sizing: border-box;
      overflow-y: auto;

      background: rgb(244, 241, 255);
      scrollbar-width: thin;
      scrollbar-color: rgb(120, 37, 253) rgba(3, 3, 255, 0);
    }
    .dialog__message {
      padding: 4rem 3rem;

      font-family: "Poppins Black", sans-serif;
      font-size: 2.5rem;
      line-height: 3rem;
      text-align: center;
      align-content: center;
      white-space-collapse: preserve-breaks;
      color: white;
    }
  }

  .dialog__btn {
    min-height: max-content;
    padding: 1.5rem 0rem;
    font-size: 2.5rem;
    background: var(--confirm-default);
    border: none;
    transition: all 0.2s ease;

    &:enabled:hover {
      font-weight: 500;
      cursor: pointer;
    }

    &:not(.mode--expired-goals):enabled:hover {
      color: rgb(167, 0, 67);
    }
  }

  .dialog-enter-from,
  .dialog-leave-to {
    opacity: 0;
    transform-origin: left;
  }

  .dialog-enter-active,
  .dialog-leave-active {
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .dialog-enter-to,
  .dialog-leave-from {
    transform-origin: center;
    opacity: 1;
  }

  @media screen and (max-width: 748px) {
    width: 35rem;
  }
}
</style>
