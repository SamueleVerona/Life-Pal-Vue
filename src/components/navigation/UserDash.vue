<template>
  <section
    id="dash-element"
    class="has-goals"
    :class="{
      'no-goals': !itemsArray.length,
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
              class="selector-list"
              v-if="primaryFilterToggle"
            >
              <div
                v-for="option in primaryFilterOptions"
                :key="option"
                class="option selector-option option-primary"
              >
                {{ option }}
              </div>
            </div>
            <span class="selector-option selected" inert
              >{{ primaryOptionSelected }}
            </span>
          </div>

          <div
            id="selector-secondary-filter"
            class="selector"
            v-if="secondaryFilterOptions.length > 1"
          >
            <div
              id="selector-secondary-list"
              class="selector-list"
              v-if="secondaryFilterToggle"
            >
              <div
                class="selector-secondary-option selector-option option-secondary option"
              >
                all
              </div>
              <div
                v-for="el in secondaryFilterOptions"
                :value="el"
                :key="el"
                class="selector-secondary-option selector-option option-secondary option"
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
          v-if="
            props.profileModeActive &&
            !props.userIsAdmin &&
            itemsArray.length > 0
          "
          @mousedown="() => emits('openNewItem')"
        >
          add
        </button>
        <button
          id="button-dash-stats"
          class="button-dash-secondary"
          v-if="!props.userIsAdmin && !props.profileModeActive"
          @mousedown="toggleStats"
        >
          stats
        </button>
      </header>
      <section id="items-container">
        <div v-if="!itemsArray.length" class="empty-list">
          <h2 v-if="!userIsAdding">
            {{
              props.profileModeActive ? "No requests here!" : "No goals yet!"
            }}
          </h2>
          <button
            type="button"
            @mousedown="handleStart"
            class="button-start"
            v-if="!userIsAdding"
          >
            {{ props.profileModeActive ? "Send one" : "Start planning" }}
          </button>
        </div>
        <ul v-else-if="itemsArray.length">
          <li v-for="item in itemsArray" :key="item.id">
            <list-item
              :item="item"
              :isRequest="props.profileModeActive || props.userIsAdmin"
              :userIsEditing="userIsEditing"
              @sendMarkedItem="handleMarkedItems"
              @sendReply="
                (item) => {
                  userIsEditing = item.isReply;
                  handleMarkedItems(item.request);
                }
              "
            >
              <template #selector>
                <input
                  class="remove-checkbox"
                  type="checkbox"
                  :key="item.id"
                  :name="item.id"
                  :value="{
                    userId: item.userId,
                    id: item.databaseId,
                  }"
                  v-model="selectedItems"
                  v-if="userIsEditing && userIsDeleting"
                />
              </template>
            </list-item>
          </li>
        </ul>
      </section>
      <div id="dash-footer" @mousedown="handleListEdit">
        <button
          type="button"
          id="button-save-change"
          class="button-dash-secondary"
          v-if="userIsEditing && props.userIsAdmin"
        >
          save
        </button>
        <button
          type="button"
          id="button-rem"
          class="button-dash-secondary"
          v-if="userIsEditing && props.userIsAdmin"
        >
          delete
        </button>
        <button
          type="button"
          id="button-confirm"
          class="button-dash-secondary"
          v-if="userIsEditing && userIsDeleting"
        >
          confirm
        </button>
        <button
          type="button"
          id="button-select-all"
          class="button-dash-secondary"
          v-if="userIsEditing && userIsDeleting"
        >
          select all
        </button>

        <button
          type="button"
          id="button-edit"
          class="button-dash-secondary"
          v-if="!userIsAdding && itemsArray.length"
        >
          {{ props.userIsAdmin ? "edit" : "delete" }}
        </button>
      </div>
    </section>
    <section
      id="section-stats"
      class="maximized"
      v-if="!props.profileModeActive && !userIsAdmin"
    >
      <section id="section-stats-content" v-if="statsSectionVisible">
        <div class="stat">
          <h3 class="progress-bar-text">
            All time goals:
            {{ props.allGoals.length }}
          </h3>
        </div>
        <div class="stat">
          <h3 class="progress-bar-text">
            Ongoing:
            {{ userStats.stringRate }}
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
      :show="userIsConfirming"
      :errorMessage="
        selectedItems.length > 1
          ? `Once they're gone, they're gone`
          : `Once it's gone, it's gone`
      "
      :submitText="`delete`"
      :allConfirmed="selectedItems.length > 0"
      :buttonBackground="`var(--dialog-button-color-delete)`"
      :wrapperBackground="`var(--dialog-wrapper-color-delete)`"
      @confirm-action="deleteItems"
      @close="
        () => {
          userIsConfirming = false;
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
  "calendarTimeOpt",
  "allGoals",
  "finished",
  "unfinished",
  "insertNewGoal",
  "profileModeActive",
  "userRequests",
  "userIsAdmin",
]);
const emits = defineEmits(["openCalendar", "openNewItem", "maxItemsReached"]);

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
  props.profileModeActive || props.userIsAdmin
    ? requestsFilterOptions
    : goalsFilterOptions
);

const secondaryFilterOptions = computed(() => setOptions(userGoals.value));
const secondaryOptionSelected = ref("all");

const userGoals = computed(() => {
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

const filteredGoals = computed(() => {
  if (secondaryOptionSelected.value === "all") {
    return userGoals.value;
  } else {
    return userGoals.value.filter(
      (goal) => goal.itemLabel === secondaryOptionSelected.value
    );
  }
});

const filteredRequests = computed(() =>
  props.userRequests.filter(
    (req) => req.itemLabel === primaryOptionSelected.value
  )
);

const itemsArray = computed(() =>
  props.profileModeActive || props.userIsAdmin
    ? filteredRequests.value
    : filteredGoals.value
);

const userIsAdding = ref(false);
const userIsEditing = ref(false);
const selectedItems = ref([]);
const primaryOptionSelected = ref();

watch(selectedItems, () => {
  const currTotalItms = itemsArray.value.length;
  const currSelectedItms = selectedItems.value.length;

  currSelectedItms < currTotalItms
    ? (allSelectedFlag.value = false)
    : (allSelectedFlag.value = true);
});

watch(props, () => {
  if (props.profileModeActive || props.userIsAdmin) {
    primaryOptionSelected.value = "pending";
  } else {
    primaryOptionSelected.value = props.calendarTimeOpt;
  }
});

async function deleteItems() {
  try {
    await store.dispatch("deleteData", {
      type: props.profileModeActive || props.userIsAdmin ? "request" : "goal",
      items: selectedItems.value,
    });
    userIsEditing.value = false;
    userIsDeleting.value = false;
  } catch (err) {
    console.log(err);
  }
  selectedItems.value = [];
  userIsConfirming.value = false;
}

function toggleListEdit() {
  userIsEditing.value = !userIsEditing.value;
  if (!props.userIsAdmin) userIsDeleting.value = true;
}

function addNewItem() {
  emits("openNewItem");
}
function handleStart() {
  props.profileModeActive ? addNewItem() : emits("openCalendar");
}

const primaryFilterToggle = ref(false);
const secondaryFilterToggle = ref(false);

function handleMousedown(e) {
  const target = e.target;
  const validTarget = target.classList.contains("selector");

  const isPrimFilter = target.id.includes("primary-filter");
  const isSecFilter = target.id.includes("secondary-filter");
  const isFilteroption = target.classList.contains("option");
  const isRequestBtn = target.id.includes("request");

  if (!validTarget) {
    primaryFilterToggle.value = false;
    secondaryFilterToggle.value = false;
    userIsEditing.value = false;
  }
  if (isPrimFilter) {
    primaryFilterToggle.value = !primaryFilterToggle.value;
  }
  if (isSecFilter) {
    secondaryFilterToggle.value = !secondaryFilterToggle.value;
  }
  if (isFilteroption) {
    selectFilterOption(target);
  }
  if (isRequestBtn) {
    addNewItem();
  }
}

function selectFilterOption(target) {
  userIsEditing.value = false;
  selectedItems.value = [];
  const isPrimary = target.classList.contains("option-primary");
  const isSecondary = target.classList.contains("option-secondary");
  const optionText = target.textContent.trim();
  if (isPrimary) {
    primaryOptionSelected.value = optionText;
    secondaryOptionSelected.value = "all";
  }
  if (isSecondary) secondaryOptionSelected.value = optionText;
}

const statsSectionVisible = ref(false);

function toggleStats() {
  statsSectionVisible.value = !statsSectionVisible.value;
  const section = document.querySelector("#section-stats");
  section.classList.toggle("maximized");
}

const userStats = computed(() => {
  const totalGoals = props.allGoals.length;
  const totalOngoing = props.unfinished.length;

  const totalCompleted = props.finished.filter(
    (goal) => goal.isCompleted === true
  ).length;

  const totalFailed = props.finished.filter(
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
    stringRate: `${totalOngoing}/${totalGoals}`,
    ongoingRate,
    successRate,
    failRate,
  };
});

const allSelectedFlag = ref(false);

function selectAll() {
  const allSelected = itemsArray.value.map((item) => {
    return { userId: item.userId, id: item.databaseId };
  });

  if (!allSelectedFlag.value && selectedItems.value.length === 0) {
    selectedItems.value = allSelected;
    allSelectedFlag.value = true;
  } else {
    selectedItems.value = [];
    allSelectedFlag.value = false;
  }
}

const userIsDeleting = ref(false);
const userIsConfirming = ref(false);

function handleListEdit(e) {
  const targetButton = e.target.id.slice(7);
  switch (targetButton) {
    case "edit":
      toggleListEdit();
      break;
    case "rem":
      userIsDeleting.value = !userIsDeleting.value;
      break;
    case "select-all":
      selectAll();
      break;
    case "confirm":
      userIsConfirming.value = true;
      break;
    case "save-change":
      sendMarkedReqs();
      break;
    default:
      return;
  }
}

function handleMarkedItems(item) {
  const id = item.itemId;
  const itemIndex = selectedItems.value.findIndex((itm) => itm.itemId === id);

  itemIndex >= 0
    ? (selectedItems.value[itemIndex] = item)
    : selectedItems.value.push(item);
}

function sendMarkedReqs() {
  store.dispatch("changeReqState", selectedItems.value);
  userIsEditing.value = false;
}

watch(itemsArray, () => {
  if (props.profileModeActive)
    itemsArray.value.length === 10
      ? emits("maxItemsReached", true)
      : emits("maxItemsReached", false);
});

onMounted(() => {
  props.profileModeActive || props.userIsAdmin
    ? (primaryOptionSelected.value = "pending")
    : (primaryOptionSelected.value = props.calendarTimeOpt);
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
  border-radius: 30px;

  border: solid 2px rgb(218, 218, 218);
  border-bottom: solid 3px rgb(218, 218, 218);
}
.has-goals {
  background: linear-gradient(70deg, #d9eef81b 40%, #e7dfffdb 100%);
}
.no-goals {
  background: transparent;
}

#dash-element.completed {
  border: solid 2px var(--glow-dash-comp-dark);
  border-bottom: solid 3px var(--glow-dash-comp-dark);
  animation: shadow-glow-comp 3s infinite;
}

#dash-element.failed {
  border: solid 2px var(--glow-dash-fail-dark);
  border-bottom: solid 3px var(--glow-dash-fail-dark);
  animation: shadow-glow-fail 3s infinite ease-out;
}

@keyframes shadow-glow-comp {
  0% {
    box-shadow: 0rem 1rem 3rem var(--glow-dash-comp-dark),
      0rem 5rem 10rem 3rem var(--glow-dash-comp-dark);
  }

  50% {
    box-shadow: 0rem 1rem 3rem var(--glow-dash-comp-dark),
      0rem 5rem 10rem 8rem var(--glow-dash-comp-light);
  }

  100% {
    box-shadow: 0rem 1rem 3rem var(--glow-dash-comp-dark),
      0rem 5rem 10rem 3rem var(--glow-dash-comp-dark);
  }
}
@keyframes shadow-glow-fail {
  0% {
    box-shadow: 0rem 1rem 3rem var(--glow-dash-fail-dark),
      0rem 5rem 10rem 3rem var(--glow-dash-fail-dark);
  }

  50% {
    box-shadow: 0rem 1rem 3rem var(--glow-dash-fail-dark),
      0rem 5rem 10rem 8rem var(--glow-dash-fail-light);
  }

  100% {
    box-shadow: 0rem 1rem 3rem var(--glow-dash-fail-dark),
      0rem 5rem 10rem 3rem var(--glow-dash-fail-dark);
  }
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
  height: max-content;
}

#container-filters {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  overflow: visible;
}

.selector {
  min-width: 10rem;
  max-width: max-content;
  padding: 0rem 1.2rem;
  height: 5rem;
  position: relative;
  overflow: visible;

  background: transparent;
  border: none;
  border-right: solid 1px rgba(128, 128, 128, 0.363);
  align-content: center;
  font-size: 3rem;
  text-align: center;
  cursor: pointer;
}

.button-dash-secondary {
  position: relative;
  height: 5rem;
  margin: 0rem 0.3rem;
  padding: 0rem 1.5rem;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 400;
  background: white;
  border: solid 2px rgba(128, 128, 128, 0.363);
  border-radius: 30px;
  box-shadow: 0rem 0.3rem 0.8rem rgba(128, 128, 128, 0.434);
  cursor: pointer;
}
.selector:last-child {
  border: none;
}

.selector:has(.selected):hover .selected {
  color: #13c7d7;
}

.open {
  box-shadow: none;
}

#selector-secondary-filter {
  margin-left: 0.5rem;
}
.selector-list {
  position: absolute;
  padding-top: 0.25rem;
  top: 5.5rem;
  left: 0;
  background: transparent;
  backdrop-filter: blur(4px);
  border-right: solid 1px;
  border-bottom: solid 1px;
  border-bottom-right-radius: 30px;
  /* border: none; */
  width: 100%;
}

#selector-primary-list {
  border-color: rgb(0, 213, 206);
}
#selector-secondary-list {
  border-color: rgb(158, 3, 255);
  width: max-content;
}

.selector-option {
  font-size: 2.2rem;
  padding: 0rem 1rem 0.5rem 1.5rem;
  text-align: left;
  cursor: pointer;
  border-bottom: solid 2px rgb(0, 213, 206);
  border: none;
}
.selector-option.selected {
  font-size: 3rem;
}

.selector-option:last-child {
  border: none;
}

#selector-secondary-list .selector-option {
  border-color: rgb(158, 3, 255);
}

.selected {
  color: #000000;
  font-weight: 600;
}
.selector-option.selected::after {
  content: "";
  background-image: url("/src/assets/down-arrow.png");
  background-size: cover; /* Oppure "contain" o altre opzioni */
  background-position: center;
  display: inline-block;
  margin-left: 1rem;
  width: 2rem;
  height: 2rem;
  transform: translateY(10%);
  justify-items: center;
  transition: transform 0.2s ease;
}
.selector:has(.selector-list) .selector-option.selected::after {
  transform: rotate(180deg);
}

.selector-option:hover {
  color: #13acd7;
}

.is-hidden {
  display: none;
}

#items-container {
  padding: 1rem 1rem;
  height: 100%;
  scrollbar-gutter: stable both-edges;
  scrollbar-width: thin;
  scrollbar-color: rgba(98, 37, 253, 0) rgba(3, 3, 255, 0);
  overflow-y: auto;
  overflow-x: visible;
  z-index: 0;
}

#items-container ul {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: auto;

  grid-template-areas: "li li";
  gap: 0;
}
#items-container ul li {
  margin: 0rem 0.5rem;
  overflow: visible;
  z-index: 1;

  /* border: solid; */
}

#dash-footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  min-height: max-content;
  width: 100%;
  padding: 1rem 1rem;
  justify-self: bottom;
  overflow: visible;
  position: absolute;
  bottom: 0;
  z-index: 1;
}

#button-edit {
  background: rgb(255, 76, 66);
  border-color: rgb(249, 83, 83);
  color: white;
}
#button-edit:hover {
  /* color: white; */
}
.button-dash-secondary:hover {
  color: rgb(9, 247, 255);
  box-shadow: 0rem 0.2rem 0.5rem rgba(128, 128, 128, 0.434);
}

#button-rem {
  background: rgba(255, 125, 125, 0.995);
  border: none;
  color: white;
}
#button-rem:hover {
  color: rgb(117, 250, 255);
  background: rgba(255, 77, 77, 0.995);
}

#button-select-all {
  border: solid 1px rgba(35, 212, 243, 0.704);
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
  width: 100%;
  height: 100%;
  border: 2px solid rgb(0, 0, 0);
  border-bottom: 3px solid rgba(0, 0, 0, 0.986);

  position: absolute;
  bottom: 0rem;
  right: 0;
  border: solid 3px rgb(255, 0, 128);

  border-radius: 40px;
  backdrop-filter: blur(2px);
}
.remove-checkbox::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 4rem;
  aspect-ratio: 1;

  border-bottom-left-radius: 20px;

  border-left: solid 3px;
  border-bottom: solid 3px;
  border-color: rgb(255, 0, 128);
  background: transparent;
}
.remove-checkbox:checked {
  background: linear-gradient(
    to bottom right,
    rgba(255, 46, 46, 0.393),
    transparent 60%
  );
}
.remove-checkbox:checked::after {
  background: rgb(255, 0, 128);
}

#section-stats {
  display: flex;
  flex-direction: column;
  padding: 1rem 0rem;
  height: 100%;
  background: transparent;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 1;
  backdrop-filter: blur(15px);
  transform: translateX(0px);
  transition: all 0.3s ease;
}

#section-stats-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: none;
  border-left: solid 1px #1dffa8e3;

  background: transparent;
  padding: 0rem;
  width: 100%;

  justify-content: center;
  align-items: center;
}

#section-stats.maximized {
  /* width: 30%; */

  right: -2rem;
  opacity: 0;
}

#dash-header-stats {
  padding: 1rem 0.5rem 1rem 0.2rem;
}

#button-dash-stats {
  border-color: #00e4b6;
  border: none;
  position: absolute;
  right: 1rem;
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
