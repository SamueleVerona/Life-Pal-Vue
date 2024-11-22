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
import { defineComponent, ref, computed, watch } from "vue";
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
  console.log(parsed);
  events.value = parsed;
}

watch(userData, () => parseData(userData.value));

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin],
  headerToolbar: {
    left: "title",
    center: "today multiMonthYear,dayGridMonth,dayGridWeek prev,next",
    right: "",
  },
  initialView: "dayGridWeek",
  editable: true,
  selectable: true,
  dayMaxEvents: true,
  weekends: true,
  showNonCurrentDates: false,
  fixedWeekCount: true,
  duration: { weeks: 1 },
  events,
  eventSources: true,
  datesSet: datesSelection,
  dateClick: handleDateClick,
});

const trigger = ref();

function datesSelection(info) {
  console.log(info);
  if (info.view.type.startsWith("day"))
    timeDivId.value = info.view.type.slice(7).toLowerCase();
  else {
    timeDivId.value = info.view.type.slice(-4).toLowerCase();
  }
  // console.log(info.view.type.slice(7).toLowerCase());
}

function handleDateClick(arg) {
  trigger.value = arg.dateStr;
}
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

:deep(.fc-toolbar-chunk:first-child) {
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
}
:deep(.fc-event-title-container) {
  font-size: 10rem;
}
</style>
