<template>
  <section class="section">
    <section class="section__card">
      <h2 class="card__label">
        {{ props.isRequest ? "New Request" : "New Goal" }}
      </h2>
      <form class="card__form" @submit.prevent>
        <input
          class="item__title"
          type="text"
          placeholder="Choose a title"
          v-model="inputTitle"
          maxlength="25"
          required
        />
        <textarea
          class="item__description"
          :placeholder="
            props.isRequest ? 'Describe your request' : 'Describe your goal'
          "
          rows="5"
          cols="1"
          v-model="inputDesc"
          required
        ></textarea>
      </form>
      <section class="card__item-data" v-if="!props.isRequest">
        <span class="item-data item-data--label"
          >Goal for a {{ props.goalType }}</span
        >
        <span class="item-data">Set a completion for :</span>
        <span class="item-data item-data--time-slot">{{
          props.itemLabel
        }}</span>
      </section>
      <section class="card__controls" @mousedown="handleSubmit">
        <button
          type="button"
          class="btn btn--item-submit"
          data-button-id="submit"
        >
          {{ props.isRequest ? "send" : "save" }}
        </button>
        <button
          type="button"
          class="btn btn--back-action"
          data-button-id="back"
        >
          back
        </button>
      </section>
    </section>
    <base-dialog
      :show="errorMessage"
      :errorMessage="errorMessage"
      @close="closeDialog"
      :wrapperBackground="'var(--warning)'"
      :buttonBackground="'var(--confirm-default)'"
    ></base-dialog>
  </section>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, defineProps, defineEmits, onBeforeMount } from "vue";

const store = useStore();
const props = defineProps(["dateInfo", "itemLabel", "goalType", "isRequest"]);
const emits = defineEmits(["goalSaved", "backAction"]);

const inputTitle = ref("");
const inputDesc = ref("");
const compDate = ref();
onBeforeMount(() => (compDate.value = props.dateInfo));

const errorMessage = ref();

function handleSubmit(e) {
  const target = e.target;
  const validTarget = target.classList.contains("btn");
  if (!validTarget) return;

  const isSubmitBtn = target.dataset.buttonId.includes("submit");
  const isBtnBack = target.dataset.buttonId.includes("back");
  if (isBtnBack) {
    emits("backAction");
  }

  if (isSubmitBtn) {
    if (!inputTitle.value) {
      errorMessage.value = "You need a title first";
      return;
    }

    if (props.isRequest) addRequest();
    else {
      compDate.value
        ? addGoal()
        : (errorMessage.value = "You also need a time slot");
    }
  }
}

function closeDialog() {
  errorMessage.value = "";
}

const id = ref(
  Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
);

async function addRequest() {
  try {
    store.dispatch("sendData", {
      type: "request",
      data: {
        id: id.value,
        title: inputTitle.value.toUpperCase(),
        desc: inputDesc.value ? inputDesc.value : "",
        itemLabel: "pending",
      },
    });
    emits("goalSaved", true);
  } catch (err) {
    console.log(err);
  }
}

async function addGoal() {
  try {
    await store.dispatch("sendData", {
      type: "goal",
      data: {
        id: id.value,
        title: inputTitle.value.toUpperCase(),
        desc: inputDesc.value ? inputDesc.value : "",
        type: props.goalType,
        isCompleted: false,
        isFailed: false,
        started: Date.now(),
        compDate: compDate.value,
        itemLabel: props.itemLabel,
      },
    });
    emits("goalSaved", true);
  } catch (err) {
    console.log(err);
  }
}
</script>

<style lang="scss" scoped>
* {
  font-family: var(--font-stack);
}

@mixin vertical-flex {
  display: flex;
  flex-direction: column;
}

@mixin center-flex {
  justify-content: center;
  align-items: center;
}

.section {
  position: relative;
  border-radius: 30px;
  border: solid 2px var(--glow-default-dark);
  box-shadow: 0rem 3rem 4rem var(--glow-default-dark),
    0rem 6rem 5rem 5rem var(--glow-default-dark);
  animation: glow-default 2s infinite ease-in-out;

  @keyframes glow-default {
    0% {
      box-shadow: 0rem 3rem 6rem var(--glow-default-dark),
        0rem 5rem 10rem 5rem var(--glow-default-dark);
    }

    50% {
      box-shadow: 0rem 3rem 6rem var(--glow-default-dark),
        0rem 5rem 10rem 8rem var(--glow-default-light);
    }

    100% {
      box-shadow: 0rem 3rem 6rem var(--glow-default-dark),
        0rem 5rem 10rem 5rem var(--glow-default-dark);
    }
  }
}

.section__card {
  @include vertical-flex;
  justify-content: space-between;
  position: relative;
  height: 100%;
  background: var(--theme-bkg);

  .card__label {
    padding: 3rem 0rem;
    font-style: normal;
    font-size: 4rem;
    text-align: center;
    color: rgb(190, 100, 36);
  }

  .card__form {
    @include vertical-flex;
    @include center-flex;

    padding: 1rem 0rem;
    .item__title {
      font-size: 3rem;
      font-weight: 600;
      line-height: 4rem;
      text-align: center;
      color: #401700;
      border: none;
      background: transparent;
      border-bottom: solid 1px rgba(50, 40, 63, 0.162);
      box-shadow: 0rem 0.1rem 0rem 0rem rgba(200, 198, 203, 0.563);

      &:focus,
      &:active {
        outline: none;
        background-color: transparent !important;
      }

      &::placeholder {
        font-size: 3rem;
        font-style: italic;
        text-align: center;
        color: rgba(50, 40, 63, 0.563);
      }
    }

    .item__description {
      width: 100%;
      padding: 1rem 6rem;
      resize: none;
      font-size: 2.5rem;
      font-weight: 600;

      font-style: italic;
      text-align: left;
      color: #401700;
      border: none;
      background: transparent;

      &:focus {
        outline: none;
        background-color: transparent !important;
      }

      &::placeholder {
        font-size: 3rem;
        text-align: center;
        color: rgba(50, 40, 63, 0.563);
      }
    }
  }

  .card__item-data {
    @include vertical-flex;
    @include center-flex;

    .item-data {
      padding: 0.5rem;
      font-size: 2rem;
      font-weight: 600;
      color: rgba(50, 40, 63, 0.563);

      &.item-data--label {
        margin-top: 1rem;
        color: rgb(77, 146, 146);
        border-bottom: solid 1px rgba(50, 40, 63, 0.162);
      }
      &:nth-child(2) {
        padding: 0.5rem 0rem 0rem 0rem;
        border: none;
      }
      &.item-data--time-slot {
        color: rgb(190, 100, 36);
      }
    }
  }
  .card__controls {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 100%;
    position: relative;
    width: 100%;
    height: max-content;
    padding: 1rem;

    .btn {
      justify-self: right;
      width: max-content;
      height: 5rem;
      padding: 0rem 1.5rem;
      font-size: 1.8rem;
      font-weight: 800;
      text-align: center;
      color: #2c3e50;

      border: none;
      border-radius: 30px;
      box-shadow: 0rem 0.3rem 0.8rem rgba(128, 128, 128, 0.434);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        box-shadow: 0rem 0.2rem 0.6rem rgba(128, 128, 128, 0.434);
      }

      &.btn--item-submit {
        border: solid 2px rgb(7, 216, 175);
        border-bottom: solid 3px rgb(16, 201, 177);
        background: rgb(190, 255, 241);
        transform: translateX(50%);

        &:hover {
          color: rgb(255, 36, 94);
          background: transparent;
          border: solid 2px rgb(255, 59, 69);
          border-bottom: solid 3px rgb(255, 36, 94);
        }
      }

      &.btn--back-action {
        background: transparent;
        border: none;
        background: var(--confirm-default);

        &:hover {
          color: var(--hover-default);
        }
      }
    }
  }
}
</style>
