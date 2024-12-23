<template>
  <section id="content">
    <user-nav
      v-if="!hasSomeExpired"
      id="nav"
      @mousedown="handleNavigation"
      :triggers="navButtonClicked"
    ></user-nav>
    <section id="user-home-element">
      <user-calendar
        id="calendar-element"
        v-if="navButtonClicked === 'calendar' && !hasSomeExpired"
        :userData="userData"
        @send-time-id="
          (timeId) => {
            dashboardBackup = timeId;
            timeDivId = timeId;
          }
        "
        @send-last-view="(view) => (lastView = view)"
        @send-date="
          (date) => {
            dateInfo = date.actualDate;
            dateLabel = date.dateLabel;
          }
        "
        @send-nav-options="(navTo) => (navButtonClicked = navTo)"
        :view="lastView"
      ></user-calendar>
      <user-dash
        v-if="navButtonClicked === 'dashboard' && !hasSomeExpired"
        id="dash-element"
        :goalType="timeDivId"
        :userData="userData"
        :newDate="dateInfo"
        @start-adding="
          () => {
            navButtonClicked = 'goal';
          }
        "
      >
      </user-dash>
      <goal-card
        v-if="navButtonClicked === 'goal' && !hasSomeExpired"
        :dateInfo="dateInfo"
        :dateLabel="dateLabel"
        :goalType="timeDivId"
        id="goal-card-element"
        @goal-saved="resetCal"
      ></goal-card>
    </section>
    <base-dialog
      :show="hasSomeExpired"
      :userActive="hasSomeExpired"
      :submitText="dialogText"
      :allConfirmed="allConfirmed"
      @confirmAction="confirmMarkedGoals"
    >
      <template #title>
        <goal-item
          v-for="goal in expiredGoals"
          :goal="goal"
          :hasExpired="hasSomeExpired"
          :key="goal.id"
          @sendMarkedGoal="handleMarkedGoals"
        >
        </goal-item>
      </template>
    </base-dialog>
    <base-dialog
      :errorMessage="gottenError"
      :show="!!gottenError"
      @close="closeDialog"
    ></base-dialog>
  </section>
</template>

<script setup>
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import UserNav from "../navigation/UserNav.vue";
import UserDash from "../navigation/UserDash.vue";
import GoalCard from "../navigation/GoalCard.vue";
import UserCalendar from "../navigation/UserCalendar.vue";

defineComponent(UserNav);
defineComponent(UserDash);
defineComponent(GoalCard);
defineComponent(UserCalendar);

const store = useStore();
const timeDivId = ref();
const dashboardBackup = ref();
const dateInfo = ref();
const dateLabel = ref();

const userData = computed(() => store.getters.userGoals);
const expiredGoals = computed(() => store.getters.expiredGoals);
const hasSomeExpired = computed(() =>
  expiredGoals.value.length > 0 ? true : false
);

const markedGoals = ref({});
const dialogText = ref("Time to be honest");

const allConfirmed = computed(
  () => Object.keys(markedGoals.value).length === expiredGoals.value.length
);

function handleMarkedGoals(goalObj) {
  const goalId = goalObj.goalId;
  markedGoals.value[goalId] = goalObj;

  if (allConfirmed.value) dialogText.value = "Confirm when you're ready";
}

const gottenError = ref(null);

async function confirmMarkedGoals() {
  try {
    await store.dispatch("confirmExpired", markedGoals.value);
  } catch (err) {
    gottenError.value = err;
  }
}

function closeDialog() {
  gottenError.value = false;
}

const viewInfo = ref();
const today = ref(new Date());
viewInfo.value = today.value;
const lastView = ref(null);
const navButtonClicked = ref("calendar");

function handleNavigation(e) {
  if (!e.target.id.includes("button")) return;

  const targetButton = e.target.dataset.buttonId;

  if (targetButton === "completed" || targetButton === "failed") {
    timeDivId.value = targetButton;
    navButtonClicked.value = "dashboard";
  } else {
    timeDivId.value = dashboardBackup.value;
    navButtonClicked.value = targetButton;
  }
}

function resetCal() {
  navButtonClicked.value = "calendar";
}
</script>

<style scoped>
#content {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 90vh;
  padding: 0 1rem;
}
#nav {
  margin: auto;
  margin-top: 1rem;
  width: max-content;
  padding: 0.5rem 1rem;
  border: solid 1px rgba(128, 128, 128, 0.308);
  border-radius: 60px;
  height: 15vh;
  /* border: solid; */
}

#user-home-element {
  display: flex;
  padding: 1rem 0rem;
  height: 88vh;
}

goal-item {
  height: 100%;
}

#dash-element {
  width: 100%;
}
#goal-card-element {
  width: 50%;
  margin: 0rem auto;
}

#goal-card-element {
  height: 100%;
}
#dash-element,
:deep(.fc) {
  height: 100%;
}

#calendar-element {
  width: 100%;
}
</style>
