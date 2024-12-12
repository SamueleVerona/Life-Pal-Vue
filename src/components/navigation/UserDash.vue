<template>
  <section
    id="dash-card"
    class="has-goals"
    :class="{ 'no-goals': filteredData.length === 0 }"
  >
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
        <li v-for="el in filteredData" :key="el.id">
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
import { ref, defineProps, defineEmits, computed, watch } from "vue";

const store = useStore();
const props = defineProps(["goalType", "userData", "insertNewGoal", "newDate"]);
const emits = defineEmits(["startAdding"]);

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

const isAdding = ref(false);
const userIsEditing = ref(false);
const selectedGoals = ref([]);

watch(props, () => console.log(props.goalType));

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
  font-family: "Concert-one", sans-serif;
}

#dash-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 35px;
  border: solid 2px rgba(63, 19, 182, 0.704);
  border-bottom: solid 10px rgba(63, 19, 182, 0.704);

  /* box-shadow: 0rem 0.5rem 0rem #6299ff; */
}
.has-goals {
  background: linear-gradient(70deg, #d9eef81b 40%, #e7dfffdb 100%);
}
.no-goals {
  background: linear-gradient(180deg, #beffe7 20%, #c0bcff 100%);
  box-shadow: 0rem 0.5rem 0rem #7bffe5;
}

#time-selection {
  position: relative;
  background: rgba(174, 255, 227, 0);
  border: solid 1px #6f6f6f;
  border-bottom: solid 4px #8d8d8d;
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
  scrollbar-color: rgb(120, 37, 253) rgba(3, 3, 255, 0);
  overflow-y: auto;
  /* border: solid; */
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
  color: rgb(157, 0, 255);
}
#button-start:hover {
  color: rgb(255, 98, 0);
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
