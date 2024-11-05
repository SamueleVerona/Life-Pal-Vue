<template>
  <section
    id="goals"
    class="hasContent"
    :class="{ setting: filteredData.length === 0 }"
  >
    <h2 id="timeDiv">
      {{ props.goalType !== "type" ? props.goalType : "All Goals" }}
    </h2>
    <section id="content">
      <div v-if="filteredData.length === 0" id="no-goals">
        <h2 v-if="!isAdding">No goals yet!</h2>
        <button @click="showNew" id="button-start" v-if="!isAdding">
          Start planning
        </button>
      </div>
      <ul v-else-if="filteredData.length > 0">
        <li v-for="el in filteredData" :key="el.id">
          <h2 class="title">{{ el.title }}</h2>
          <hr />
          <h2 class="desc">{{ el.desc }}</h2>
          <div class="time-id" :class="el.type"></div>
          <input
            class="selector"
            type="checkbox"
            :key="el.id"
            :name="el.id"
            :value="el.id"
            v-model="selectedGoals"
            v-if="canRem"
          />
        </li>
      </ul>
    </section>
    <base-card v-if="isAdding" id="goalCard">
      <template #title>
        <h2 id="goalLabel">Insert a new goal</h2>
        <input
          type="text"
          name="goalTitle"
          placeholder="Choose a title"
          v-model="inputTitle"
        />
      </template>
      <template #description>
        <textarea
          name="goalDesc"
          id="goaldesc"
          placeholder="Describe your goal"
          rows="10"
          v-model="inputDesc"
        ></textarea>
      </template>
      <template #options>
        <label for="time-selection">Choose a Time:</label>
        <select id="time-selection" v-model="selType">
          <option value="day" selected>day</option>
          <option value="week">week</option>
          <option value="month">month</option>
          <option value="year">year</option>
          <option value="decade">decade</option>
        </select>
      </template>
      <template #button>
        <button id="button-save" @click="addGoal">Save</button>
        <button id="button-close" @click="showNew">X</button>
      </template>
    </base-card>
    <div id="list-controls">
      <button id="button-edit" @click="showRem">Edit List</button>
      <button id="button-rem" @click="remGoal" v-if="canRem">Remove</button>
      <button id="button-add" @click="showAdd">Add Goal</button>
    </div>
  </section>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, defineProps, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useStore();
const props = defineProps(["goalType"]);

const userData = computed(
  () =>
    store.getters.users.find((user) => user.email === route.params.userId).goals
);
const filteredData = computed(() =>
  userData.value.filter((goal) =>
    props.goalType !== "type" ? goal.type === props.goalType : goal.type
  )
);

const selType = ref("");
const inputTitle = ref("");
const inputDesc = ref("");
const isAdding = ref(false);

function addGoal() {
  store.dispatch("setGoal", {
    userId: route.params.userId,
    newGoal: {
      id: "g" + new Date().toISOString(),
      title: inputTitle.value,
      desc: inputDesc.value,
      date: "",
      type: selType.value,
    },
  });
  inputTitle.value = "";
  inputDesc.value = "";
  isAdding.value = false;
}
const selectedGoals = ref([]);

function remGoal() {
  store.dispatch("remGoal", {
    userId: route.params.userId,
    goalsArr: selectedGoals.value,
  });
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
#content {
  padding-top: 3rem;
}

#goals {
  border: solid;
  position: relative;
  height: 80vh;
  width: 40rem;
  padding: 0 2rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  box-shadow: 1rem 1rem 0.5rem rgba(128, 128, 128, 0.308);
}
.hasContent {
  background: linear-gradient(90deg, #827bff 0%, #ff7eb3 100%);
}
.setting {
  background: linear-gradient(90deg, #fbffbe 0%, #fff67e 100%);
}

button:hover {
  cursor: pointer;
}

li {
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  background: white;
  margin: 1rem 0;
  height: 3rem;
}

h2,
#button-start {
  font-size: 2.5rem;
  padding: 0.5rem 1.5rem;
}

#button-start {
  background: rgb(169, 247, 207);
  border: none;
  font-weight: bold;
  color: #2c3e50;
  border-radius: 30px;
}
#button-start:hover {
  color: rgb(255, 255, 255);
  background: #7ea7ff;
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

#timeDiv {
  background: rgb(249, 255, 220);
  border-radius: 30px;
  text-align: center;
  border-top: solid;
}

#goalCard {
  margin: 2rem auto;
  height: 40%;
  width: 100%;
}

#goalLabel {
  background: rgb(151, 255, 226);
  text-align: center;
}
label {
  padding-left: 1rem;
}

a {
  padding: 0.5rem;
}
a:hover {
  background: rgb(255, 149, 149);
  border-radius: 20px;
  cursor: pointer;
}

input::placeholder {
  color: #9712b991;
}
textarea::placeholder {
  color: #127e6a91;
}
textarea {
  flex: 1;
  font-size: 2rem;
  border: none;
}
#time-selection {
  flex: 1;
}

#button-save {
  flex: 3;
  width: 100%;
  background: rgb(161, 255, 151);
  border: none;
  font-size: 2rem;
  font-weight: 800;
  writing-mode: vertical-lr;
  text-orientation: upright;
  color: #2c3e50;
}
#button-close {
  width: 100%;
  flex: 1;
  border: none;
  font-size: 2rem;
  font-weight: 600;
  background: rgb(255, 151, 151);
}

#list-controls {
  position: absolute;
  bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
}

#button-save:active,
#button-add:active,
#button-rem:active,
#button-edit {
  background: rgb(219, 255, 214);
}

#button-edit,
#button-add,
#button-rem {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2c3e50;
  width: max-content;
  height: 5rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  padding: 0 1rem;
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
