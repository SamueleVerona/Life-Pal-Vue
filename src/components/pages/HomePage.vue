<template>
  <section id="content">
    <calendar-nav
      class="nav"
      :timeDivs="timeDivisions"
      @gotten-text="passText"
    ></calendar-nav>
    <goals-list
      class="goals"
      :timeDivId="timeDivId"
      :activeUser="userId"
    ></goals-list>
  </section>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import CalendarNav from "../navigation/CalendarNav.vue";
import GoalsList from "../navigation/GoalsList.vue";
defineComponent(CalendarNav);
defineComponent(GoalsList);

const store = useStore();

const timeDivisions = store.getters.timeDivisions;
const timeDivId = ref("");
function passText(gottenText) {
  timeDivId.value = gottenText;
}

const route = useRoute();

const userId = route.params.userId;
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
