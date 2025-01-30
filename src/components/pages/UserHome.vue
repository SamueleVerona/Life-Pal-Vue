<template>
  <section class="user-content">
    <user-nav
      v-if="!hasSomeExpired"
      class="navbar"
      @mousedown="handleNavigation"
      :toggleProfile="toggleProfile"
      :isAdmin="isAdmin"
      :isLocked="isLockedUser"
    ></user-nav>
    <section class="elements-section">
      <transition name="elements" mode="out-in">
        <user-calendar
          class="elements__calendar"
          v-if="navButtonClicked === 'calendar' && !isAdmin"
          :userGoals="userGoals"
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
          v-else-if="navButtonClicked === 'dashboard'"
          class="elements__dashboard"
          :calendarTimeOpt="timeSelection"
          :allGoals="userGoals"
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
        <item-card
          v-else
          :dateInfo="dateInfo"
          :itemLabel="dateLabel"
          :goalType="timeSelection"
          :isRequest="toggleProfile"
          class="elements__item-card"
          @goal-saved="resetNav"
          @back-action="handleBackAction"
        ></item-card>
      </transition>
    </section>
    <base-dialog
      :show="hasSomeExpired"
      :userActive="hasSomeExpired"
      :submitText="dialogText"
      :allConfirmed="allConfirmed"
      @confirmAction="confirmMarkedGoals"
      :wrapperBackground="dialogBkgColor"
      :buttonBackground="dialogBtnColor"
    >
      <template #content>
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
      :errorMessage="errorMessage"
      :show="!!errorMessage"
      :submitText="unsubText"
      :allConfirmed="unsubFlag"
      :wrapperBackground="dialogBkgColor"
      :buttonBackground="`var(--confirm-delete)`"
      @close="closeDialog"
      @confirm-action="deleteAccount"
    ></base-dialog>
  </section>
</template>

<script setup>
import { defineComponent, ref, computed, onMounted, provide, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import UserNav from "../navigation/UserNav.vue";
import UserDash from "../navigation/UserDash.vue";
import ItemCard from "../navigation/ItemCard.vue";
import UserCalendar from "../navigation/UserCalendar.vue";

defineComponent(UserNav);
defineComponent(UserDash);
defineComponent(ItemCard);
defineComponent(UserCalendar);

const store = useStore();
const router = useRouter();

const timeSelection = ref();
const dashboardBackup = ref();
const dateInfo = ref();
const dateLabel = ref();

const isAdmin = computed(() => store.getters.userIsAdmin);
const isLockedUser = computed(() => store.getters.userIsLocked);

provide("isAdmin", isAdmin.value);

const userGoals = computed(() => store.getters.userGoals);
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

  if (allConfirmed.value) {
    dialogText.value = "Confirm ";
    dialogBtnColor.value = "var(--confirm-change)";
  }
}

const errorMessage = ref(null);

async function confirmMarkedGoals() {
  try {
    await store.dispatch("confirmExpired", markedGoals.value);
  } catch (err) {
    errorMessage.value = err;
  }
}

function closeDialog() {
  errorMessage.value = false;
}

const viewInfo = ref();
const today = ref(new Date());
viewInfo.value = today.value;
const lastView = ref(null);
const navButtonClicked = ref("calendar");

const toggleProfile = ref(false);

function handleNavigation(e) {
  if (!e.target.classList.contains("btn")) return;

  const targetButton = e.target.dataset.buttonId;
  const isProfileButton = targetButton === "profile";
  const isLogBtn = targetButton === "logout";
  const isUnsubBtn = targetButton === "unsub";
  const isCalendarBtn = targetButton === "calendar";
  const isDashboardBtn = targetButton === "dashboard";

  if (isLogBtn) {
    router.replace({
      path: "/landing",
    });
    store.dispatch("logout");
  }

  const validSession = computed(() => store.getters.isAuth);

  watch(validSession, () => {
    if (!validSession.value)
      router.replace({
        path: "/landing",
      });
  });

  if (isUnsubBtn) {
    unsubText.value = ref("delete account");

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
  dialogBkgColor.value = "var(--danger-light)";
  errorMessage.value = `Thanks for using this app!\n Come back anytime`;
  unsubFlag.value = true;
}

async function deleteAccount() {
  if (unsubFlag.value) {
    try {
      await store.dispatch("deleteAccount");

      router.push({
        path: "/landing",
      });

      errorMessage.value = false;
    } catch (err) {
      navButtonClicked.value = "dashboard";
      errorMessage.value = err;
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

function handleNewItem(navOption) {
  if (navOption === "dashboard") navButtonClicked.value = "dashboard";
  else {
    if (hasMaxItems.value) {
      dialogBkgColor.value = "var(--warning)";
      unsubText.value = "click outside";
      errorMessage.value =
        "Max items reached for this slot.\n Try deleting some";
    } else {
      navButtonClicked.value = "goal";
    }
  }
}

const dialogBkgColor = ref("transparent");
const dialogBtnColor = ref("var(--confirm-default)");

onMounted(() => {
  console.log("mounted");
  if (isAdmin.value) {
    navButtonClicked.value = "dashboard";
  }
});
</script>

<style lang="scss" scoped>
.user-content {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100vw;
  height: 100dvh;
  padding: 2rem;

  .navbar {
    display: flex;
    justify-content: flex-end;
    min-height: 10dvh;
    width: 100%;
    margin: 0rem auto 1rem auto;
    padding: 0.5rem 1rem;
    overflow: visible;
    border: solid 1px rgba(128, 128, 128, 0.308);
    border: none;

    @media screen and (max-width: 500px) {
      padding: 0.5rem 0rem;
    }
  }
}

.elements-section {
  display: contents;

  .elements__dashboard {
    width: 100%;
    height: 100%;
  }
  .elements__item-card {
    width: 45rem;
    height: 100%;
    margin: 0rem auto;
    transition: all 0.3s ease;

    @media screen and (max-width: 1024px) {
      width: 40rem;
    }

    @media screen and (max-width: 500px) {
      width: 90%;
    }
  }

  .elements__calendar {
    width: 100%;
    height: 100%;

    @media screen and (max-width: 500px) {
      max-height: 90dvh;
    }
  }

  .elements-enter-from {
    opacity: 0;
    transform: rotateY(-15deg);
    transform-origin: right;
  }
  .elements-leave-to {
    opacity: 0;
    transform: rotateY(-15deg);
    transform-origin: left;
  }
  .elements-enter-active,
  .elements-leave-active {
    transition: all 0.4s ease;
  }

  .elements-enter-to,
  .elements-leave-from {
    opacity: 1;
    transform: rotateY(0deg);
  }
}
</style>
