<template>
  <section id="goal-card-element">
    <base-card class="card" id="goal-card">
      <template #title>
        <h2 id="goal-card-label">NEW GOAL</h2>
      </template>

      <template #content>
        <div class="card-section">
          <input
            id="goal-title"
            type="text"
            name="goalTitle"
            placeholder="Choose a title"
            v-model="inputTitle"
            maxlength="16"
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
        <div class="card-section" id="goal-info">
          <span>Goal for a {{ props.goalType }}</span>
          <span>Set a completion for</span>
          <span>{{ props.dateLabel }}</span>
        </div>
      </template>
      <template #button>
        <div id="goal-card-controls" class="card-section">
          <button type="button" id="button-save" @click="addGoal">save</button>
        </div>
      </template>
    </base-card>
  </section>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, defineProps, defineEmits, onBeforeMount } from "vue";

const store = useStore();
const props = defineProps(["dateInfo", "dateLabel", "goalType"]);
const emits = defineEmits(["goalSaved"]);

const inputTitle = ref("");
const inputDesc = ref("");
const compDate = ref();
onBeforeMount(() => (compDate.value = props.dateInfo));

async function addGoal() {
  try {
    await store.dispatch("sendData", {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      title: inputTitle.value.toUpperCase(),
      desc: inputDesc.value[0].toUpperCase() + inputDesc.value.slice(1),
      type: props.goalType,
      isCompleted: false,
      isFailed: false,
      started: Date.now(),
      compDate: compDate.value,
      dateLabel: props.dateLabel,
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
  border: solid 2px rgba(252, 175, 31, 0.781);
  border-bottom: solid 10px rgba(252, 178, 31, 0.781);
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
  font-size: 2.8rem;
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
#goal-title::placeholder {
  color: rgba(50, 40, 63, 0.563);
  font-size: 3rem;
  text-align: center;
  text-justify: center;
}

#goal-description {
  font-size: 2.5rem;
  padding: 0.5rem 0.5rem;
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
}
#button-save:hover {
  color: rgb(255, 36, 94);
  background: transparent;
  border: solid 2px rgb(255, 59, 69);
  border-bottom: solid 3px rgb(255, 36, 94);
}
</style>
