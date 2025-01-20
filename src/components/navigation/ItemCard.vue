<template>
  <section id="goal-card-element">
    <base-card class="card" id="goal-card">
      <template #title>
        <h2 id="goal-card-label">
          {{ props.isRequest ? "New Request" : "New Goal" }}
        </h2>
      </template>

      <template #content>
        <div class="card-section">
          <input
            id="goal-title"
            type="text"
            name="goalTitle"
            placeholder="Choose a title"
            v-model="inputTitle"
            maxlength="25"
            required
          />
          <textarea
            name="goalDesc"
            id="goal-description"
            placeholder="Describe your goal"
            rows="5"
            cols="1"
            v-model="inputDesc"
            required
            minlength="5"
          ></textarea>
        </div>
      </template>
      <template #options>
        <div class="card-section" id="goal-info" v-if="!props.isRequest">
          <span>Goal for a {{ props.goalType }}</span>
          <span>Set a completion for :</span>
          <span>{{ props.itemLabel }}</span>
        </div>
      </template>
      <template #button>
        <div
          id="goal-card-controls"
          class="card-section"
          @mousedown="handleSubmit"
        >
          <button type="button" id="button-save">
            {{ props.isRequest ? "send" : "save" }}
          </button>
          <button type="button" id="button-back">back</button>
        </div>
      </template>
    </base-card>
    <base-dialog
      :show="errorMessage"
      :errorMessage="errorMessage"
      @close="closeDialog"
      :wrapperBackground="'var(--dialog-button-color-default-earth)'"
      :buttonBackground="'white'"
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
  const isSubmitBtn = target.id.includes("save");
  const isBtnBack = target.id.includes("back");
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
        : (errorMessage.value = "You need a time slot also");
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

<style scoped>
* {
  font-family: "Poppins", sans-serif;
  font-style: oblique;
}

#goal-card-element {
  border-radius: 30px;
  border: solid 2px var(--glow-item-card-dark);
  /* border-bottom: solid 10px rgba(252, 178, 31, 0.781); */
  box-shadow: 0rem 3rem 4rem var(--glow-item-card-dark),
    0rem 6rem 5rem 5rem var(--glow-item-card-dark);

  position: relative;
  animation: shadow-glow 2s infinite ease-in-out;
}

#goal-card-element::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;

  width: 8rem;
  height: 5rem;
  border: none;
  border-left: solid 2px rgba(252, 175, 31, 0.781);
  border-top: solid 2px rgba(252, 175, 31, 0.781);
  border-top-left-radius: 30px;
  z-index: -1;
}
@keyframes shadow-glow {
  0% {
    box-shadow: 0rem 3rem 6rem var(--glow-item-card-dark),
      0rem 5rem 10rem 5rem var(--glow-item-card-dark);
  }

  50% {
    box-shadow: 0rem 3rem 6rem var(--glow-item-card-dark),
      0rem 5rem 10rem 8rem var(--glow-item-card-light);
  }

  100% {
    box-shadow: 0rem 3rem 6rem var(--glow-item-card-dark),
      0rem 5rem 10rem 5rem var(--glow-item-card-dark);
  }
}

#goal-card {
  height: 100%;
  position: relative;
  padding: 1rem 1rem;
  background: linear-gradient(10deg, #d9eef81b 40%, #e7dfffdb 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#goal-card-label {
  font-size: 4rem;
  margin-bottom: 1rem;
  text-align: center;
  color: rgb(190, 100, 36);
}

#goal-title {
  height: max-content;
  font-size: 3rem;
  border: none;
  background: transparent;
  border-bottom: solid 1px rgba(50, 40, 63, 0.162);
  box-shadow: 0rem 0.1rem 0rem 0rem rgba(200, 198, 203, 0.563);
  text-align: center;
  color: #401700;
}
#goal-title:focus,
#goal-title:active,
#goal-description:focus {
  outline: none;
  background-color: transparent !important;
}

#goal-title::placeholder {
  color: rgba(50, 40, 63, 0.563);
  font-size: 3rem;
  text-align: center;
  text-justify: center;
}

#goal-description {
  font-size: 2.5rem;
  padding: 1rem 2rem;
  width: 100%;
  border: none;
  resize: none;
  caret-color: #000000;
  background: transparent;
  text-align: left;
  color: #401700;
}
#goal-description::placeholder {
  color: rgba(50, 40, 63, 0.563);
  font-size: 3rem;
  text-align: center;
}

span {
  font-size: 2rem;
  padding: 0.5rem;
  font-weight: 600;
  color: rgba(50, 40, 63, 0.563);
  border-bottom: solid 1px rgba(50, 40, 63, 0.162);
}

span:nth-child(1) {
  margin-top: 1rem;
  color: rgb(77, 146, 146);
}

span:nth-child(2) {
  border: none;
  padding: 0.5rem 0rem 0rem 0rem;
}

span:last-of-type {
  color: rgb(190, 100, 36);
}

#goal-card-controls {
  width: 100%;
  padding: 1rem 1rem;
  height: 1fr;
}

button {
  font-size: 1.8rem;
  font-weight: 800;
  color: #2c3e50;
  width: max-content;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  padding: 1rem 2rem;
}

#button-save {
  border: solid 2px rgb(7, 216, 175);
  border-bottom: solid 3px rgb(16, 201, 177);
  background: rgb(190, 255, 241);
  color: #2c3e50;
  transition: all 0.15s ease;
}
#button-save:hover {
  color: rgb(255, 36, 94);
  background: transparent;
  border: solid 2px rgb(255, 59, 69);
  border-bottom: solid 3px rgb(255, 36, 94);
}

#button-back {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
}
#button-back:hover {
  color: rgb(16, 201, 177);
}

/* @media screen and (max-width: 600px) {
  #goal-card-element {
    width: 100%;
  }
} */
/* 
@media screen and (max-width: 425px) {
  #goal-card-element {
    width: 100%;
  }
} */
</style>
