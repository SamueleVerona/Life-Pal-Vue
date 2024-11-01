<template>
  <!-- <router-view></router-view> -->
  <router-link></router-link>
  <section id="content">
    <calendar-nav
      class="nav"
      :timeDivs="timeDivisions"
      @gotten-text="passText"
    ></calendar-nav>
    <goals-list class="goals" :timeDivId="timeDivId"></goals-list>
  </section>
</template>

<script setup>
import { defineComponent, ref, provide } from "vue";
import { useStore } from "vuex";

import CalendarNav from "../navigation/CalendarNav.vue";
import GoalsList from "../navigation/GoalsList.vue";

defineComponent(CalendarNav);
defineComponent(GoalsList);
const store = useStore();

const timeDivisions = store.getters.timeDivisions;
const timeDivId = ref("");
provide("time-div-id", timeDivId);

function passText(gottenText) {
  timeDivId.value = gottenText;
}
</script>

<style scoped>
#content {
  display: flex;
  flex-direction: row;

  width: 100vw;
  height: 90vh;
}

h2,
p {
  font-size: 3rem;
  padding: 1rem;
}
</style>
