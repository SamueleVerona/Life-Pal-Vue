<template>
  <section id="content">
    <calendar-nav
      id="nav"
      :timeDivs="timeDivsArr"
      @sendText="passText"
    ></calendar-nav>
    <full-calendar
      ref="calendar"
      :options="calendarOptions"
      @mousedown="handleMousedown"
    ></full-calendar>
    <goals-list
      id="goals"
      :goalType="timeDivId"
      :userData="userData"
      :insertNewGoal="trigger"
    >
    </goals-list>
  </section>
</template>

<script setup>
// watch(userData, () => {
//   if (
//     userData.value.filter((goal) => goal.type === timeDivId.value).length === 0
//   )
//     timeDivId.value = "type";
// });
// watch(userData, () => (timeDivId.value = "type"));
import {
  defineComponent,
  ref,
  computed,
  watch,
  // onMounted,
  // onBeforeUpdate,
} from "vue";
import { useStore } from "vuex";
import CalendarNav from "../navigation/CalendarNav.vue";
import GoalsList from "../navigation/GoalsList.vue";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";

defineComponent(CalendarNav);
defineComponent(GoalsList);
defineComponent(FullCalendar);

const store = useStore();
const timeDivId = ref("type");
function passText(gottenText) {
  timeDivId.value = gottenText;
}
const userData = computed(() => store.getters.userGoals);

const timeDivsArr = computed(
  () => new Set(userData.value.map((goal) => goal.type))
);

const calendar = ref();
const viewInfo = ref();

const today = ref(new Date());
const tomorrow = ref(new Date(today.value.getTime() + 86400000));
const nextWeekDay = ref(new Date(today.value.getTime() + 86400000 * 7));

function setEvents(goals) {
  const parsed = goals.map((goal) => {
    return {
      id: goal.id,
      title: goal.title,
      start: new Date(goal.compDate).toISOString().slice(0, 10),
    };
  });
  calendarOptions.value.events = parsed;
}

watch(userData, () => setEvents(userData.value));

function getThisWeekDay(dayOfWeek) {
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
  return new Date(today.value.getTime() + 86400000 * counter);
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
      text: "set yearly",
      click: () => console.log("clicked"),
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
    dailyGridDay: {
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
    center: `today multiMonthYear,dayGridMonth,dailyGridDay prev,next yearly`,
    right: "",
  },
  initialView: "dayGridMonth",
  multiMonthMaxColumns: 1,
  editable: true,
  selectable: true,
  dayMaxEvents: true,
  weekends: true,
  fixedWeekCount: false,
  eventSources: true,
  datesSet: datesSelection,
  dateClick: handleDateClick,
  viewDidMount: (info) => {
    viewInfo.value = info;
    currentView.value = info.view.type;
  },
});

const trigger = ref();
const currentView = ref();
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
  currentView.value = info.view.type;
  setValid(viewInfo.value);
  timeDivId.value = calendarOptions.value.views[currentView.value].buttonText;
}

function handleDateClick(arg) {
  trigger.value = arg.dateStr;
}

const validMonth = computed(() => {
  if (currentView.value === "dailyGridDay") return today.value.getMonth() + 1;
  else if (currentView.value === "dayGridMonth")
    return +nextWeekDay.value.getMonth() + 1;
  else return +today.value.getMonth() + 2;
});

function setValid(info) {
  let elementsArray = info.el.childNodes;

  if (info.view.type.includes("dayGrid"))
    elementsArray = info.el.querySelectorAll("[role='gridcell']");

  elementsArray.forEach((el) => {
    if (info.view.type === "multiMonthYear") {
      const monthName = el.firstElementChild.firstElementChild.textContent;
      el.textContent = monthName;
    }
    el.setAttribute("style", "");

    const isValidMonth = el.dataset.date?.includes(
      `${new Date().getFullYear()}-${validMonth.value}`
    );
    if (isValidMonth) {
      el.setAttribute("isValid", true);
    }
  });
}
</script>

<style scoped>
#content {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 90vh;
  padding: 0 1rem;
}
#nav {
  display: none;
}
#nav,
#goals {
  height: 90%;
  flex: 1;
}

:deep(.fc) {
  display: flex;
  height: 90%;
  margin: auto 1rem;
  padding: 1rem;
  font-size: 5rem;
  font-family: "Roboto", sans-serif;
  flex: 2;
  border-radius: 30px;
  border: solid 1px rgba(128, 128, 128, 0.308);
  box-shadow: 1rem 1rem 0.5rem rgba(128, 128, 128, 0.308);
  backdrop-filter: sepia;
}

:deep(.fc .fc-toolbar.fc-header-toolbar) {
  margin-bottom: 1rem;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  /* border: solid; */
  /* padding: 0 1rem; */
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
  color: rgb(255, 128, 0);
  background: none;
  font-size: inherit;
  font-weight: bolder;
  border-radius: 10px;

  border: rgb(90, 211, 255) 3px solid;
}
:deep(.fc-yearly-button:hover) {
  background: none;
  color: rgb(172, 29, 255);
  border-color: rgb(33, 238, 190);
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
  /* width: 10rem;
  height: 10%; */
}

/* :deep(.fc-scrollgrid-sync-inner) {
  font-weight: bolder;
  border: solid rgb(144, 207, 218) 1px;
  border-radius: 10px;
} */
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
/* :deep(td > div) {
  border-radius: 10px;
  cursor: pointer;
  background: none;
} */

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
}
</style>
