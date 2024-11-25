<template>
  <section id="content">
    <calendar-nav
      id="nav"
      :timeDivs="timeDivsArr"
      @sendText="passText"
    ></calendar-nav>
    <full-calendar :options="calendarOptions"></full-calendar>
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
import { defineComponent, ref, computed, watch, onBeforeUpdate } from "vue";
import { useStore } from "vuex";
import CalendarNav from "../navigation/CalendarNav.vue";
import GoalsList from "../navigation/GoalsList.vue";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
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

const events = ref();

function parseData(goals) {
  const parsed = goals.map(
    (goal) =>
      (goal = {
        id: goal.id,
        title: goal.title,
        start: new Date(goal.compDate).toISOString().slice(0, 10),
      })
  );
  // console.log(parsed);
  events.value = parsed;
}

watch(userData, () => parseData(userData.value));

const tomorrow = ref(Date.now() + 86400000);
const nextWeekDay = ref(Date.now() + 86400000 * 7);
// const endOfMonth = ref(Date.now() + 86400000 * 24);

function getThisSunday() {
  let counter = 0;
  let today = new Date().getDay();

  while (today != 7) {
    if (today < 7) {
      counter++;
      today++;
    }
    if (today > 7) {
      counter--;
      today--;
    }
  }
  return new Date(Date.now() + 86400000 * counter);
}

// console.log(getThisSunday());

const decadeViewElements = computed(() =>
  document.querySelectorAll(".fc-multimonth-month")
);

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin],
  views: {
    multiMonthYear: {
      type: "list",
      buttonText: "month",
      dayHeaders: false,
      weekends: false,
    },
    dayGridMonth: {
      type: "dayGrid",
      buttonText: "week",
      validRange: {
        start: new Date(nextWeekDay.value).toISOString(),
      },
      weekNumbers: true,
      dayCellContent: () => "",
      hiddenDays: [0, 2, 3, 4, 5, 6],
      dayHeaders: false,
    },
    dayGridWeek: {
      type: "dayGrid",
      buttonText: "day",
      validRange: {
        start: new Date(tomorrow.value).toISOString(),
        end: getThisSunday(),
      },
      visibleRange: {
        start: new Date().toISOString(),
        end: getThisSunday(),
      },
      duration: { weeks: 2 },
    },
  },
  headerToolbar: {
    left: "title",
    center: "today multiMonthYear,dayGridMonth,dayGridWeek prev,next",
    right: "",
  },

  initialView: "multiMonthYear",
  multiMonthMaxColumns: 3,
  editable: true,
  selectable: true,
  dayMaxEvents: true,
  weekends: true,
  showNonCurrentDates: false,
  fixedWeekCount: false,

  events,
  eventSources: true,
  datesSet: datesSelection,
  dateClick: handleDateClick,
});

const trigger = ref();

const currentView = ref();

function datesSelection(info) {
  console.log(info);
  currentView.value = info.view.type;
  if (info.view.type.startsWith("day"))
    timeDivId.value = info.view.type.slice(7).toLowerCase();
  else {
    timeDivId.value = info.view.type.slice(-4).toLowerCase();
  }
}

function handleDateClick(arg) {
  trigger.value = arg.dateStr;
}

onBeforeUpdate(() => {
  if (currentView.value === "multiMonthYear") {
    decadeViewElements.value[0].insertAdjacentHTML(
      "beforebegin",
      '<div class="fc-multimonth-month" id="yearly" role="grid" style="width: 100%"><div class="fc-multimonth-title">Yearly Goals</div></div>'
    );
  }
});
</script>

<style scoped>
:root {
  --fc-small-font-size: 1rem;
}

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
}

:deep(.fc .fc-toolbar.fc-header-toolbar) {
  margin-bottom: 1rem;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

:deep(.fc-toolbar-chunk) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.fc-toolbar-chunk:first-child),
:deep(.fc-multimonth-title) {
  font-size: 3rem;
}

:deep(.fc-button) {
  font-size: 1.8rem;
  line-height: 3rem;
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

:deep(.fc-scrollgrid-sync-inner) {
  font-weight: bolder;
  border: solid rgb(144, 207, 218) 1px;
  border-radius: 10px;
}
:deep(.fc-daygrid-day-frame) {
  font-weight: bolder;
  color: rgb(0, 234, 255);
  border: solid black 1px;
  border-radius: 12px;
  height: 5rem;
  /* color:rgb(255, 220, 40) */
}
:deep(.fc-event-title-container) {
  font-size: 10rem;
}

:deep(.fc-multimonth-month) {
  border: solid;
  border-radius: 10px;
  cursor: pointer;
}

:deep(.fc-multimonth-daygrid-table),
:deep(thead) {
  display: none;
}

:deep(.fc-multimonth-month:first-child::after) {
  background: red;
}
:deep(.fc-daygrid-day.fc-day-today) {
  background: rgba(247, 82, 82, 0.537);
  border-radius: 10px;
  /* color: aqua; */
}

:deep(#yearly) {
  border: rgb(90, 211, 255) 3px solid;
  border-radius: 10px;
  color: rgb(255, 128, 0);
}
:deep(.fc-daygrid-week-number) {
  background: none;
  /* border: red; */
}
</style>
