<template>
  <section id="calendar-element">
    <full-calendar
      ref="calendar"
      :options="calendarOptions"
      @mousedown="handleMousedown"
    >
    </full-calendar>

    <!-- MULTI YEAR VIEW IMPLEMENTATION NEEDS OWN BRANCH
    <section id="multi-year-view" v-if="isYearView && isYearSelected">
      <u id="multi-year-list">
        <li
          v-for="year in decadeYears"
          :key="year"
          class="decade-year"
          @mousedown="setSelected"
          selected="false"
          :data-year="year"
        >
          <div :data-year="year" class="decade-year-element">
            {{ year }}
          </div>
        </li>
      </u>
    </section> -->
  </section>
</template>

<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
defineComponent(FullCalendar);

import {
  defineComponent,
  ref,
  computed,
  watch,
  defineProps,
  defineEmits,
  onMounted,
} from "vue";

const props = defineProps(["userData", "view"]);
const emits = defineEmits([
  "sendTimeId",
  "sendLastView",
  "sendDate",
  "sendNavOptions",
]);
const decadeYears = ref([]);

function setMultiYear() {
  const dummy = [];
  const currentYear = +new Date().getFullYear();
  for (let i = 0; i <= 10; i++) {
    dummy.push(currentYear + i);
  }
  decadeYears.value = dummy;
}
onMounted(() => {
  if (props.view) calendar.value.getApi().changeView(props.view);
  setMultiYear();
});

const calendar = ref();
const viewInfo = ref();

const today = ref(new Date());
const tomorrow = ref(new Date(today.value.getTime() + 86400000));

viewInfo.value = today.value;

function setEvents(goals) {
  const parsed = goals.map((goal) => {
    return {
      id: goal.id,
      title: goal.title,
      start: new Date(goal.compDate).toISOString().slice(0, 10),
      type: goal.type,
      borderColor: "white",
      backgroundColor: "transparent",
    };
  });

  calendarOptions.value.events = parsed;
}

watch(props, () => {
  setEvents(props.userData);
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
    // yearly: {
    //   text: "year",
    //   click: () => {
    //     handleYearly();
    //   },
    // },
    add: {
      text: "add goal",
      click: () => navigateTo("goal"),
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
      dayMaxEventRows: true,

      weekNumberFormat: { week: "numeric" },
      dateAlignment: "month",
      validRange: () => setMonthLimits(),
    },
    dayGridDay: {
      type: "dayGrid",
      buttonText: "day",

      visibleRange: {
        start: getThisWeekDay(1),
        end: getThisWeekDay(6),
      },
      validRange: {
        start: tomorrow.value.toISOString().slice(0, 10),
        end: getThisWeekDay(7),
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
    center: `multiMonthYear,dayGridMonth,dayGridDay add`,
    right: "",
  },
  initialView: "dayGridDay",
  firstDay: 1,
  weekNumberCalculation: "local",
  multiMonthMaxColumns: 1,
  dayMaxEvents: 1,
  dayMaxEventRows: 1,
  editable: true,
  selectable: true,
  weekends: true,
  fixedWeekCount: false,
  eventSources: true,
  moreLinkClick: () => navigateTo("dashboard"),
  datesSet: datesSelection,
  dateClick: handleDateClick,
  eventsSet: () => {
    setYearly();
    if (isYearView.value) {
      setMonthly(viewInfo.value);
    }
  },
  viewDidMount: (info) => {
    setEvents(props.userData);

    viewInfo.value = info;
    currentView.value = info.view.type;
    if (isYearView.value) {
      calendar.value.getApi().gotoDate("2025-01");
    }
  },
  viewWillUnmount: (info) => {
    emits("sendLastView", info.view.type);
    // lastView.value = info.view.type;
  },
});

const currentView = ref();
const yerviewYear = ref();
const lastTarget = ref(null);

function navigateTo(navTargetString) {
  emits("sendNavOptions", navTargetString);
}

function handleMousedown(e) {
  const target = e.target;
  const isMonthElement = target.classList.contains("fc-multimonth-month");
  const isGoalsIndex = target.classList.contains("month-has-events");

  if (isGoalsIndex) navigateTo("dashboard");
  if (!isMonthElement) return;

  handleDateClick(target);

  const isSelected = target.getAttribute("is-selected") === "true";

  if (!isSelected) {
    target.setAttribute("is-selected", "true");
    if (lastTarget.value) lastTarget.value.setAttribute("is-selected", "false");
    lastTarget.value = target;
  }
}

function datesSelection(info) {
  yerviewYear.value = info.startStr.slice(0, 4);
  currentView.value = info.view.type;

  const timeId = calendarOptions.value.views[currentView.value].buttonText;
  emits("sendTimeId", timeId);
}

function handleDateClick(arg) {
  if (isYearView.value) {
    emits("sendDate", {
      actualDate: arg.dataset.date + "-01",
      dateLabel: new Date(arg.dataset.date + "-01")
        .toDateString()
        .split(" 01 ")
        .join(" ")
        .slice(4),
    });
  } else {
    const dateLabel = arg.dayEl.querySelector("a").getAttribute("aria-label");
    emits("sendDate", { actualDate: arg.dateStr, dateLabel });
  }
}

function perTimeIdEvents(timeIdString, dateString) {
  return props.userData.reduce((idx, goal) => {
    if (goal.type === timeIdString && goal.compDate === dateString) idx++;
    return idx;
  }, 0);
}

const isYearView = computed(() => currentView.value === "multiMonthYear");

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

  // displayYearly();
}

// MULTI YEAR VIEW IMPLEMENTATION NEEDS OWN BRANCH
//----------------------------------------------------//

// function displayYearly() {
//   const yearlyButtonEl = document.querySelector(".fc-yearly-button");
//   const currYear = yerviewYear.value + "-01" + "-01";

//   const perYearEvents = perTimeIdEvents("year", currYear);

//     if (yerviewYear.value < +today.value.getFullYear() + 1) {
//       yearlyButtonEl.classList.add("is-hidden");
//     } else {
//       yearlyButtonEl.classList.remove("is-hidden");
//     }

//   if (isYearView.value) {
//     perYearEvents
//       ? (yearlyButtonEl.textContent = "year")
//       : (yearlyButtonEl.textContent = "set yearly");
//   }
// }

// const isYearSelected = ref(false);

// function emulateMultiYear() {
//   document.querySelector(".fc-multiMonthYear-view").classList.add("is-hidden");
//   document
//     .querySelector(".fc-multiMonthYear-button")
//     .classList.remove("fc-button-active");
//   document.querySelector(".fc-yearly-button").classList.add("fc-button-active");
// }

// function handleYearly() {
//   isYearSelected.value = true;

//   if (isYearView.value) emulateMultiYear();
//   else {
//     calendar.value.getApi().changeView("multiMonthYear");
//     emulateMultiYear();
//     isYearSelected.value = true;
//   }

// emits("sendTimeId", "year");
// if (e.target.textContent === "show") {
//   emits("senNavOptions", [false, true, false]);
// } else {
//   emits("senNavOptions", [false, false, true]);
// }
// }

// const prevSelectedYear = ref();

// function setSelected(e) {
//   const yearDate = e.target.dataset.year + "-01-01";
//   emits("sendDate", yearDate);

//   e.target.setAttribute("selected", true);
//   if (!prevSelectedYear.value) {
//     prevSelectedYear.value = e.target;
//   } else {
//     prevSelectedYear.value.setAttribute("selected", false);
//     prevSelectedYear.value = e.target;
//   }
// }
</script>

<style scoped>
* {
  text-decoration: none;
}
/* #calendar-element {
  position: relative;
} */

/* ul,
li {
  list-style: none;
  text-decoration: none;
} */

:deep(.is-hidden) {
  display: none;
}

:deep(.fc) {
  height: 100%;
  width: 100%;
  padding: 1rem;
  display: flex;
  font-size: 5rem;
  border-radius: 30px;
  border: solid 2px rgba(128, 128, 128, 0.308);
  border-bottom: solid 3px rgba(128, 128, 128, 0.308);

  font-family: "Roboto", sans-serif;
}

:deep(.fc .fc-toolbar.fc-header-toolbar) {
  margin-bottom: 0;
  min-height: max-content;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: none;
  padding: 1rem 0rem;
  /* flex: 1; */
}
:deep(.fc .fc-toolbar-title) {
  font-size: 8rem;
}

:deep(.fc-toolbar-chunk) {
  display: flex;
  justify-content: center;
  align-items: center;
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

:deep(.fc .fc-button-primary) {
  padding: 0.5rem 1.5rem;
  font-size: 2.5rem;
  line-height: 3rem;
  border: none;
  background: none;
  border: solid 2px rgb(218, 218, 218);
  border-bottom: solid 3px rgb(218, 218, 218);
  border-radius: 30px;
  color: inherit;
}

:deep(.fc .fc-button-primary:disabled),
:deep(.fc .fc-button-primary:disabled:active),
:deep(.fc .fc-button-primary:disabled:hover) {
  background: rgba(218, 218, 218, 0.204);
  border: solid 2px rgb(218, 218, 218);
  border-bottom: solid 3px rgb(218, 218, 218);
  color: #2c3e50;
}
:deep(.fc .fc-button-primary:hover) {
  color: rgb(0, 189, 196);
}

:deep(.fc .fc-button-primary:focus),
:deep(.fc .fc-button-primary:not(:disabled):focus) {
  box-shadow: none;
  border: solid 2px rgb(121, 188, 255);
}

:deep(.fc .fc-button-primary:active),
:deep(.fc .fc-button-primary:not(:disabled).fc-button-active) {
  background: none;
  border: solid 1px rgb(1, 217, 229);
  border-bottom: solid 2px rgb(0, 242, 255);
  color: rgb(4, 167, 172);
}

:deep(.fc .fc-add-button) {
  width: max-content;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  margin: 0rem 0.5rem;
  font-size: 2.5rem;
  font-family: inherit;
  font-weight: 500;
  background: none;
  border: solid 2px rgb(236, 225, 71);
  border-bottom: solid 3px rgb(225, 235, 34);
  color: rgb(181, 169, 0);
}

:deep(.fc .fc-add-button:hover) {
  color: rgb(243, 138, 96);
}

:deep(.fc-toolbar-chunk:nth-child(3)) {
  display: none;
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
  background: white;
  border: black;
}
:deep(.fc-event-title) {
  display: none;
  font-size: 5rem;
  content: "0";
  border: black;

  height: 5rem;
  background: white;
  border: black;
}

:deep(.fc-event-title-container::after) {
  content: "+1";
  font-size: 2rem;
  height: 3rem;
  width: 3rem;
  /* background: black; */
  color: #47a3ff;

  border: none;
  border: black;
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
:deep(.fc-multimonth-month[is-selected="true"]) {
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
</style>
