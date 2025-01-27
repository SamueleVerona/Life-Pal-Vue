<template>
  <section
    class="section"
    :class="{
      'section--not-empty': itemsArray.length > 0,
      'section--completed': primaryOptionSelected === 'completed',
      'section--failed': primaryOptionSelected === 'failed',
    }"
  >
    <section class="section__dashboard">
      <section class="section__controls--top" @mousedown="handleTopControls">
        <div class="selectors-container">
          <div class="selector selector--primary">
            <ul
              class="selector__list selector__list--primary"
              v-if="primaryFilterToggle"
            >
              <li
                v-for="option in primaryFilterOptions"
                :key="option"
                class="selector__option selector__option--primary"
              >
                {{ option }}
              </li>
            </ul>
            <span class="selector__option selector__option--selected" inert
              >{{ primaryOptionSelected }}
            </span>
          </div>
          <div
            class="selector selector--secondary"
            v-if="secondaryFilterOptions.length > 1"
          >
            <ul
              class="selector__list selector__list--secondary"
              v-if="secondaryFilterToggle"
            >
              <li class="selector__option selector__option--secondary">all</li>
              <li
                v-for="el in secondaryFilterOptions"
                :value="el"
                :key="el"
                class="selector__option selector__option--secondary"
              >
                {{ el }}
              </li>
            </ul>
            <span class="selector__option selector__option--selected" inert>{{
              secondaryOptionSelected
            }}</span>
          </div>
        </div>
        <button
          type="button"
          class="btn btn--new-item"
          v-if="
            props.profileModeActive &&
            !props.userIsAdmin &&
            itemsArray.length > 0
          "
        >
          add
        </button>
        <button
          type="button"
          class="btn btn--stats"
          v-if="!props.userIsAdmin && !props.profileModeActive"
        >
          stats
        </button>
      </section>
      <section class="list__container">
        <div v-if="!itemsArray.length" class="list__placeholder">
          <h2 v-if="!userIsAdding">
            {{
              props.profileModeActive || props.userIsAdmin
                ? "No requests here!"
                : "No goals here!"
            }}
          </h2>
          <button
            type="button"
            class="btn--fallback"
            @mousedown="handleNewItemAction"
            v-if="!userIsAdding && !props.userIsAdmin"
          >
            {{ props.profileModeActive ? "Send a new one" : "Start planning" }}
          </button>
        </div>
        <transition-group
          tag="ul"
          name="list"
          class="list"
          mode="out-in"
          v-else-if="itemsArray.length"
        >
          <li v-for="item in itemsArray" :key="item.id" class="list__item">
            <list-item
              :item="item"
              :isRequest="props.profileModeActive || props.userIsAdmin"
              :userIsEditing="userIsEditing"
              :timeInc="itemTimeInc"
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
                  class="item__checkbox"
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
        </transition-group>
      </section>
      <section class="section__controls--bottom" @mousedown="handleListEdit">
        <button
          type="button"
          data-button-id="save-change"
          class="btn"
          v-if="userIsEditing && props.userIsAdmin && !userIsDeleting"
        >
          save
        </button>

        <button
          type="button"
          data-button-id="confirm"
          class="btn"
          v-if="userIsEditing && userIsDeleting && selectedItems.length"
        >
          confirm
        </button>
        <button
          type="button"
          data-button-id="select-all"
          class="btn bt--action-select-all"
          v-if="userIsEditing && userIsDeleting && itemsArray.length"
        >
          select all
        </button>
        <button
          type="button"
          data-button-id="remove"
          class="btn btn--action-remove"
          v-if="userIsEditing && props.userIsAdmin"
        >
          delete
        </button>
        <button
          type="button"
          data-button-id="edit"
          class="btn btn--action-edit"
          :class="{ 'btn--action-edit-active': userIsEditing }"
          v-if="!userIsAdding && itemsArray.length"
        >
          {{ props.userIsAdmin ? "edit" : userIsEditing ? "close" : "delete" }}
        </button>
      </section>
    </section>
    <transition name="stats">
      <section class="section__stats" v-if="statsToggled">
        <div class="stat">
          <h3 class="stat__text">
            All time goals:
            {{ props.allGoals.length }}
          </h3>
        </div>
        <div class="stat">
          <h3 class="stat__text">
            Ongoing:
            {{ userStats.stringRate }}
          </h3>
          <div class="stat__bar">
            <div
              class="stat__bar--inner"
              :style="{
                width: userStats.ongoingRate,
              }"
            ></div>
          </div>
        </div>
        <div class="stat">
          <h3 class="stat__text">
            Completed:
            {{ userStats.successRate }}
          </h3>
          <div class="stat__bar">
            <div
              class="stat__bar--inner stat__bar--completed"
              :style="{
                width: userStats.successRate,
              }"
            ></div>
          </div>
        </div>
        <div class="stat">
          <h3 class="stat__text">
            Failed:
            {{ userStats.failRate }}
          </h3>
          <div class="stat__bar">
            <div
              class="stat__bar--inner stat__bar--failed"
              :style="{
                width: userStats.failRate,
              }"
            ></div>
          </div>
        </div>
      </section>
    </transition>
    <base-dialog
      class="dialog"
      :show="userIsConfirming || errorMessage"
      :errorMessage="
        errorMessage ||
        (selectedItems.length > 1
          ? `Once they're gone,\nthey're gone`
          : `Once it's gone,\nit's gone`)
      "
      :submitText="errorMessage ? 'click outside' : `delete`"
      :allConfirmed="selectedItems.length > 0"
      :buttonBackground="`var(--confirm-delete)`"
      :wrapperBackground="`var(--danger-light)`"
      @confirm-action="deleteItems"
      @close="
        () => {
          errorMessage = '';
          userIsConfirming = false;
        }
      "
    >
    </base-dialog>
  </section>
</template>

<script setup>
import { useStore } from "vuex";
import {
  ref,
  defineProps,
  defineEmits,
  computed,
  onMounted,
  watch,
  onUnmounted,
} from "vue";

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

const dashMode = computed(() => props.profileModeActive);
watch(dashMode, () => {
  if (props.profileModeActive || props.userIsAdmin) {
    primaryOptionSelected.value = "pending";
  } else {
    primaryOptionSelected.value = props.calendarTimeOpt;
  }
});

const errorMessage = ref();
async function deleteItems() {
  try {
    await store.dispatch("deleteData", {
      type: props.profileModeActive || props.userIsAdmin ? "request" : "goal",
      items: selectedItems.value,
    });
    userIsEditing.value = false;
    userIsDeleting.value = false;
  } catch (err) {
    errorMessage.value = err;
  }
  selectedItems.value = [];
  userIsConfirming.value = false;
}

function toggleListEdit() {
  userIsEditing.value = !userIsEditing.value;
  selectedItems.value = [];
  if (!props.userIsAdmin) userIsDeleting.value = true;
}

function addNewItem() {
  emits("openNewItem");
}
function handleNewItemAction() {
  props.profileModeActive ? addNewItem() : emits("openCalendar");
}

const primaryFilterToggle = ref(false);
const secondaryFilterToggle = ref(false);

function handleTopControls(e) {
  const target = e.target;
  const validTarget = target.classList.contains("selector");
  const isPrimFilter = target.classList.contains("selector--primary");
  const isSecFilter = target.classList.contains("selector--secondary");
  const isSelectorOption = target.classList.contains("selector__option");
  const isBtnNewItem = target.classList.contains("btn--new-item");
  const isBtnStats = target.classList.contains("btn--stats");

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
  if (isSelectorOption) {
    selectFilterOption(target);
  }
  if (isBtnNewItem) {
    emits("openNewItem");
  }
  if (isBtnStats) {
    statsToggled.value = !statsToggled.value;
  }
  if (isRequestBtn) {
    addNewItem();
  }
}

function selectFilterOption(target) {
  userIsEditing.value = false;
  selectedItems.value = [];
  const isPrimaryOption = target.classList.contains(
    "selector__option--primary"
  );

  const isSecondaryOption = target.classList.contains(
    "selector__option--secondary"
  );
  const optionText = target.textContent.trim();
  if (isPrimaryOption) {
    primaryOptionSelected.value = optionText;
    secondaryOptionSelected.value = "all";
  }
  if (isSecondaryOption) secondaryOptionSelected.value = optionText;
}

const statsToggled = ref(false);

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
  const targetButton = e.target.dataset.buttonId;
  switch (targetButton) {
    case "edit":
      toggleListEdit();
      break;
    case "remove":
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
      userIsEditing.value = false;
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

let timer;

const itemTimeInc = ref(0);

onMounted(() => {
  props.profileModeActive || props.userIsAdmin
    ? (primaryOptionSelected.value = "pending")
    : (primaryOptionSelected.value = props.calendarTimeOpt);

  if (props.allGoals.length)
    timer = setInterval(() => {
      itemTimeInc.value -= 1000;
    }, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>

<style lang="scss" scoped>
* {
  font-family: "Afacad Flux", sans-serif;

  font-optical-sizing: auto;
}

.section {
  display: flex;
  flex-direction: row;
  position: relative;
  border-radius: 30px;

  border: solid 2px rgb(218, 218, 218);
  border-bottom: solid 3px rgb(218, 218, 218);
  background: transparent;
  &.section--not-empty {
    background: var(--theme-bkg);
  }
  &.section--completed {
    border: solid 2px var(--glow-positive-dark);
    border-bottom: solid 3px var(--glow-positive-dark);
    animation: shadow-glow-comp 3s infinite;
  }

  &.section--failed {
    border: solid 2px var(--glow-negative-dark);
    border-bottom: solid 3px var(--glow-negative-dark);
    animation: shadow-glow-fail 3s infinite ease-out;
  }
  @keyframes shadow-glow-comp {
    0% {
      box-shadow: 0rem 1rem 3rem var(--glow-positive-dark),
        0rem 5rem 10rem 3rem var(--glow-positive-dark);
    }

    50% {
      box-shadow: 0rem 1rem 3rem var(--glow-positive-dark),
        0rem 5rem 10rem 8rem var(--glow-positive-light);
    }

    100% {
      box-shadow: 0rem 1rem 3rem var(--glow-positive-dark),
        0rem 5rem 10rem 3rem var(--glow-positive-dark);
    }
  }
  @keyframes shadow-glow-fail {
    0% {
      box-shadow: 0rem 1rem 3rem var(--glow-negative-dark),
        0rem 5rem 10rem 3rem var(--glow-negative-dark);
    }

    50% {
      box-shadow: 0rem 1rem 3rem var(--glow-negative-dark),
        0rem 5rem 10rem 8rem var(--glow-negative-light);
    }

    100% {
      box-shadow: 0rem 1rem 3rem var(--glow-negative-dark),
        0rem 5rem 10rem 3rem var(--glow-negative-dark);
    }
  }
  .section__dashboard {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;

    .section__controls--top {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: start;
      position: relative;
      height: max-content;

      padding: 1rem 1rem;
      z-index: 1;
      overflow: visible;
      text-align: center;

      .btn--stats {
        position: absolute;
        right: 1rem;
        border: none;
      }
      .selectors-container {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        overflow: visible;

        .selector {
          position: relative;
          min-width: 10rem;
          max-width: max-content;
          height: 5rem;
          padding: 0rem 1.2rem;
          overflow: visible;

          align-content: center;
          font-size: 3rem;
          text-align: center;
          background: transparent;
          border: none;
          border-right: solid 1px rgba(128, 128, 128, 0.363);
          cursor: pointer;

          &:not(:has(.selector__list)):hover {
            .selector__option--selected {
              color: var(--hover-default);
            }
          }

          &:last-child {
            border: none;
          }

          &.selector--secondary {
            margin-left: 0.5rem;
          }

          .selector__list {
            position: absolute;
            top: 5.5rem;
            left: 0;
            min-width: 100%;
            width: max-content;

            padding-top: 0.25rem;
            background: transparent;
            backdrop-filter: blur(15px);
            border-right: solid 1px;
            border-bottom: solid 1px;
            border-color: rgb(206, 206, 206);
            border-bottom-right-radius: 30px;
            animation: slide-in-top 0.4s ease forwards;

            @keyframes slide-in-top {
              0% {
                opacity: 0;
                transform: translateY(-50px);
              }
              100% {
                opacity: 1;

                transform: translateY(0px);
              }
            }

            .selector__option {
              padding: 0rem 1rem 1.5rem 1.5rem;
              font-family: "Poppins", sans-serif;
              font-size: 2rem;
              text-align: left;
              border: none;
              cursor: pointer;
              animation: slide-in-top 0.15s ease backwards;

              &:hover,
              &.selector__option--selected:hover {
                color: var(--hover-default);
              }

              &:nth-child(2) {
                animation-delay: 0.1s;
              }
              &:nth-child(3) {
                animation-delay: 0.15s;
              }
              &:nth-child(4) {
                animation-delay: 0.2s;
              }
              &:nth-child(5) {
                animation-delay: 0.25s;
              }
              &:nth-child(6) {
                animation-delay: 0.3s;
              }
            }
          }

          .selector__option--selected {
            font-family: "Poppins", sans-serif;
            font-size: 2.3rem;
            font-weight: 600;

            &::after {
              display: inline-block;
              justify-items: center;
              width: 2rem;
              height: 2rem;
              margin-left: 1rem;
              content: "";
              background-image: url("/src/assets/imgs/down-arrow.png");
              background-size: cover;
              background-position: center;
              transform: translateY(10%);
              transition: transform 0.2s ease;
            }
          }

          &:has(.selector__list) {
            .selector__option--selected {
              &::after {
                transform: rotate(180deg);
              }
            }
          }
        }
      }
    }
    .list__container {
      height: 100%;
      padding: 1rem 1rem;
      overflow-y: auto;
      overflow-x: visible;
      z-index: 0;
      scrollbar-gutter: stable both-edges;
      scrollbar-width: thin;
      scrollbar-color: rgba(98, 37, 253, 0) rgba(3, 3, 255, 0);

      .list__placeholder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding-bottom: 10rem;

        h2,
        .btn--fallback {
          padding: 0.5rem 1.5rem;
          font-size: 3rem;
        }
        .btn--fallback {
          font-weight: bold;
          color: rgb(255, 0, 85);
          background: none;
          border: none;
          &:hover {
            color: var(--hover-default);
            cursor: pointer;
          }
        }
      }

      .list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: auto;
        grid-template-areas: "li li";
        gap: 0;
        overflow: visible;
        list-style: none;

        .list__item {
          margin: 0rem 0.5rem;
          z-index: 1;
          overflow: visible;

          .item__checkbox {
            position: absolute;
            bottom: 0rem;
            right: 0;
            width: 100%;
            height: 100%;

            border-style: none;
            border: solid 1px rgb(0, 255, 157);

            border-radius: 40px;
            backdrop-filter: brightness(90%);
            appearance: none;
            cursor: pointer;
            transition: all 0.2s ease;
            &:checked {
              background: linear-gradient(
                to bottom right,
                rgba(255, 10, 22, 0.711),
                transparent 60%
              );
              border-color: red;
              backdrop-filter: brightness(100%);
            }
          }
        }

        .list-enter-from,
        .list-leave-to {
          opacity: 0;
          transform: scale(0.1);
          transform-origin: center;
        }
        .list-enter-active:nth-child(even) {
          transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .list-enter-active:nth-child(odd) {
          transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1) 0.2s;
        }

        .list-leave-active {
          position: absolute;
          transition: all 0.5s ease-out;
        }
        .list-leave-active:nth-child(odd) {
          position: absolute;
          transition: all 0.5s ease-out 0.05s;
        }
        .list-enter-to,
        .list-leave-from {
          transform: scale(1);
          opacity: 1;
          transform-style: preserve-3d;
        }

        .list-move {
          transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }

        @media screen and (min-width: 1025px) {
          grid-template-columns: 1fr 1fr 1fr;
          grid-auto-rows: auto;
          grid-template-areas: "li li li";
        }

        @media screen and (max-width: 1024px) {
          grid-template-columns: 50% 1fr;
          grid-auto-rows: auto;
          grid-template-areas: "li li";
        }

        @media screen and (max-width: 600px) {
          display: flex;
          flex-direction: column;
          align-items: center;

          .list__item {
            width: 90%;
          }
        }
      }
    }
    .section__controls--bottom {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      position: absolute;
      bottom: 0;
      width: 100%;
      min-height: max-content;
      padding: 1rem;

      z-index: 1;
      overflow: visible;

      .btn--action-edit {
        font-weight: 500;
        color: white;
        background: var(--warning-dark);
        border-color: var(--warning-dark);
        transition: all 0.3s ease;

        &.btn--action-edit-active {
          background: var(--danger-dark);
          border-color: var(--danger-light);
        }
      }
      .btn--action-remove {
        color: white;
        background: rgba(173, 66, 66, 0.995);
        border: none;

        &:hover {
          color: var(--hover-default);
          background: rgba(255, 77, 77, 0.995);
        }
      }
      .bt--action-select-all {
        border: solid 1px rgba(35, 212, 243, 0.704);
      }
    }
  }
  .section__stats {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    top: 5%;
    width: 40%;
    height: 90%;
    backdrop-filter: blur(15px);
    border-left: solid 1px #1dffa8e3;

    &.stats-enter-from,
    &.stats-leave-to {
      opacity: 0;
      transform: translateX(200px);
    }

    &.stats-enter-active,
    &.stats-leave-active {
      transition: all 0.4s ease;
    }

    &.stats-leave-from,
    &.stats-enter-to {
      opacity: 1;
      transform: translateX(0px);
    }

    .stat {
      width: 80%;
      padding: 1rem;
      margin: 1rem 0rem;
      border: solid 1px rgb(9, 249, 205);
      border-radius: 30px;
      box-shadow: 0.2rem 0.3rem 0.5rem rgb(186, 186, 186);
      animation: pop-out 0.35s cubic-bezier(0.6, -0.28, 0.735, 0.045) backwards;
      &:nth-child(1) {
        animation-delay: 0.1s;
      }
      &:nth-child(2) {
        animation-delay: 0.2s;
      }
      &:nth-child(3) {
        animation-delay: 0.3s;
      }
      &:nth-child(4) {
        animation-delay: 0.4s;
      }
      @keyframes pop-out {
        0% {
          opacity: 0;
        }
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1) translateY(5px);
        }
        100% {
          opacity: 1;
        }
      }
      .stat__text {
        padding: 0.5rem 0rem;
        font-size: 2rem;
        text-align: center;
      }
      .stat__bar {
        justify-self: center;
        width: 60%;
        height: 1rem;
        border: solid 1px rgb(186, 186, 186);
        border-radius: 30px;

        .stat__bar--inner {
          height: 100%;
          background: rgb(158, 233, 252);
          &.stat__bar--completed {
            background: rgb(47, 255, 147);
          }
          &.stat__bar--failed {
            background: rgb(255, 47, 92);
          }
        }
      }
    }
  }

  .dialog {
    z-index: 200;
  }
  .btn {
    height: 5rem;
    padding: 0rem 1.5rem;
    margin: 0rem 0.3rem;
    font-size: 2.5rem;
    font-weight: 400;
    text-align: center;
    background: white;
    border: solid 2px rgba(128, 128, 128, 0.363);
    border-radius: 30px;
    box-shadow: 0rem 0.3rem 0.8rem rgba(128, 128, 128, 0.434);
    cursor: pointer;
    transition: all 0.1s ease;
    &:hover {
      color: var(--hover-default);
      box-shadow: 0rem 0.2rem 0.5rem rgba(128, 128, 128, 0.434);
    }
  }
}
</style>
