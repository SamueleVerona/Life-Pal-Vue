<template>
  <section id="content">
    <calendar-nav
      class="nav"
      :timeDivs="timeDivsArr"
      @sendText="passText"
    ></calendar-nav>
    <goals-list class="goals" :goalType="timeDivId"> </goals-list>
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
const timeDivId = ref("");

function passText(gottenText) {
  timeDivId.value = gottenText;
}

const route = useRoute();
const userId = route.params.userId;

const userData = ref(store.getters.users.find((user) => user.email === userId));
const timeDivsArr = ref([]);
timeDivsArr.value = new Set(userData.value.goals.map((goal) => goal.type));
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

/* #button-add,
#button-rem {
  position: absolute;
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
  height: 5rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  padding: 0 1rem;
}

#button-add {
  bottom: 1rem;
  right: 1rem;
  height: 5rem;
  background: rgb(248, 151, 255);
}

#button-rem {
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 165, 151, 0.995);
} */
</style>
