<template>
  <section
    id="goals"
    class="hasContent"
    :class="{ setting: filteredData.length === 0 }"
  >
    <h2 id="timeDiv">
      {{ timeDivId }}
    </h2>
    <section id="content">
      <div v-if="filteredData.length === 0" id="no-goals">
        <h2 v-if="!isVisible">No goals yet!</h2>
        <button @click="showNew" v-if="!isVisible" id="button-start">
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
            type="checkbox"
            :key="el.id"
            :name="el.id"
            class="selector"
            @input="getId"
          />
        </li>
      </ul>
    </section>
    <base-card v-if="isVisible" id="goalCard">
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
      <template #options v-if="timeDivId.value === 'All Goals'">
        <label for="time-selection">Choose a Time:</label>
        <select id="time-selection">
          <option value="day">day</option>
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

    <slot name="btn-remove"></slot>
    <slot name="btn-add"></slot>

    <button
      id="button-add"
      v-if="filteredData.length > 0 && isShowing"
      @click="showAdd"
    >
      Add Goal
    </button>
    <button
      id="button-rem"
      v-if="filteredData.length > 0 && isShowing"
      @click="remGoal"
    >
      Remove Goal
    </button>
  </section>
</template>

<script setup>
import { useStore } from "vuex";
import { watch, ref, defineProps, toRefs } from "vue";

const store = useStore();
const props = defineProps(["userGoals", "activeUser", "timeDivId"]);
const { userGoals, activeUser, timeDivId } = toRefs(props);
const filteredData = ref([]);
filteredData.value = userGoals.value;

function refetchData() {
  filteredData.value = userGoals.value;

  if (timeDivId.value === "All Goals") filteredData.value = userGoals.value;
  else {
    filteredData.value = userGoals.value.filter(
      (goal) => goal.type === timeDivId.value
    );
  }
}

watch(timeDivId, () => {
  refetchData();
  isVisible.value = false;
  isShowing.value = true;
});

const inputTitle = ref("");
const inputDesc = ref("");

const isVisible = ref(false);
const isShowing = ref(true);

function addGoal() {
  store.dispatch("setGoal", {
    userId: activeUser.value,
    newGoal: {
      id: "g" + new Date().toISOString,
      title: inputTitle.value,
      desc: inputDesc.value,
      date: "",
      type: timeDivId.value,
    },
  });
  refetchData();
  inputTitle.value = "";
  inputDesc.value = "";
  isVisible.value = false;
  isShowing.value = true;
}
const selectedGoals = ref([]);

function getId(event) {
  const goalId = event.target.attributes.name.value;
  if (event.target.checked && !selectedGoals.value[goalId])
    selectedGoals.value.push(goalId);
  if (!event.target.checked && selectedGoals.value[goalId])
    selectedGoals.value = selectedGoals.value.filter((id) => id !== goalId);
}

function remGoal() {
  store.dispatch("remGoal", {
    userId: activeUser.value,
    goalsArr: selectedGoals.value,
  });
  selectedGoals.value = [];
  refetchData();
}

function showNew() {
  isVisible.value = !isVisible.value;
  isShowing.value = !isShowing.value;
}

function showAdd() {
  isVisible.value = true;
  isShowing.value = false;
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
  border-radius: 10px;
  background: white;
  margin: 1rem 0;
}

h2,
#button-start {
  font-size: 2.5rem;
  padding: 0.5rem 1.5rem;
  /* line-height: 3rem; */
}

#button-start {
  background: rgb(169, 247, 207);
  border: none;
  font-weight: bold;
  color: #2c3e50;
  border-radius: 30px;

  /* padding: 1rem; */
}
#button-start:hover {
  color: rgb(255, 255, 255);
  background: #7ea7ff;
}

.title,
.desc {
  font-size: 2rem;
  flex: 3;
}
.selector,
.time-id {
  flex: 1;
}

.selector {
  border: solid;
  border-radius: 10px;
}
.checked {
  background: #827bff;
}
.day {
  width: 1fr;
  background: rgb(47, 255, 137);
}
.week {
  width: 3rem;
  background: rgb(255, 116, 47);
}
.month {
  width: 3rem;
  background: rgb(47, 47, 255);
}
.year {
  width: 3rem;
  background: rgb(255, 203, 47);
}
.decade {
  width: 3rem;
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

input {
  font-size: 2rem;
  height: 3rem;
  width: 30rem;
  border: none;
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

#button-save:active,
#button-add:active,
#button-rem:active {
  background: rgb(219, 255, 214);
}

#button-close {
  width: 100%;
  flex: 1;
  border: none;
  font-size: 2rem;
  font-weight: 600;
  background: rgb(255, 151, 151);
}

#button-add,
#button-rem {
  position: absolute;
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
  height: 5rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  padding: 0 1rem;
}

#button-add {
  bottom: 1rem;
  right: 1rem;
  height: 5rem;
  background: rgb(248, 151, 255);
}

#button-rem {
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 165, 151, 0.995);
}
</style>
