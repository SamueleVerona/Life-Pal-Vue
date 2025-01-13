<template>
  <!-- <router-link :to="userId"></router-link> -->
  <section id="content">
    <user-nav
      v-if="!hasSomeExpired"
      id="nav"
      @mousedown="handleNavigation"
      :toggleProfile="toggleProfile"
      :isAdmin="isAdmin"
    ></user-nav>
    <section id="user-home-element">
      <user-calendar
        id="calendar-element"
        v-if="navButtonClicked === 'calendar' && !hasSomeExpired && !isAdmin"
        :userGoals="userData"
        @send-time-id="
          (timeId) => {
            dashboardBackup = timeId;
            timeSelection = timeId;
          }
        "
        @send-last-view="(view) => (lastView = view)"
        @send-date="
          (date) => {
            dateInfo = date.actualDate;
            dateLabel = date.dateLabel;
          }
        "
        @send-nav-options="handleNewItem"
        @max-items-reached="blockNewItem"
        :view="lastView"
      ></user-calendar>
      <user-dash
        v-if="navButtonClicked === 'dashboard' && !hasSomeExpired"
        id="dash-element"
        :calendarTimeOpt="timeSelection"
        :allGoals="userData"
        :finished="finished"
        :unfinished="unfinished"
        :profileModeActive="toggleProfile"
        :userIsAdmin="isAdmin"
        :userRequests="userRequests"
        @max-items-reached="blockNewItem"
        @open-new-item="handleNewItem"
        @open-calendar="
          () => {
            navButtonClicked = 'calendar';
          }
        "
      >
      </user-dash>
      <goal-card
        v-if="navButtonClicked === 'goal' && !hasSomeExpired"
        :dateInfo="dateInfo"
        :itemLabel="dateLabel"
        :goalType="timeSelection"
        :isRequest="toggleProfile"
        id="goal-card-element"
        @goal-saved="resetNav"
        @back-action="handleBackAction"
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
        <list-item
          v-for="goal in expiredGoals"
          :item="goal"
          :hasExpired="hasSomeExpired"
          :key="goal.id"
          @sendMarkedItem="handleMarkedGoals"
        >
        </list-item>
      </template>
    </base-dialog>
    <base-dialog
      :errorMessage="gottenError"
      :show="!!gottenError"
      :submitText="unsubText"
      :allConfirmed="unsubFlag"
      :buttonBackground="`var(--dialog-button-color-delete)`"
      :wrapperBackground="dialogBkgColor"
      @close="closeDialog"
      @confirm-action="deleteAccount"
    ></base-dialog>
  </section>
</template>

<script setup>
import { defineComponent, ref, computed, onMounted, provide } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import UserNav from "../navigation/UserNav.vue";
import UserDash from "../navigation/UserDash.vue";
import GoalCard from "../navigation/ItemCard.vue";
import UserCalendar from "../navigation/UserCalendar.vue";

defineComponent(UserNav);
defineComponent(UserDash);
defineComponent(GoalCard);
defineComponent(UserCalendar);

const store = useStore();
const router = useRouter();

const timeSelection = ref();
const dashboardBackup = ref();
const dateInfo = ref();
const dateLabel = ref();

const isAdmin = computed(() => store.getters.userIsAdmin);

provide("isAdmin", isAdmin.value);

const userData = computed(() => store.getters.userGoals);
const finished = computed(() => store.getters.finishedGoals);
const unfinished = computed(() => store.getters.unfinishedGoals);

const expiredGoals = computed(() => store.getters.expiredGoals);
const hasSomeExpired = computed(() =>
  expiredGoals.value.length > 0 ? true : false
);
const userRequests = computed(() => store.getters.allRequests);

const markedGoals = ref({});
const dialogText = ref("Time to be honest");

const allConfirmed = computed(
  () => Object.keys(markedGoals.value).length === expiredGoals.value.length
);

function handleMarkedGoals(goalObj) {
  const goalId = goalObj.itemId;
  markedGoals.value[goalId] = goalObj;

  if (allConfirmed.value) dialogText.value = "Confirm ";
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

const toggleProfile = ref(false);

function handleNavigation(e) {
  if (!e.target.id.includes("button")) return;

  const targetButton = e.target.dataset.buttonId;
  const isProfileButton = targetButton.includes("profile");
  const isLogBtn = targetButton.includes("log");
  const isUnsubBtn = targetButton.includes("unsub");
  const isCalendarBtn = targetButton.includes("calendar");
  const isDashboardBtn = targetButton.includes("dashboard");

  if (isLogBtn) {
    router.push({
      path: "/landing",
    });
    store.dispatch("logout");
  }
  if (isUnsubBtn) {
    unsub();
  }
  if (isProfileButton) {
    navButtonClicked.value = "dashboard";

    toggleProfile.value = !toggleProfile.value;
  }

  if (isDashboardBtn || isCalendarBtn) {
    navButtonClicked.value = targetButton;
  } else {
    timeSelection.value = dashboardBackup.value;
  }
}

const unsubText = ref("delete account");
const unsubFlag = ref(false);

function unsub() {
  dialogBkgColor.value = "var(--dialog-wrapper-color-delete)";
  gottenError.value = `Thanks for using this app!\n Come back anytime`;
  unsubFlag.value = true;
}

async function deleteAccount() {
  if (unsubFlag.value) {
    try {
      await store.dispatch("deleteAccount");

      router.push({
        path: "/landing",
      });

      gottenError.value = false;
    } catch (err) {
      navButtonClicked.value = "dashboard";
      gottenError.value = err;
    }
  }
  unsubFlag.value = false;
}

function resetNav() {
  navButtonClicked.value = "dashboard";
  dateInfo.value = "";
  dateLabel.value = "";
}

function handleBackAction() {
  if (isAdmin.value || toggleProfile.value) {
    navButtonClicked.value = "dashboard";
  } else {
    navButtonClicked.value = "calendar";
  }
}

const hasMaxItems = ref(false);

function blockNewItem(boolean) {
  hasMaxItems.value = boolean;
}

function handleNewItem() {
  if (hasMaxItems.value) {
    dialogBkgColor.value = "var(--dialog-button-color-default-earth)";
    unsubText.value = "click outside";
    gottenError.value = "Max items reached for this slot.\n Try deleting some";
  } else {
    navButtonClicked.value = "goal";
  }
}

const dialogBkgColor = ref("black");

onMounted(() => {
  if (isAdmin.value) {
    navButtonClicked.value = "dashboard";
  }
});
</script>

<style scoped>
#content {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 2rem;
}
#nav {
  margin: 1rem auto;
  width: 100%;

  padding: 0.5rem 1rem;
  border: solid 1px rgba(128, 128, 128, 0.308);
  min-height: 10vh;
  display: flex;
  justify-content: flex-end;
  border: none;
}

#user-home-element {
  display: contents;
}

#dash-element {
  width: 100%;
  height: 100%;
}
#goal-card-element {
  width: 60%;
  margin: 0rem auto;
}

#goal-card-element {
  height: 100%;
}

#calendar-element {
  width: 100%;
  height: 100%;
}

@media screen and (max-width: 500px) {
  #goal-card-element {
    width: 100%;
  }

  #calendar-element {
    max-height: 90dvh;
  }
}
</style>
