<template>
  <section id="content">
    <calendar-nav
      class="nav"
      :timeDivs="timeDivsArr"
      @sendText="passText"
    ></calendar-nav>
    <full-calendar :options="calendarOptions"></full-calendar>
    <goals-list
      class="goals"
      :goalType="timeDivId"
      :userData="userData"
      :insertNewGoal="trigger"
    >
    </goals-list>
  </section>
</template>

<script setup>
import { defineComponent, ref, computed } from "vue";
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

const store = useStore();
const timeDivId = ref("type");

function passText(gottenText) {
  timeDivId.value = gottenText;
}
const userData = computed(() => store.getters.userGoals);
// watch(userData, () => {
//   if (
//     userData.value.filter((goal) => goal.type === timeDivId.value).length === 0
//   )
//     timeDivId.value = "type";
// });
// watch(userData, () => (timeDivId.value = "type"));
const timeDivsArr = computed(
  () => new Set(userData.value.map((goal) => goal.type))
);

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin],
  dateClick: handleDateClick,
  editable: true,
  selectable: true,
  dayMaxEvents: true,
  weekends: true,
  headerToolbar: {
    left: "title",
    center: "today multiMonthYear,dayGridMonth,dayGridWeek prev,next",
    right: "",
  },
});

const trigger = ref();

function handleDateClick(arg) {
  trigger.value = arg.dateStr;
}

// {
// id: 'a',
//       title: 'my event',
//       start: '2018-09-01'
//     }
</script>

<style scoped>
#content {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 90vh;
}

:deep(.fc) {
  margin: auto 1rem;
  padding: 1rem;
  font-size: 5rem;
  font-family: "Roboto", sans-serif;
  flex: 1;
  height: 100%;
}
:deep(.fc-header-toolbar) {
  /* border: solid; */
  height: 40%;
  display: flex;
  flex-direction: column;
}

:deep(.fc-toolbar-chunk) {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  font-size: 2rem;
}
:deep(.fc-toolbar-chunk:first-child) {
  font-size: 2rem;
}

:deep(.fc-toolbar-chunk:nth-child(3)) {
  display: none;
}
:deep(table) {
  font-size: 25rem;
}
:deep(thead) {
  border: none;
  font-size: 25rem;
}
:deep(.fc-scrollgrid-sync-inner) {
  font-weight: bolder;
  border: solid black;
  border-radius: 10px;
}
:deep(.fc-daygrid-day-frame) {
  font-weight: bolder;
  color: rgb(0, 234, 255);
  border: solid black 1px;
  border-radius: 12px;
}

/* h2,
p {
  font-size: 3rem;
  padding: 1rem;
} */
</style>
