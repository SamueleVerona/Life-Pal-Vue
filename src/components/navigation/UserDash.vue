<template>
  <section
    id="dash-element"
    class="has-goals"
    :class="{
      'no-goals': userData.length === 0,
      completed: primaryOptionSelected === 'completed',
      failed: primaryOptionSelected === 'failed',
    }"
  >
    <section id="section-items-display">
      <header id="header-items-display" @mousedown="handleMousedown">
        <div id="container-filters">
          <div id="selector-primary-filter" class="selector">
            <div
              id="selector-primary-list"
              class="selector-list is-hidden"
              @mousedown="selectFilterOption"
            >
              <div
                v-for="option in primaryFilterOptions"
                :key="option"
                class="option selector-option"
              >
                {{ option }}
              </div>
            </div>
            <span class="selector-option selected" inert>{{
              primaryOptionSelected
            }}</span>
          </div>

          <div
            id="selector-secondary-filter"
            class="selector"
            v-if="secondaryFilterOptions.length > 1"
          >
            <div
              id="selector-secondary-list"
              class="selector-list is-hidden"
              @mousedown="selectFilterOption"
            >
              <div class="selector-secondary-option selector-option">all</div>
              <div
                v-for="el in secondaryFilterOptions"
                :value="el"
                :key="el"
                class="selector-secondary-option selector-option"
              >
                {{ el }}
              </div>
            </div>
            <span class="selector-option selected" inert>{{
              secondaryOptionSelected
            }}</span>
          </div>
        </div>
        <button
          id="button-new"
          class="button-dash-secondary"
          @mousedown="() => emits('startAdding')"
        >
          add
        </button>
        <button
          id="button-dash-stats"
          class="button-dash-secondary"
          @mousedown="toggleStats"
        >
          stats
        </button>
      </header>
      <section id="goals-container">
        <div v-if="!itemsArray.length" class="empty-list">
          <h2 v-if="!isAdding">No goals yet!</h2>
          <button
            type="button"
            @click="showNewGoal"
            class="button-start"
            v-if="!isAdding"
          >
            Start planning
          </button>
        </div>
        <ul v-else-if="itemsArray.length > 0">
          <li v-for="item in itemsArray" :key="item.id">
            <goal-item
              :item="item"
              :isRequest="props.toggleProfile || props.isAdmin"
              @sendMarkedGoal="handleMarkedItems"
            >
              <template #selector>
                <input
                  class="remove-checkbox"
                  type="checkbox"
                  :key="item.id"
                  :name="item.id"
                  :value="item.databaseId"
                  v-model="selectedItems"
                  v-if="userIsEditing"
                />
              </template>
            </goal-item>
          </li>
        </ul>
      </section>
      <div id="dash-footer" @mousedown="handleListEdit">
        <button
          type="button"
          id="button-edit"
          class="button-dash-secondary"
          v-if="!isAdding && itemsArray.length > 0"
        >
          Edit
        </button>
        <button
          type="button"
          id="button-rem"
          class="button-dash-secondary"
          v-if="userIsEditing"
        >
          delete
        </button>
        <button
          type="button"
          id="button-select-all"
          class="button-dash-secondary"
          v-if="userIsEditing"
        >
          select all
        </button>
        <button
          type="button"
          id="button-save-change"
          class="button-dash-secondary"
          v-if="userIsEditing"
        >
          save changes
        </button>
      </div>
    </section>
    <section id="section-stats" v-if="!props.toggleRequests && !isAdmin">
      <section id="section-stats-content" v-if="isStatsVisible">
        <div class="stat">
          <h3 class="progress-bar-text">
            All time goals:
            {{ props.allGoals.length }}
          </h3>
        </div>
        <div class="stat">
          <h3 class="progress-bar-text">
            Ongoing:
            {{ userStats.string }}
          </h3>
          <div class="progress-bar">
            <div
              class="progress-bar-inner"
              :style="{
                width: userStats.ongoingRate,
              }"
            ></div>
          </div>
        </div>
        <div class="stat">
          <h3 class="progress-bar-text">
            Completed:
            {{ userStats.successRate }}
          </h3>
          <div class="progress-bar">
            <div
              class="progress-bar-inner completed"
              :style="{
                width: userStats.successRate,
              }"
            ></div>
          </div>
        </div>
        <div class="stat">
          <h3 class="progress-bar-text">
            Failed:
            {{ userStats.failRate }}
          </h3>
          <div class="progress-bar">
            <div
              class="progress-bar-inner failed"
              :style="{
                width: userStats.failRate,
              }"
            ></div>
          </div>
        </div>
      </section>
    </section>

    <base-dialog
      class="dialog-dash"
      :show="userIsDeleting"
      :errorMessage="
        selectedItems.length > 1
          ? `Once they're gone, they're gone`
          : `Once it's gone, it's gone`
      "
      :submitText="`delete`"
      :allConfirmed="selectedItems.length > 0"
      :buttonBackground="`var(--dialog-button-color-delete)`"
      :wrapperBackground="`var(--dialog-wrapper-color-delete)`"
      @confirm-action="deleteGoals"
      @close="
        () => {
          userIsDeleting = false;
        }
      "
    >
    </base-dialog>
  </section>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, defineProps, defineEmits, computed, onMounted, watch } from "vue";

const store = useStore();
const props = defineProps([
  "goalType",
  "allGoals",
  "finished",
  "unfinished",
  "insertNewGoal",
  "newDate",
  "toggleProfile",
  "userRequests",
  "isAdmin",
]);
const emits = defineEmits(["startAdding"]);

const userData = computed(() => {
  let filtered;
  switch (primaryOptionSelected.value) {
    case "completed":
      filtered = props.finished.filter((goal) => goal.isCompleted);
      break;
    case "failed":
      filtered = props.finished.filter((goal) => goal.isFailed);
      break;
    case "all goals":
      {
        filtered = props.unfinished;
      }
      break;
    default:
      filtered = props.unfinished.filter(
        (goal) => goal.type === primaryOptionSelected.value
      );
      break;
  }

  return filtered;
});

function setOptions(itemsArr) {
  return itemsArr
    .map((item) => item.itemLabel)
    .reduce((accum, curr) => {
      if (!accum.includes(curr)) accum.push(curr);
      return accum;
    }, []);
}

const goalsFilterOptions = [
  "all goals",
  "month",
  "week",
  "day",
  "completed",
  "failed",
];

const requestsFilterOptions = ["pending", "accepted", "rejected"];

const primaryFilterOptions = computed(() =>
  props.toggleProfile || props.isAdmin
    ? requestsFilterOptions
    : goalsFilterOptions
);
const secondaryFilterOptions = computed(() => setOptions(userData.value));
const secondaryOptionSelected = ref("all");

const filteredGoals = computed(() => {
  if (secondaryOptionSelected.value === "all") {
    return userData.value;
  } else {
    return userData.value.filter(
      (goal) => goal.itemLabel === secondaryOptionSelected.value
    );
  }
});

const itemsArray = computed(() =>
  props.toggleProfile || props.isAdmin
    ? filteredRequests.value
    : filteredGoals.value
);

const isAdding = ref(false);
const userIsEditing = ref(false);
const selectedItems = ref([]);
const primaryOptionSelected = ref();

watch(selectedItems, () => {
  const currGoalsTotal = filteredGoals.value.length;
  const currSelectedGoals = selectedItems.value.length;

  currSelectedGoals < currGoalsTotal
    ? (allSelectedFlag.value = false)
    : (allSelectedFlag.value = true);
});

watch(props, () => {
  props.toggleProfile || props.isAdmin
    ? (primaryOptionSelected.value = "pending")
    : (primaryOptionSelected.value = props.goalType);
});

async function deleteGoals() {
  try {
    await store.dispatch("deleteData", selectedItems.value);
    userIsEditing.value = false;
    userIsDeleting.value = false;

    selectedItems.value = [];
  } catch (err) {
    console.log(err);
  }
}

function toggleDeleteBtn() {
  userIsEditing.value = !userIsEditing.value;
}

function showNewGoal() {
  emits("startAdding");
}

function handleMousedown(e) {
  const target = e.target;
  const isSelector = target.classList.contains("selector");
  const isFilteroption = target.classList.contains("selector-option");
  const isRequestBtn = target.id.includes("request");

  if (isSelector) {
    target.classList.toggle("open");
    target.firstElementChild.classList.toggle("is-hidden");
  } else if (isFilteroption) {
    target.parentElement.classList.add("is-hidden");

    document
      .querySelectorAll(".selector")
      .forEach((el) => el.classList.remove("open"));
  } else if (isRequestBtn) {
    showNewGoal();
  } else {
    document
      .querySelectorAll(".selector")
      .forEach((el) => el.classList.remove("open"));

    document.querySelectorAll(".selector-list").forEach((el) => {
      el.classList.add("is-hidden");
    });
  }
}
function selectFilterOption(e) {
  userIsEditing.value = false;
  selectedItems.value = [];
  const target = e.target;
  const isFilterOption = e.target.classList.contains("option");
  const optionText = target.textContent.trim();

  if (props.toggleProfile || props.isAdmin) {
    primaryOptionSelected.value = optionText;
  } else if (isFilterOption) {
    primaryOptionSelected.value = optionText;
    secondaryOptionSelected.value = "all";
  } else {
    secondaryOptionSelected.value = optionText;
  }
}

const isStatsVisible = ref(false);
function toggleStats() {
  isStatsVisible.value = !isStatsVisible.value;
  const section = document.querySelector("#section-stats");
  section.classList.toggle("maximized");
}

const userStats = computed(() => {
  const totalGoals = props.allGoals.length;
  const totalOngoing = props.allGoals.filter(
    (goal) => goal.isCompleted === false && goal.isFailed === false
  ).length;

  const totalCompleted = props.allGoals.filter(
    (goal) => goal.isCompleted === true
  ).length;

  const totalFailed = props.allGoals.filter(
    (goal) => goal.isFailed === true
  ).length;

  const totalExpired = totalCompleted + totalFailed;

  const successRate =
    ((totalCompleted * 100) / (totalExpired ? totalExpired : 1)).toFixed(1) +
    "%";
  const failRate =
    ((totalFailed * 100) / (totalExpired ? totalExpired : 1)).toFixed(1) + "%";

  const ongoingRate =
    (totalOngoing * 100) / (totalGoals ? totalGoals : 1) + "%";

  return {
    string: `${totalOngoing}/${totalGoals}`,
    ongoingRate,
    successRate,
    failRate,
  };
});

const allSelectedFlag = ref(false);
function selectAll() {
  const allSelected = filteredGoals.value.map((goal) => goal.databaseId);

  if (!allSelectedFlag.value && selectedItems.value.length === 0) {
    selectedItems.value = allSelected;
    allSelectedFlag.value = true;
  } else {
    selectedItems.value = [];
    allSelectedFlag.value = false;
  }
}

const userIsDeleting = ref(false);
function handleListEdit(e) {
  const targetButton = e.target.id.slice(7);

  switch (targetButton) {
    case "edit":
      toggleDeleteBtn();
      break;
    case "rem":
      userIsDeleting.value = true;
      break;
    case "select-all":
      selectAll();
      break;
    default:
      return;
  }
}

const filteredRequests = computed(() =>
  props.userRequests.filter(
    (req) => req.itemLabel === primaryOptionSelected.value
  )
);

function handleMarkedItems(item) {
  const id = item.itemId;
  const itemIndex = selectedItems.value.findIndex((itm) => itm.itemId === id);

  itemIndex >= 0
    ? (selectedItems.value[itemIndex] = item)
    : selectedItems.value.push(item);
}

onMounted(() => {
  props.toggleProfile || props.isAdmin
    ? (primaryOptionSelected.value = "pending")
    : (primaryOptionSelected.value = props.goalType);
});
</script>

<style scoped>
* {
  font-family: "Afacad Flux", Sans-serif;
}

#dash-element {
  position: relative;
  display: flex;
  flex-direction: row;
  border-radius: 35px;

  border: solid 2px rgb(218, 218, 218);
  border-bottom: solid 3px rgb(218, 218, 218);
  /* border: solid 2px rgba(35, 212, 243, 0.704);
  border-bottom: solid 10px rgba(23, 177, 204, 0.704); */
}
.has-goals {
  background: linear-gradient(70deg, #d9eef81b 40%, #e7dfffdb 100%);
}
.no-goals {
  background: transparent;
}

#dash-element.completed {
  border: solid 2px rgba(31, 252, 116, 0.781);
  border-bottom: solid 3px rgba(31, 252, 116, 0.781);
}

#dash-element.failed {
  border: solid 2px rgb(156, 81, 255);
  border-bottom: solid 3px rgb(152, 41, 255);
}

#section-items-display {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 1rem;
  overflow: visible;
  text-align: center;
  align-items: center;
  justify-content: start;
  z-index: 1;
  /* border: solid; */
}

#container-filters {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  overflow: visible;
}

.selector,
.button-dash-secondary {
  min-width: 10rem;
  max-width: max-content;
  padding: 0rem 1.2rem;
  height: 5rem;
  position: relative;
  overflow: visible;

  background: transparent;
  border: solid 2px;
  border-bottom: solid 4px;
  border-radius: 30px;

  align-content: center;
  font-size: 2rem;
  text-align: center;
  cursor: pointer;
}

.selector {
  box-shadow: 0rem 0.3rem 0rem 0rem rgb(120, 120, 131),
    0rem 0.6rem 0rem 0rem rgb(173, 173, 190);
}

.open {
  box-shadow: none;
}

#selector-primary-filter {
  border-color: rgb(0, 213, 206);
  border-bottom-color: rgb(0, 172, 178);
}
#selector-secondary-filter {
  border-color: rgb(236, 162, 34);
  border-bottom-color: rgb(183, 125, 26);
  height: 4rem;
}
.selector-list {
  position: absolute;
  top: 5rem;
  left: 0;
  border: solid 2px;
  background: transparent;
  backdrop-filter: blur(5px);
  text-align: center;
  border-radius: 20px;
}

#selector-primary-list {
  border-color: rgb(0, 213, 206);
}
#selector-secondary-list {
  border-color: rgb(236, 162, 34);
  top: 4rem;
}

.selector-option {
  font-size: 2rem;
  padding: 0.5rem;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
}

.selected {
  font-size: 2.5rem;
  color: #000000;
  font-weight: 600;
}

.selector-option:hover {
  color: #13acd7;
}

.is-hidden {
  display: none;
}

.button-dash-secondary {
  height: 4rem;
  margin: 0rem 0.3rem;
  min-width: 6rem;
  font-weight: bold;
}

#button-comp {
  border-color: rgb(67, 210, 129);
  border-bottom-color: rgb(48, 209, 129);
  color: rgb(48, 209, 129);
}

#button-fail {
  border-color: rgb(156, 81, 255);
  border-bottom-color: rgb(152, 41, 255);
  color: rgb(152, 41, 255);
}

#button-comp:hover,
#button-fail:hover {
  color: #13acd7;
}

#goals-container {
  padding: 0rem 1rem;
  max-height: 80%;
  scrollbar-width: thin;
  scrollbar-color: rgb(98, 37, 253) rgba(3, 3, 255, 0);
  overflow-y: auto;
  z-index: 0;
}

#dash-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  min-height: max-content;
  width: 100%;
  padding: 1rem 1rem;
  justify-self: bottom;
  overflow: visible;
}

.button-dash-secondary:hover {
  color: rgb(10, 214, 221);
}

#button-edit {
  background: rgb(255, 229, 203);
  border: none;
  border-bottom: solid 4px #d2a977;
}

#button-rem {
  background: rgba(255, 125, 125, 0.995);
  border: none;
  border-bottom: solid 4px #a34343;
  color: white;
}
#button-rem:hover {
  color: rgb(117, 250, 255);
  background: rgba(255, 77, 77, 0.995);
}

#button-select-all {
  border: solid 1px rgba(35, 212, 243, 0.704);
  border-bottom: solid 4px rgba(35, 212, 243, 0.704);
}

li {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  border-radius: 10px;
}

.empty-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h2,
.button-start {
  font-size: 3rem;
  padding: 0.5rem 1.5rem;
}

.button-start {
  background: none;
  border: none;
  font-weight: bold;
  color: rgb(255, 0, 85);
}
.button-start:hover {
  color: rgb(21, 203, 167);
  cursor: pointer;
}

.remove-checkbox {
  appearance: none;
  cursor: pointer;
  width: 2.3rem;
  height: 2.3rem;
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

#section-stats {
  display: flex;
  flex-direction: column;
  padding: 1rem 0rem;
  min-height: 3rem;
}

#section-stats-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: none;
  border-left: solid 1px #1dffa8e3;
  padding: 0rem 0.5rem;
  margin: 0rem 1rem;

  justify-content: center;
  align-items: center;
}

.maximized {
  flex: 0.6;
}

#dash-header-stats {
  padding: 1rem 0.5rem 1rem 0.2rem;
}

#button-dash-stats {
  border-color: #00e4b6;
  position: absolute;
  right: 0.5rem;
}

.stat {
  border: solid 2px rgb(9, 249, 205);
  border-radius: 18px;
  width: 80%;
  padding: 1rem;
  margin: 1rem 0rem;
}

.progress-bar {
  border: solid 1px;
  border-radius: 30px;
  height: 1rem;
  width: 60%;
  justify-self: center;
}
.progress-bar-inner {
  height: 100%;
  background: rgb(158, 233, 252);
}

.progress-bar-text {
  /* border: solid; */
  text-align: center;
  font-size: 2rem;
  padding: 0.5rem 0rem;
}

.progress-bar-inner.completed {
  background: rgb(47, 255, 147);
}
.progress-bar-inner.failed {
  background: rgb(154, 47, 255);
}

.dialog-dash {
  z-index: 200;
}

.dialog-button {
  color: white;
}
</style>
