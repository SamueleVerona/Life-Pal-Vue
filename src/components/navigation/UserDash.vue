<template>
  <section
    id="dash-card"
    class="has-content"
    :class="{ 'no-content': filteredData.length === 0 }"
  >
    <h2 id="time-selection">
      {{ props.goalType !== "type" ? props.goalType : "All Goals" }}
    </h2>

    <section id="goals-container">
      <div v-if="!filteredData.length" id="no-goals">
        <h2 v-if="!isAdding">No goals yet!</h2>
        <button
          type="button"
          @click="toggleAdd"
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
              v-if="userIsEditing"
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
    <div id="list-controls">
      <button
        type="button"
        id="button-edit"
        @click="showRem"
        v-if="!isAdding && filteredData.length > 0"
      >
        Edit
      </button>
      <button id="button-rem" @click="remGoal" v-if="userIsEditing">
        delete
      </button>
    </div>
  </section>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, defineProps, defineEmits, computed } from "vue";

const store = useStore();
const props = defineProps(["goalType", "userData", "insertNewGoal", "newDate"]);
const emits = defineEmits(["startAdding"]);

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

const isAdding = ref(false);
const userIsEditing = ref(false);
const selectedGoals = ref([]);

async function remGoal() {
  try {
    await store.dispatch("deleteData", selectedGoals.value);
    userIsEditing.value = false;
    selectedGoals.value = [];
  } catch (err) {
    console.log(err);
  }
}

function showRem() {
  userIsEditing.value = !userIsEditing.value;
}

function toggleAdd() {
  emits("startAdding", true);
}

// function weekCheck(dateInput) {
//   console.log(dateInput);
//   if (selType.value === "week" || props.goalType === "week") {
//     const selectedWeek = +dateInput.slice(-2);
//     const curYear = new Date().getFullYear();
//     const startOfYear = new Date(`${curYear}-01-01`);
//     const firstDayOfWeek = new Date(
//       startOfYear.getTime() + (selectedWeek - 1) * 7 * 24 * 60 * 60 * 1000
//     );

//     const dayOfWeek = firstDayOfWeek.getDay();
//     const mondayOfWeek = new Date(firstDayOfWeek);
//     if (dayOfWeek !== 1) {
//       mondayOfWeek.setDate(
//         mondayOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
//       );
//     }
//     return new Date(mondayOfWeek).getTime();
//   } else {
//     return dateInput;
//   }
// }
</script>

<style scoped>
* {
  font-family: "Poppins", sans-serif;
}

#dash-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  box-shadow: 0rem 0.5rem 0rem #62a3ff;
}

#time-selection {
  background: rgb(255, 251, 220);
  border: solid 1px #ffc362;
  box-shadow: 0rem 0.3rem 0rem #ffc362;
  text-align: center;
  width: 50%;
  align-self: center;
  border-radius: 25px;
}
#goals-container {
  padding: 0rem 1rem;
  max-height: 80%;
  scrollbar-width: thin;
  scrollbar-color: rgb(120, 37, 253) rgba(3, 3, 255, 0);
  overflow-y: auto;
}

#list-controls {
  position: absolute;
  bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 1rem;
}

#button-rem:hover,
#button-edit:hover {
  background: rgba(255, 255, 255, 0.819);
  color: #2c3e50;
}

#button-edit,
#button-rem {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2c3e50;
  width: max-content;
  height: 5rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  padding: 0rem 1.5rem;
}
#button-edit {
  background: rgb(255, 241, 151);
  box-shadow: 0rem 0.3rem 0rem #d2d177;
}

#button-rem {
  background: rgba(255, 69, 69, 0.995);
  box-shadow: 0rem 0.3rem 0rem #a34343;

  border-radius: 25px;
  color: white;
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

#no-goals {
  padding-top: 15rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  color: rgb(157, 0, 255);
}
#button-start:hover {
  color: rgb(255, 98, 0);
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
</style>
