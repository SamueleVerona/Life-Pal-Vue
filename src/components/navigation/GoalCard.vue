<template>
  <section id="new-goal-card">
    <base-card class="card">
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
      <template #content>
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
        <label for="time-selection">
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
            type="date"
            name="completion"
            id="completion"
            v-model="compDate"
          />
        </label>
      </template>
      <template #button>
        <div id="list-controls">
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
const props = defineProps(["dateInfo", "goalType"]);
const emits = defineEmits(["goalSaved"]);

const selType = ref("day");
const inputTitle = ref("");
const inputDesc = ref("");
const compDate = ref();
onBeforeMount(() => (compDate.value = props.dateInfo));

async function addGoal() {
  try {
    await store.dispatch("sendData", {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      title: inputTitle.value,
      desc: inputDesc.value,
      type: selType.value,
      isCompleted: true,
      started: Date.now(),
      compDate: compDate.value,
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
}
#goalLabel {
  font-size: 2.5rem;
  background: rgb(121, 81, 255);
  text-align: center;
  border-radius: 30px;
  color: rgb(251, 251, 251);
}

#list-controls {
  padding: 1rem 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}

button {
  font-size: 1.8rem;
  font-weight: 800;
  color: #2c3e50;
  width: max-content;
  height: 5rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  padding: 0 2rem;
}

#button-save {
  border: solid 2px rgb(255, 60, 60);
  border-bottom: solid 3px rgb(255, 58, 36);
  background: rgb(255, 190, 190);
  color: #2c3e50;
}
#button-save:hover {
  color: #7f24ff;
  background: rgb(237, 236, 255);
  border: solid 2px rgb(59, 255, 79);
  border-bottom: solid 3px rgb(36, 255, 102);
}

.title,
.desc {
  text-overflow: clip;
  font-size: 2rem;
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
</style>
