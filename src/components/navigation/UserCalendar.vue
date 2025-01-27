<template>
  <section id="calendar-element">
    <full-calendar
      ref="calendar"
      :options="calendarOptions"
      @mousedown="handleMousedown"
    >
    </full-calendar>
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

const props = defineProps(["userGoals", "view"]);
const emits = defineEmits([
  "sendTimeId",
  "sendLastView",
  "sendDate",
  "sendNavOptions",
  "maxItemsReached",
]);

onMounted(() => {
  if (props.view) calendar.value.getApi().changeView(props.view);
});

const calendar = ref();
const viewInfo = ref();

const today = ref(new Date());
const tomorrow = ref(new Date(today.value.getTime() + 86400000));

viewInfo.value = today.value;

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
      weekNumberFormat: { week: "long" },
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
  handleWindowResize: true,
  windowResizeDelay: 1,
  locale: "en",
  windowResize: () => {
    const calApi = calendar.value.getApi();
    if (window.innerWidth < 768 && window.innerWidth > 500) {
      calApi.setOption("multiMonthTitleFormat", { month: "narrow" });

      calApi.setOption("weekNumberFormat", { week: "short" });
    } else {
      calApi.setOption("weekNumberFormat", { week: "long" });
      calApi.setOption("multiMonthTitleFormat", { month: "short" });
    }
  },
  moreLinkClick: () => navigateTo("dashboard"),
  datesSet: datesSelection,
  dateClick: () => {
    return;
  },
  eventsSet: () => {
    if (isWeekView.value) setWeekGoals(viewInfo.value);
    else if (isYearView.value) {
      setMonthGoals(viewInfo.value);
    } else {
      setDayGoals(viewInfo.value);
    }
  },
  viewDidMount: (info) => {
    viewInfo.value = info;
    currentView.value = info.view.type;
  },
  viewWillUnmount: (info) => {
    emits("sendLastView", info.view.type);
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
  const isWeekElement =
    target.classList.contains("fc-daygrid-day-frame") &&
    currentView.value === "dayGridMonth";

  const isDayElement =
    target.classList.contains("fc-daygrid-day-frame") &&
    currentView.value === "dayGridDay";

  const parentIsDisabeld =
    target.parentElement.classList.contains("fc-day-disabled");
  const hasEventIndex = Array.from(target.children).some((child) =>
    child.classList.contains("slot-events-index")
  );
  const isEventsIndex = target.classList.contains("slot-events-index");

  if (hasEventIndex)
    globalSlotEvents.value =
      +target.querySelector(".slot-events-index").textContent;

  if (isEventsIndex) navigateTo("dashboard");

  if (!isMonthElement && !isWeekElement && !isDayElement) return;
  if (parentIsDisabeld) return;

  handleDateClick(target, isWeekElement);

  const isSelected = target.getAttribute("is-selected") === "true";
  const isDisabled = target.getAttribute("disabled") === "true";

  if (!isSelected && !isDisabled) {
    target.setAttribute("is-selected", "true");
    if (lastTarget.value) lastTarget.value.setAttribute("is-selected", "false");
    lastTarget.value = target;
  }
}

function datesSelection(info) {
  yerviewYear.value = info.startStr.slice(0, 4);
  currentView.value = info.view.type;

  const timeSelection =
    calendarOptions.value.views[currentView.value].buttonText;

  emits("sendTimeId", timeSelection);
}

function handleDateClick(element, isWeekElement = false) {
  let actualDate;
  let dateLabel;

  if (isYearView.value) {
    actualDate = element.dataset.date + "-01";
    dateLabel = new Date(element.dataset.date + "-01")
      .toDateString()
      .split(" 01 ")
      .join(" ")
      .slice(4);
  } else if (isWeekElement) {
    actualDate = element.parentElement.dataset.date;

    dateLabel = element.firstElementChild.getAttribute("aria-label");
  } else {
    actualDate = element.parentElement.dataset.date;
    dateLabel = element.querySelector("a").getAttribute("aria-label");
  }
  emits("sendDate", { actualDate, dateLabel });
}

function getTimeSelectionEvents(timeIdString, dateString) {
  return props.userGoals.reduce((idx, goal) => {
    if (goal.type === timeIdString && goal.compDate === dateString) idx++;
    return idx;
  }, 0);
}

const isYearView = computed(() => currentView.value === "multiMonthYear");
const globalSlotEvents = ref(0);
watch(globalSlotEvents, () =>
  globalSlotEvents.value > 9
    ? emits("maxItemsReached", true)
    : emits("maxItemsReached", false)
);

function setMonthGoals(calendarView) {
  let firstValidYear;

  if (today.value.getMonth() < 11) {
    firstValidYear = +today.value.getFullYear();
  } else {
    firstValidYear + today.value.getFullYear() + 1;
  }

  let timeSlots = calendarView.el.childNodes;

  timeSlots.forEach((slot) => {
    const slotInternalDate = slot.dataset.date;
    const firstOfMonth = slotInternalDate + "-01";

    const perMonthEvents = getTimeSelectionEvents("month", firstOfMonth);
    let eventsIndex = "";

    if (perMonthEvents) eventsIndex = "+" + perMonthEvents;

    slot.insertAdjacentHTML(
      "beforeend",
      ` <a class='slot-events-index'>${eventsIndex}</a>`
    );

    const slotMonth = +slotInternalDate.slice(5, 8);
    let isValidMonth = false;

    if (slotMonth > +today.value.getMonth() + 1) isValidMonth = true;

    if (isValidMonth) {
      slot.setAttribute("is-valid", true);
    } else {
      slot.setAttribute("disabled", true);
    }
  });
}

const isWeekView = computed(() => currentView.value === "dayGridMonth");

function setWeekGoals(weekView) {
  let weekSlots = weekView.el.getElementsByTagName("tbody")[1].childNodes;

  weekSlots.forEach((slot) => {
    const slotElement = slot.firstElementChild;

    const firstOfWeek = slotElement.dataset.date;

    const perWeekEvents = getTimeSelectionEvents("week", firstOfWeek);

    let eventsIndex = "";
    if (perWeekEvents) eventsIndex = "+" + perWeekEvents;

    slotElement.firstElementChild.insertAdjacentHTML(
      "beforeend",
      ` <a class='slot-events-index'>${eventsIndex}</a>`
    );
  });
}

function setDayGoals(dayView) {
  let dayslots =
    dayView.el.getElementsByTagName("tbody")[1].firstElementChild.childNodes;

  dayslots.forEach((slot) => {
    const slotDate = slot.dataset.date;
    let perDayEvents;

    if (slotDate) {
      perDayEvents = getTimeSelectionEvents("day", slotDate);
    }
    let eventsIndex = "";
    if (perDayEvents) eventsIndex = "+" + perDayEvents;

    const hasEventIndex =
      slot.firstElementChild.lastElementChild.classList.contains(
        "slot-events-index"
      );

    if (hasEventIndex) slot.firstElementChild.lastElementChild.remove();

    slot.firstElementChild.insertAdjacentHTML(
      "beforeend",
      ` <a class='slot-events-index'>${eventsIndex}</a>`
    );
  });
}
</script>

<style lang="scss" scoped>
* {
  text-decoration: none;
}

$active-dark: rgb(4, 167, 172);
$active-bright: rgb(1, 217, 229);

:deep(.is-hidden) {
  display: none;
}
:deep(.fc-dayGridMonth-view .fc-daygrid-day-top),
:deep(.fc-toolbar-chunk:nth-child(3)) {
  display: none;
}

:deep(.fc) {
  display: flex;
  height: 100%;
  width: 100%;
  padding: 1rem;
  font-family: "Poppins", sans-serif;

  font-variant-numeric: tabular-nums;
  font-optical-sizing: auto;

  border-radius: 30px;
  border: solid 2px rgba(128, 128, 128, 0.308);
  border-bottom: solid 3px rgba(128, 128, 128, 0.308);
}

:deep(.fc .fc-toolbar.fc-header-toolbar) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: max-content;
  margin-bottom: 0;
  padding: 1rem 0rem;
  border: none;
}
:deep(.fc .fc-toolbar-title) {
  padding: 1rem;
  font-size: 6rem;
  text-align: center;
  line-height: 6rem;
}

:deep(.fc-toolbar-chunk) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.fc-toolbar-chunk:first-child) {
  margin-bottom: 1rem;
}

:deep(.fc-multiMonthYear-view) {
  justify-content: center;
  align-items: center;
  flex-basis: 200px;
  align-self: center;
  height: max-content;
  padding: 1rem;
  border: none;
}

:deep(td[role="gridcell"]) {
  overflow: visible;
}

:deep(.fc-dayGridMonth-view tbody[role="presentation"]),
:deep(.fc-dayGridDay-view tbody[role="presentation"]) {
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: center;
  width: 100%;
  height: 100%;
  padding: 1rem 0rem;
}

:deep(.fc-scrollgrid-sync-table) {
  table-layout: fixed;
}

:deep(.fc-dayGridMonth-view tbody[role="presentation"] tr[role="row"]),
:deep(.fc-dayGridDay-view tbody[role="presentation"] tr[role="row"]) {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}
:deep(.fc-dayGridDay-view tbody[role="presentation"] tr[role="row"]) {
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  flex-direction: row;
  flex-basis: 90%;
  max-height: max-content;
}

:deep(.fc-dayGridMonth-view tbody[role="presentation"] tr[role="row"]) {
  display: contents;
}
:deep(.fc-dayGridMonth-view tbody[role="presentation"] td) {
  flex: 1 1 calc((100vw) / 5);
  max-width: calc((100vw) / 5);
  aspect-ratio: 1;
  padding: 0rem 0.2rem;
}

:deep(.fc-dayGridDay-view tbody[role="presentation"] td) {
  flex: 1 1 calc((100vw) / 10);
  max-width: calc((100vw) / 5);
  aspect-ratio: 1;
  padding: 0rem 0.2rem;
}

:deep(.fc-daygrid-day) {
  transition: transform 0.3s ease-out;
}

:deep(.fc-daygrid-day-frame) {
  width: 100%;
  aspect-ratio: 1;
  font-weight: bolder;
  color: #2c3e50;
  box-shadow: 0.2rem 0.5rem 0.5rem grey;
  border-radius: 30px;
  border: solid;
}

:deep(.fc-multiMonthYear-view .fc-daygrid-day-frame) {
  display: none;
  border: none;
}

:deep(.fc-dayGridMonth-view .fc-daygrid-day-frame) {
  border-color: var(--theme-week);
}
:deep(.fc-dayGridDay-view .fc-daygrid-day .fc-daygrid-day-frame) {
  border-color: var(--theme-day);
}

:deep(.fc-daygrid-week-number) {
  width: 100%;
  padding-top: 1rem;
  font-size: 2.5rem;
  text-align: center;
  color: inherit;
  background: none;
}

:deep(td.fc-day.fc-daygrid-day.fc-day-disabled) {
  display: none;
  overflow: visible;
  background: transparent;
}

:deep(.fc-daygrid-day-top a) {
  width: 100%;
  padding-top: 1rem;
  font-size: 2.6rem;
  text-align: center;
  color: inherit;
}

:deep(.fc-daygrid-day:hover) {
  transform: translateY(-5px);
}

:deep(.fc .fc-button-primary) {
  padding: 0.5rem 1.5rem;
  font-family: "Roboto", sans-serif;
  font-size: 2rem;
  line-height: 3rem;
  color: inherit;
  border: none;
  background: none;
  border: solid 1px rgb(218, 218, 218);
  border-bottom: solid 2px rgb(218, 218, 218);
  border-radius: 30px;

  &:hover {
    z-index: 0;
    color: var(--hover-default);
  }
}

:deep(.fc .fc-button-primary:focus),
:deep(.fc .fc-button-primary:not(:disabled):focus) {
  box-shadow: none;
  border: solid 1px $active-bright;
  border-bottom: solid 2px $active-bright;
}

:deep(.fc .fc-button-primary:active),
:deep(.fc .fc-button-primary:not(:disabled).fc-button-active) {
  z-index: 1;
  color: $active-dark;
  background: none;
  border: solid 1px $active-bright;
  border-bottom: solid 2px $active-bright;
}

:deep(.fc .fc-add-button) {
  width: max-content;
  margin: 0rem 0.5rem;
  padding: 0.5rem 1.5rem;
  font-family: "Roboto ", sans-serif;
  font-size: 2rem;
  font-weight: 500;
  border-radius: 30px;
  background: none;
  color: $active-dark;
}

:deep(.fc .fc-add-button:hover) {
  color: orange;
}

:deep(.fc-scrollgrid),
:deep(.fc-col-header-cell),
:deep(.fc-daygrid-day),
:deep(.fc-scroller-liquid-absolute),
:deep(td) {
  border: none;
}

:deep(.fc-day-today),
:deep(.fc-multiMonthYear-view .fc-multimonth-daygrid-table),
:deep(thead),
:deep(.fc-daygrid-day-events),
:deep(.fc-daygrid-event-harness),
:deep(.fc-event-title-container),
:deep(.fc-event-title),
:deep(.fc-event-title-container::after) {
  display: none;
}

:deep(.fc-multimonth-header) {
  display: contents;
  position: absolute;
  top: 0;
  padding: 0;
  z-index: -1000;
}

:deep(.fc-multimonth-title) {
  align-self: center;
  width: 100%;
  padding: 0;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
}

:deep(.fc-multimonth-month) {
  justify-content: center;
  position: relative;
  width: 13vw;
  max-width: 13vw;
  height: 13vw;
  padding-top: 1rem;
  margin: 0.3rem;

  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;

  border-radius: 1em;
  border: solid var(--theme-month) 3px;
  background: transparent;
  box-shadow: 0.2rem 0.5rem 0.5rem grey;
  transition: transform 0.3s ease;
}

:deep(.fc-multimonth-month:hover) {
  transform: translateY(-3px);
}

:deep(.fc-multimonth-month:not([is-valid])) {
  display: none;
}

:deep(.slot-events-index) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  font-family: "Poppins ExtraBold", sans-serif;
  font-size: calc(2rem + 0.5vw);
  font-weight: 600;
  color: rgb(0, 149, 255);
  cursor: pointer;
}

:deep(.slot-events-index:hover) {
  color: orange;
}
:deep(.fc-highlight),
:deep(.fc-daygrid-day-top) {
  z-index: -100;
}

:deep(.fc-multimonth-month[is-selected="true"]),
:deep(.fc-daygrid-day-frame[is-selected="true"]) {
  background-color: var(--fc-highlight-color);
}

@media screen and (max-width: 500px) {
  :deep(.fc-view-harness.fc-view-harness-active) {
    overflow-y: auto;
    scrollbar-gutter: stable both-edges;
    scrollbar-color: rgba(98, 37, 253, 0) rgba(3, 3, 255, 0);
  }

  :deep(.fc-multiMonthYear-view) {
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;
    width: 100%;
    min-height: max-content;
  }
  :deep(.fc-multimonth-month) {
    min-width: 40vw;
    min-height: 15rem;
    min-height: 40vw;
    aspect-ratio: 1;

    margin: 2px 0px;
    margin-bottom: 0.5rem;
    border-radius: 30px;
  }
  :deep(.fc-multimonth-month:not([is-valid])) {
    display: none;
  }

  :deep(.fc-scroller.fc-scroller-liquid-absolute) {
    height: 100%;
    scrollbar-gutter: stable both-edges;
    scrollbar-color: rgba(98, 37, 253, 0) rgba(3, 3, 255, 0);
  }
  :deep(.fc-daygrid-body.fc-daygrid-body-balanced),
  :deep(.fc-daygrid-body.fc-daygrid-body-unbalanced) {
    justify-items: center;
    width: 100% !important;
    text-align: center;
  }

  :deep(.fc-scrollgrid-sync-table) {
    table-layout: auto;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    scrollbar-gutter: stable both-edges;
  }

  :deep(.fc-dayGridMonth-view tbody[role="presentation"]),
  :deep(.fc-dayGridDay-view tbody[role="presentation"]) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: max-content;
    height: 100%;
    padding: 0rem;
    overflow: visible;
  }

  :deep(.fc-dayGridMonth-view tbody[role="presentation"] tr[role="row"]),
  :deep(.fc-dayGridDay-view tbody[role="presentation"] tr[role="row"]) {
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0rem;
    padding: 0;
    overflow: visible;
  }

  :deep(
      .fc-dayGridMonth-view
        tbody[role="presentation"]
        tr[role="row"]:has(.fc-day-disabled)
    ) {
    display: none;
  }

  :deep(.fc-dayGridMonth-view tbody[role="presentation"] td),
  :deep(.fc-dayGridDay-view tbody[role="presentation"] td) {
    min-width: 13%;
    width: 40vw;
    max-width: 40vw;
    aspect-ratio: 1;
  }
  :deep(.fc-dayGridDay-view tbody[role="presentation"] td) {
    margin: 0.5rem 0rem;
  }
}
</style>
