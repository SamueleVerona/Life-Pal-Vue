<template>
  <section id="content">
    <user-nav
      v-if="!hasSomeExpired"
      id="nav"
      @mousedown="handleNavigation"
      :triggers="navToggles"
    ></user-nav>
    <section id="user-profile">
      <full-calendar
        v-if="navToggles[0] && !hasSomeExpired"
        ref="calendar"
        :options="calendarOptions"
        @mousedown="handleMousedown"
      ></full-calendar>
      <user-dash
        v-if="navToggles[1] && !hasSomeExpired"
        id="dash-card"
        :goalType="timeDivId"
        :userData="userData"
        :newDate="dateInfo"
        @start-adding="
          (info) => {
            navToggles[1] = !info;
            navToggles[2] = info;
          }
        "
      >
      </user-dash>
      <goal-card
        v-if="navToggles[2] && !hasSomeExpired"
        :dateInfo="dateInfo"
        :goalType="timeDivId"
        id="goal-card"
        @goal-saved="resetCal"
      ></goal-card>
    </section>
    <base-dialog
      :show="hasSomeExpired"
      :userActive="hasSomeExpired"
      :message="'Some goals need confirmation'"
    >
      <template #title>
        <goal-item
          v-for="goal in expiredGoals"
          :key="goal.id"
          :goal="goal"
          :hasExp="hasSomeExpired"
        >
          <!-- <template #selector>
            <input
              class="remove-checkbox"
              type="checkbox"
              :key="goal.id"
              :name="goal.id"
              :value="goal.databaseId"
              v-model="selectedGoals"
            />
          </template> -->
        </goal-item>
      </template>
    </base-dialog>
  </section>
</template>

<script setup>
import { defineComponent, ref, computed, watch } from "vue";
import { useStore } from "vuex";
import UserNav from "../navigation/UserNav.vue";
import UserDash from "../navigation/UserDash.vue";
import GoalCard from "../navigation/GoalCard.vue";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";

defineComponent(UserNav);
defineComponent(UserDash);
defineComponent(GoalCard);
defineComponent(FullCalendar);

const store = useStore();
const timeDivId = ref("type");
const dateInfo = ref();

const userData = computed(() => store.getters.userGoals);
const expiredGoals = computed(() => store.getters.expiredGoals);
const hasSomeExpired = computed(() =>
  expiredGoals.value.length > 0 ? true : false
);
// const selectedGoals = ref([]);
const calendar = ref();
const viewInfo = ref();

const today = ref(new Date());
const tomorrow = ref(new Date(today.value.getTime() + 86400000));

viewInfo.value = today.value;
// const nextWeekDay = ref(new Date(today.value.getTime() + 86400000 * 7));

function setEvents(goals) {
  const parsed = goals.map((goal) => {
    return {
      id: goal.id,
      title: goal.title,
      start: new Date(goal.compDate).toISOString().slice(0, 10),
      type: goal.type,
    };
  });

  calendarOptions.value.events = parsed;
}

watch(userData, () => {
  setEvents(userData.value);
});

function getThisWeekDay(dayOfWeek) {
  const MS_PER_DAY = 86400000;

  let counter = 0;
  let todayDay = today.value.getDay();

  while (todayDay != dayOfWeek) {
    if (todayDay < dayOfWeek) {
      counter++;
      todayDay++;
    }
    if (todayDay > dayOfWeek) {
      counter--;
      todayDay--;
    }
  }
  return new Date(today.value.getTime() + MS_PER_DAY * counter);
}

function setMonthLimits() {
  const MS_PER_DAY = 86400000;
  const today = new Date();
  const dayOfWeek = today.getDay();
  const nextMonday = new Date(today.getTime() + MS_PER_DAY * (8 - dayOfWeek));
  const firstofMonth = new Date(
    nextMonday.getFullYear(),
    nextMonday.getMonth() + 1,
    1
  );
  const lastofMonth = new Date(firstofMonth.getTime() - MS_PER_DAY);
  return {
    start: nextMonday.toISOString().slice(0, 10),
    end: lastofMonth.toISOString().slice(0, 10),
  };
}

const calendarOptions = ref({
  plugins: [dayGridPlugin, multiMonthPlugin, interactionPlugin],
  customButtons: {
    yearly: {
      text: "",
      click: () => {
        handleYearly();
      },
    },
  },
  views: {
    multiMonthYear: {
      type: "multiMonth",
      buttonText: "month",
      dayHeaders: false,
      weekends: false,
      multiMonthTitleFormat: {
        month: "short",
      },
      hiddenDays: [0, 2, 3, 4, 5, 6],
    },
    dayGridMonth: {
      type: "list",
      buttonText: "week",
      weekNumbers: true,
      hiddenDays: [0, 2, 3, 4, 5, 6],
      dayHeaders: false,
      weekNumberFormat: { week: "numeric" },
      dateAlignment: "month",
      validRange: () => setMonthLimits(),
    },
    dayGridDay: {
      type: "dayGrid",
      buttonText: "day",
      visibleRange: {
        start: getThisWeekDay(0),
        end: getThisWeekDay(6),
      },
      validRange: {
        start: tomorrow.value.toISOString().slice(0, 10),
        end: getThisWeekDay(6),
      },
      duration: { weeks: 1 },
      dayCellContent: (args) => {
        args.dayNumberText = args.date.getDate();
        return { html: args.dayNumberText };
      },
    },
  },
  headerToolbar: {
    left: "title",
    center: `today multiMonthYear,dayGridMonth,dayGridDay prev,next yearly`,
    right: "",
  },
  initialView: "dayGridDay",
  multiMonthMaxColumns: 1,
  editable: true,
  selectable: true,
  dayMaxEvents: true,
  weekends: true,
  fixedWeekCount: false,
  eventSources: true,
  datesSet: datesSelection,
  dateClick: handleDateClick,
  eventsSet: () => {
    setYearly();
    if (isYearView.value) {
      setMonthly(viewInfo.value);
    }
  },
  viewDidMount: (info) => {
    setEvents(userData.value);

    viewInfo.value = info;
    currentView.value = info.view.type;
    calendar.value.calendar.gotoDate("2025-01");
  },
});

const currentView = ref();
const yerviewYear = ref();
const lastTarget = ref(null);

function handleMousedown(e) {
  const target = e.target;
  const isValidDate =
    target.dataset.date ===
    `${today.value.getFullYear()}-${today.value.getMonth() + 2}`;

  if (!isValidDate) return;

  const isMonthElement = target.classList.contains("fc-multimonth-month");
  const isSelected = target.getAttribute("isSelected") === "true";

  if (isMonthElement && !isSelected) {
    target.setAttribute("isSelected", "true");
    if (lastTarget.value) lastTarget.value.setAttribute("isSelected", "false");
    lastTarget.value = target;
  }
}

function datesSelection(info) {
  yerviewYear.value = info.startStr.slice(0, 4);
  currentView.value = info.view.type;
  timeDivId.value = calendarOptions.value.views[currentView.value].buttonText;
}

function handleDateClick(arg) {
  dateInfo.value = arg.dateStr;
}

function handleYearly() {
  timeDivId.value = "year";
  navToggles.value[0] = false;
  navToggles.value[1] = true;
}

function perTimeIdEvents(timeIdString, dateString) {
  return userData.value.reduce((idx, goal) => {
    if (goal.type === timeIdString && goal.compDate === dateString) idx++;
    return idx;
  }, 0);
}

const isYearView = computed(() => currentView.value === "multiMonthYear");
// const isDaygridView = computed(() => currentView.value.includes("dayGrid"));

function setMonthly(info) {
  const firstValidYear = +today.value.getFullYear() + 1;
  let elementsArray = info.el.childNodes;
  elementsArray.forEach((el) => {
    el.setAttribute("style", "");
    const fullDate = el.dataset.date + "-01";
    const monthString = new Date(el.dataset.date).toUTCString().slice(8, 11);
    const perMonthEvents = perTimeIdEvents("month", fullDate);
    let eventsIndex = "";
    perMonthEvents ? (eventsIndex = "+" + perMonthEvents) : (eventsIndex = "");
    el.textContent = monthString;
    el.insertAdjacentHTML(
      "beforeend",
      ` <sup class='month-has-events'>${eventsIndex}</sup>`
    );

    const isValidMonth = +el.dataset.date.slice(0, 4) >= firstValidYear;
    if (isValidMonth) el.setAttribute("isValid", true);
  });
}

function setYearly() {
  const currYear = yerviewYear.value + "-01" + "-01";
  const actualTitleValue = viewInfo.value.view.title;

  const yearviewTitle = document.querySelector(".fc-toolbar-title");
  const perYearEvents = perTimeIdEvents("year", currYear);
  let eventsIndex = "";
  perYearEvents ? (eventsIndex = "+" + perYearEvents) : (eventsIndex = "");
  const eventIndexElement = document.querySelector("sup");

  if (isYearView.value) {
    eventIndexElement
      ? (eventIndexElement.textContent = eventsIndex)
      : yearviewTitle.insertAdjacentHTML(
          "beforeend",
          `<sup class='month-has-events'>${eventsIndex}</sup>`
        );
  } else {
    eventIndexElement
      ? eventIndexElement.remove()
      : (yearviewTitle.textContent = actualTitleValue);
  }

  displayYearly();
}

function displayYearly() {
  const yearlyButtonEl = document.querySelector(".fc-yearly-button");
  const currYear = yerviewYear.value + "-01" + "-01";

  const perYearEvents = perTimeIdEvents("year", currYear);

  if (yerviewYear.value < +today.value.getFullYear() + 1) {
    yearlyButtonEl.classList.add("is-hidden");
  } else {
    yearlyButtonEl.classList.remove("is-hidden");
  }

  if (isYearView.value) {
    perYearEvents
      ? (yearlyButtonEl.textContent = "show")
      : (yearlyButtonEl.textContent = "set yearly");
  } else {
    yearlyButtonEl.textContent = "";
  }
}

const navToggles = ref([true, false, false, false, false]);

function handleNavigation(e) {
  const btnIndex = e.target.dataset.index ? +e.target.dataset.index : null;
  if (btnIndex === null) return;
  navToggles.value.forEach((_, i, arr) => {
    i === btnIndex ? (arr[i] = true) : (arr[i] = false);
  });

  if (btnIndex === 3) {
    navToggles.value[1] = true;
    timeDivId.value = "completed";
  } else if (btnIndex === 4) {
    navToggles.value[1] = true;
    timeDivId.value = "failed";
  } else {
    timeDivId.value = calendarOptions.value.views[currentView.value].buttonText;
  }
}

function resetCal(set) {
  navToggles.value[0] = set;
  navToggles.value[2] = false;
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
  margin: 1rem auto;
  padding: 0.8rem;
  border: solid 1px rgba(128, 128, 128, 0.308);
  border-radius: 40px;
  box-shadow: 0rem 0.5rem 0rem rgba(128, 128, 128, 0.308);
  height: 12vh;
}

#user-profile {
  display: flex;
  padding: 1rem 0rem;
  height: 88vh;
}

#goal-card {
  padding: 0rem 1rem;
  box-shadow: 0rem 0.5rem 0rem rgba(115, 64, 255, 0.782);
  background: rgb(186, 146, 255);
  border-radius: 30px;
}
goal-item {
  height: 100%;
}

#dash-card,
#goal-card {
  width: 50%;
  margin: auto;
}
#dash-card,
:deep(.fc) {
  height: 100%;
}

:deep(.fc) {
  display: flex;
  margin: 0rem 1rem;
  padding: 1rem;
  font-size: 5rem;
  font-family: "Roboto", sans-serif;
  flex: 2;
  border-radius: 30px;
  border: solid 2px rgba(128, 128, 128, 0.308);
  box-shadow: 0rem 0.5rem 0rem rgba(128, 128, 128, 0.308);
}

:deep(.fc .fc-toolbar.fc-header-toolbar) {
  margin-bottom: 1rem;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

:deep(.fc-toolbar-chunk) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  /* border: solid; */
}

:deep(.fc-toolbar-chunk:first-child) {
  font-size: 4rem;
}
:deep(.fc-multimonth-title) {
  font-size: 3rem;
}

:deep(.fc-multiMonthYear-view) {
  border: none;
}

:deep(.fc-button) {
  font-size: 1.8rem;
  line-height: 3rem;
}
/* :deep(.fc-toolbar-chunk:nth-child(2)) {
  padding: 0 1rem;
} */

:deep(.fc-toolbar-chunk:nth-child(3)) {
  display: none;
}
:deep(.fc-yearly-button) {
  color: rgb(0, 149, 255);
  background: none;
  font-size: inherit;
  font-weight: bolder;
  border-radius: 10px;

  border: rgb(221, 1, 255) 3px solid;
}
:deep(.fc-yearly-button:hover) {
  background: none;
  color: rgb(0, 149, 255);
  border-color: rgb(0, 242, 255);
}

:deep(table) {
  padding: 0;
  font-size: 25rem;
}

:deep(.fc-scrollgrid),
:deep(.fc-col-header-cell),
:deep(.fc-daygrid-day),
:deep(.fc-scroller-liquid-absolute),
:deep(td) {
  border: none;
}
:deep(.fc-daygrid-day) {
  border-radius: 10px;
}

:deep(.fc-daygrid-day-frame) {
  font-weight: bolder;
  border: solid 2px #510094;
  border-radius: 12px;
  height: 5rem;
  color: #2c3e50;
}

:deep(.fc-event-title-container) {
  font-size: 10rem;
}

:deep(.fc-multimonth-month) {
  border: solid 2px #510094;
  border-radius: 10px;
  cursor: pointer;
  width: 20%;
  height: auto;
  background: rgba(200, 177, 246, 0.526);
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  align-content: center;
  justify-content: center;
  padding: 0;
}

:deep(.fc .fc-multimonth-multicol .fc-multimonth-month) {
  padding: 0;
}

:deep(.fc-multimonth-month[isValid]),
:deep(td[isValid] > div) {
  border: solid rgb(221, 1, 255) 3px;
  border-radius: 10px;
  cursor: pointer;
  background: none;
}

:deep(.fc-multimonth-daygrid-table),
:deep(thead) {
  display: none;
}
:deep(.fc-multimonth-title) {
  display: none;
}

:deep(.fc-daygrid-day.fc-day-today) {
  background: rgba(2, 177, 78, 0.182);
  border-radius: 10px;
}

:deep(.fc-daygrid-week-number) {
  background: none;
  color: orange;
  font-size: 2rem;
}
:deep(.fc-multimonth-month[isSelected="true"]) {
  background-color: var(--fc-highlight-color);
  position: relative;
}

:deep(.month-has-events) {
  color: rgb(0, 149, 255);
  z-index: 100;
}
:deep(sup) {
  cursor: pointer;
}
:deep(sup:hover) {
  color: rgb(255, 128, 0);
}

:deep(.is-hidden) {
  display: none;
}
</style>
