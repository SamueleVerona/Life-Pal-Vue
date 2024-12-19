<template>
  <section
    id="dash-element"
    class="has-goals"
    :class="{
      'no-goals': filteredData.length === 0,
      completed: props.goalType === 'completed',
      failed: props.goalType === 'failed',
    }"
  >
    <label for="goal-filter" id="goal-filter-label">
      <select id="goal-filter" v-model="option" required>
        <option value="all" selected>All</option>
        <option v-for="el in filterOptions" :value="el" :key="el">
          {{ el }}
        </option>
      </select>
    </label>
    <h2 id="time-selection">
      {{
        props.goalType !== "type" ? props.goalType.toUpperCase() : "All Goals"
      }}
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
        <li v-for="el in dataPostFilter" :key="el.id">
          <goal-item :goal="el">
            <template #selector>
              <input
                class="remove-checkbox"
                type="checkbox"
                :key="el.id"
                :name="el.id"
                :value="el.databaseId"
                v-model="selectedGoals"
                v-if="userIsEditing"
              />
            </template>
          </goal-item>
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

// const filter = ref();

const filteredData = computed(() => {
  let filtered;
  switch (props.goalType) {
    case "completed":
      filtered = props.userData.filter((goal) => goal.isCompleted === true);
      break;
    case "failed":
      filtered = props.userData.filter((goal) => goal.isFailed === true);
      break;
    default:
      filtered = props.userData.filter(
        (goal) =>
          goal.type === props.goalType &&
          goal.isCompleted === false &&
          goal.isFailed === false
      );
      break;
  }

  return filtered;
});

function setOptions(goalsArray) {
  return goalsArray
    .map((goal) => goal.dateLabel)
    .reduce((accum, curr) => {
      if (!accum.includes(curr)) accum.push(curr);
      return accum;
    }, []);
}

const filterOptions = computed(() => setOptions(filteredData.value));

const option = ref("all");

const dataPostFilter = computed(() =>
  filteredData.value.filter((goal) => {
    if (option.value === "all") {
      return goal;
    } else {
      return goal.dateLabel === option.value;
    }
  })
);

const isAdding = ref(false);
const userIsEditing = ref(false);
const selectedGoals = ref([]);

// watch(props, () => console.log(props.goalType, filterOptions.value));

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
  emits("startAdding");
}

// function filterSelection(){

// }

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
  font-family: "Afacad Flux", Sans-serif;
}

#dash-element {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 35px;
  border: solid 2px rgba(35, 212, 243, 0.704);
  border-bottom: solid 10px rgba(23, 177, 204, 0.704);

  /* box-shadow: 0rem 0.5rem 0rem #6299ff; */
}
.has-goals {
  background: linear-gradient(70deg, #d9eef81b 40%, #e7dfffdb 100%);
}
.no-goals {
  background: linear-gradient(180deg, #faffe3 20%, #ffdfbc 100%);
  /* box-shadow: 0rem 0.5rem 0rem #7bffe5; */
}

#dash-element.completed {
  border: solid 2px rgba(31, 252, 116, 0.781);
  border-bottom: solid 10px rgba(31, 252, 116, 0.781);
}

#dash-element.failed {
  border: solid 2px rgba(252, 31, 64, 0.704);
  border-bottom: solid 10px rgb(215, 44, 90);
}

/* #goal-filter-label, */
#goal-filter {
  position: absolute;
  font-size: 2rem;
  right: 1rem;
  top: 1rem;
}

#time-selection {
  position: relative;
  background: rgba(174, 255, 227, 0);
  border: none;
  /* border: solid 1px #6f6f6f;
  border-bottom: solid 4px #8d8d8d; */
  text-align: center;
  width: max-content;
  align-self: center;
  border-radius: 25px;
  font-weight: bolder;
}

#goals-container {
  padding: 0rem 1rem;
  max-height: 80%;
  scrollbar-width: thin;
  scrollbar-color: rgb(98, 37, 253) rgba(3, 3, 255, 0);

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
  /* background: rgba(255, 253, 250, 0.819); */
  color: #2c3e50;
  /* border: solid 1px rgb(1, 217, 229); */
  box-shadow: 0rem 0.3rem 0rem rgb(0, 242, 255);
  color: rgb(10, 214, 221);
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
  background: rgb(255, 229, 203);
  box-shadow: 0rem 0.3rem 0rem #d2a977;
}

#button-rem {
  background: rgba(255, 69, 69, 0.995);
  box-shadow: 0rem 0.3rem 0rem #a34343;

  border-radius: 25px;
  color: white;
}

li {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  border-radius: 10px;
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
  color: rgb(255, 0, 85);
}
#button-start:hover {
  color: rgb(21, 203, 167);
}

.remove-checkbox {
  appearance: none;
  cursor: pointer;
  width: 2.3rem;
  height: 2.3rem;
  /* min-height: 3rem; */
  border: 2px solid rgb(0, 0, 0);
  border-bottom: 3px solid rgba(0, 0, 0, 0.986);

  border-radius: 12px;
  position: absolute;
  bottom: 0.5rem;
  right: 1.5rem;
}
.remove-checkbox:checked {
  border: 2px solid rgb(255, 55, 119);
  border-bottom: 3px solid rgba(255, 1, 1, 0.986);
  background: rgb(239, 40, 103);
}
</style>
