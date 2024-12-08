<template>
  <section
    id="dash-card"
    class="card has-content"
    :class="{ 'no-content': filteredData.length === 0 }"
  >
    <h2 id="timeSelection">
      {{ props.goalType !== "type" ? props.goalType : "All Goals" }}
    </h2>
    <section id="dash-content">
      <div v-if="!filteredData.length" id="no-goals">
        <h2 v-if="!isAdding">No goals yet!</h2>
        <button
          type="button"
          @click="showNew"
          id="button-start"
          v-if="!isAdding"
        >
          Start planning
        </button>
      </div>
      <ul v-else-if="filteredData.length > 0">
        <li v-for="el in filteredData" :key="el.id">
          <div class="goal-info">
            <h2 class="title">{{ el.title }}</h2>
            <hr />
            <h2 class="desc">{{ el.desc }}</h2>
            <div class="time-id" :class="el.type"></div>
            <input
              class="selector"
              type="checkbox"
              :key="el.id"
              :name="el.id"
              :value="el.name"
              v-model="selectedGoals"
              v-if="canRem"
            />
          </div>
          <div class="comp-bar">
            <h3 class="comp-rate">
              {{ compRate(el.started, el.compDate) }}
            </h3>
            <div :style="{ width: compRate(el.started, el.compDate) }"></div>
          </div>
        </li>
      </ul>
    </section>
    <base-card v-if="isAdding" id="new-goal-card" class="card">
      <template #title>
        <h2 id="goalLabel">New Goal</h2>
        <input
          type="text"
          name="goalTitle"
          placeholder="Choose a title"
          v-model="inputTitle"
          required
        />
      </template>
      <template #description>
        <textarea
          name="goalDesc"
          id="goaldesc"
          placeholder="Describe your goal"
          rows="10"
          v-model="inputDesc"
          required
          minlength="5"
        ></textarea>
      </template>
      <template #options>
        <label for="time-selection" v-if="props.goalType === 'type'">
          <span>Choose a time option:</span>
          <select id="time-selection" v-model="selType">
            <option value="day" selected>day</option>
            <option value="week">week</option>
            <option value="month">month</option>
            <option value="year">year</option>
            <option value="decade">decade</option>
          </select>
        </label>
        <label for="completion">
          <span>Set a completion for:</span>
          <input
            :type="defType()"
            name="completion"
            id="completion"
            v-model="compDate"
          />
        </label>
      </template>
      <template #button>
        <div class="list-controls" id="new-goal-controls">
          <button type="button" id="button-close" @click="showNew">Back</button>
          <button type="button" id="button-save" @click="addGoal">Save</button>
        </div>
      </template>
    </base-card>
    <div class="list-controls">
      <button
        type="button"
        id="button-edit"
        @click="showRem"
        v-if="!isAdding && filteredData.length > 0"
      >
        Edit List
      </button>
      <button id="button-rem" @click="remGoal" v-if="canRem">Remove</button>
      <button
        type="button"
        id="button-add"
        @click="showAdd"
        v-if="!isAdding && props.goalType !== 'completed'"
      >
        Add Goal
      </button>
    </div>
  </section>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, defineProps, computed, watch } from "vue";

const store = useStore();
const props = defineProps(["goalType", "userData", "insertNewGoal"]);

watch(props, () => {
  compDate.value = props.insertNewGoal;
  // isAdding.value = true;
});

function compRate(start, comp) {
  const totalTime = new Date(comp).getTime() - new Date(start).getTime();
  const elapsedTime = Date.now() - new Date(start).getTime();
  const rate = (elapsedTime / totalTime) * 100;
  if (new Date(comp).getTime() <= Date.now()) return "100%";
  else {
    return Math.min(rate, 100).toFixed(0) + "%";
  }
}

const filteredData = computed(() => {
  if (props.goalType === "completed") {
    return props.userData.filter((goal) => goal.isCompleted === true);
  } else if (props.goalType === "type") {
    return props.userData.filter((goal) => goal.isCompleted === false);
  } else {
    return props.userData.filter(
      (goal) => goal.type === props.goalType && goal.isCompleted === false
    );
  }
});

const selType = ref("day");

function defType() {
  if (props.goalType === "type") {
    if (selType.value === "day") return "date";
    if (selType.value === "week") return "week";
    if (selType.value === "month") return "date";
    if (selType.value === "year") return "date";
  } else {
    if (props.goalType === "day") return "date";
    if (props.goalType === "week") return "week";
    if (props.goalType === "month") return "date";
    if (props.goalType === "year") return "date";
  }
}

watch(selType, () => defType());

function dateCheck(dateInput) {
  console.log(dateInput);
  if (selType.value === "week" || props.goalType === "week") {
    const selectedWeek = +dateInput.slice(-2);
    const curYear = new Date().getFullYear();
    const startOfYear = new Date(`${curYear}-01-01`);
    const firstDayOfWeek = new Date(
      startOfYear.getTime() + (selectedWeek - 1) * 7 * 24 * 60 * 60 * 1000
    );

    const dayOfWeek = firstDayOfWeek.getDay();
    const mondayOfWeek = new Date(firstDayOfWeek);
    if (dayOfWeek !== 1) {
      mondayOfWeek.setDate(
        mondayOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
      );
    }
    return new Date(mondayOfWeek).getTime();
  } else {
    return dateInput;
  }
}

const inputTitle = ref("");
const inputDesc = ref("");
const isAdding = ref(false);
const compDate = ref();

async function addGoal() {
  try {
    await store.dispatch("sendData", {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      title: inputTitle.value,
      desc: inputDesc.value,
      type: props.goalType === "type" ? selType.value : props.goalType,
      isCompleted: true,
      started: Date.now(),
      compDate: dateCheck(compDate.value),
    });
    isAdding.value = false;
  } catch (err) {
    console.log(err);
  }
}

const selectedGoals = ref([]);

async function remGoal() {
  try {
    await store.dispatch("deleteData", selectedGoals.value);
    canRem.value = false;
    selectedGoals.value = [];
  } catch (err) {
    console.log(err);
  }
}

function showNew() {
  isAdding.value = !isAdding.value;
}

function showAdd() {
  isAdding.value = true;
}
const canRem = ref(false);

function showRem() {
  canRem.value = !canRem.value;
}
</script>

<style scoped>
* {
  font-family: "Poppins", sans-serif;
}

.card {
  position: relative;
  margin: auto;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  box-shadow: 0rem 0.5rem 0rem #62a3ff;
}
/*
#dash-card {
  position: relative;
  margin: auto;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  box-shadow: 0rem 0.5rem 0rem #62a3ff;
} */
#dash-content,
.list-controls {
  padding: 0rem 1rem;
}
.has-content {
  background: linear-gradient(70deg, #7bd7ff 20%, #a77eff 100%);
}
.no-content {
  background: linear-gradient(180deg, #beffe7 20%, #c0bcff 100%);
  box-shadow: 0rem 0.5rem 0rem #7bffe5;
}

li {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  border-radius: 10px;
}
.goal-info {
  display: flex;
  justify-content: space-between;
  background: white;
  height: 3rem;
}
.comp-bar {
  position: relative;
  height: 2rem;
  border-top: solid 0.1rem;
  background: rgba(255, 255, 255, 0.382);
}
.comp-bar > div {
  background: rgb(243, 14, 14);
  height: 100%;
  width: 50%;
  z-index: 100;
}
.comp-rate {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: rgb(255, 244, 244);
  font-size: 2rem;
  background: none;
}

button:hover {
  cursor: pointer;
  background: #7ea7ff;
}

h2,
#button-start {
  font-size: 2.5rem;
  padding: 0.5rem 1.5rem;
}

#button-start {
  background: none;
  border: none;
  font-weight: bold;
  color: rgb(0, 149, 255);
  border-radius: 30px;
}
#button-start:hover {
  color: rgb(157, 0, 255);
}

.title,
.desc {
  text-overflow: clip;
  font-size: 2rem;
}
.time-id {
  width: 3rem;
}

.selector {
  appearance: none;
  cursor: pointer;
  width: 3rem;
  height: 100%;
  min-height: 3rem;
  border: 2px solid red;
  border-radius: 15px;
  position: relative;
}
.selector:checked {
  border: 2px solid rgb(0, 0, 0);
  background: rgb(255, 0, 0);
}

.day {
  background: rgb(47, 255, 137);
}
.week {
  background: rgb(255, 116, 47);
}
.month {
  background: rgb(47, 47, 255);
}
.year {
  background: rgb(255, 203, 47);
}
.decade {
  background: rgb(47, 210, 255);
}

#timeSelection {
  background: rgb(249, 255, 220);
  border-radius: 30px;
  text-align: center;
  border-top: solid;
}

#new-goal-card {
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 0rem 1rem;
  box-shadow: 1rem 1rem 0.5rem rgba(128, 128, 128, 0.308);
  background: rgb(249, 182, 255);
}

#goalLabel {
  background: rgb(121, 81, 255);
  text-align: center;
  border-radius: 20px;
  color: rgb(251, 251, 251);
}

label,
select,
#completion {
  padding: 0.5rem;
  margin: auto;
  font-size: 2rem;
  border-radius: 15px;
  text-align: center;
  font-weight: 600;
}
span {
  font-size: 2rem;
  padding: 0.5rem;
  font-weight: 600;
}

a:hover {
  background: rgb(255, 149, 149);
  border-radius: 20px;
  cursor: pointer;
}
input[type="text"],
input[type="date"] {
  height: 3rem;
  font-size: 2.5rem;
  border-radius: 10px;
  caret-color: #ff580b;
  padding-left: 1rem;
}

input::placeholder {
  color: #9712b948;
  font-size: 2.5rem;
  line-height: 2rem;
  text-align: center;
  text-justify: center;
}
textarea::placeholder {
  color: #4f127e4e;
  font-size: 3rem;
  text-align: center;
}
textarea {
  flex: 1fr;
  font-size: 2.5rem;
  border: solid;
  border-radius: 10px;
  padding-left: 1rem;
  caret-color: #000000;
}

.list-controls {
  position: absolute;
  bottom: 1rem;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}
#new-goal-controls {
  width: 100%;
  /* bottom: 2rem; */
  /* padding: 0rem 2rem; */
  margin: auto;
  /* border: solid red; */
}

#button-save:active,
#button-add:active,
#button-rem:active,
#button-edit:active,
#button-close:active {
  border: solid 1px white;
  background: rgba(255, 255, 255, 0.819);
}

#button-edit,
#button-add,
#button-rem,
#button-close,
#button-save {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2c3e50;
  width: max-content;
  height: 5rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  padding: 0 1rem;
}
#button-save {
  background: rgb(151, 250, 255);
}
#button-close {
  color: rgba(255, 255, 255, 0.753);
  background: rgb(255, 98, 98);
  border: solid 2px rgb(248, 98, 98);
}

#button-edit {
  background: rgb(255, 241, 151);
}

#button-add {
  background: rgb(132, 235, 255);
}

#button-rem {
  background: rgba(255, 33, 33, 0.995);
  border-radius: 15px;
  border: solid 3px rgb(80, 29, 29);
  color: white;
}
</style>
