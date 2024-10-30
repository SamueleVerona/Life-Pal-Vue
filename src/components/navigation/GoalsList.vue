<template>
  <section
    id="goals"
    class="hasContent"
    :class="{ setting: filteredData.length === 0 }"
  >
    <h2 id="timeDiv">
      {{ goalsTimeDiv }}
    </h2>
    <section id="content">
      <h2 v-if="filteredData.length === 0">
        <a @click="showNew" v-if="!isVisible"> No goals yet ! Start planning</a>
        <a v-else-if="isVisible" @click="showNew">Close</a>
      </h2>
      <ul v-else-if="filteredData.length > 0">
        <li v-for="el in filteredData" :key="el.id">
          <h2>{{ el.title }}</h2>
          <hr />
          <h2>{{ el.desc }}</h2>
          <div :class="classType(el.type)"></div>
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
      <template #button>
        <button id="button-save" @click="addGoal">Save</button>
      </template>
    </base-card>

    <button
      id="button-add"
      v-if="filteredData.length > 0 && isShowing"
      @click="showAdd"
    >
      Add Goal
    </button>
  </section>
</template>

<script setup>
import { useStore } from "vuex";
import { watch, ref, computed, inject } from "vue";

const timeDivId = inject("time-div-id");
const store = useStore();

const data = store.getters.goals;
const filteredData = ref([]);

watch(timeDivId, () => {
  filteredData.value = data.filter((goal) => goal.type === timeDivId.value);
  isVisible.value = false;
  isShowing.value = true;
});

watch(data, (newData) => console.log(newData));

const goalsTimeDiv = computed(() =>
  timeDivId.value ? "This " + timeDivId.value : "Goals"
);

const classType = function (type) {
  if (type === timeDivId.value) return type;
};

const inputTitle = ref("");
const inputDesc = ref("");

let counter = 0;
const isVisible = ref(false);
const isShowing = ref(true);

function addGoal() {
  store.dispatch("setGoal", {
    id: "g" + new Date().getTime() + counter,
    title: inputTitle.value,
    desc: inputDesc.value,
    date: "",
    type: timeDivId.value,
  });
  filteredData.value = data.filter((goal) => goal.type === timeDivId.value);
  inputTitle.value = "";
  inputDesc.value = "";
  counter++;
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

li {
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  background: white;
  margin: 1rem 0;
}

h2,
a {
  font-size: 2.5rem;
  padding: 0.5rem 0.5rem;
}

.day {
  width: 3rem;
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

#button-save {
  height: 100%;
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
#button-add:active {
  background: rgb(219, 255, 214);
}

#button-add {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  /* align-self: center; */

  width: 20rem;
  height: 10%;
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
  background: rgb(248, 151, 255);
  border-radius: 30px;
  border: none;
  cursor: pointer;
}
</style>
