<template>
  <router-link to="/home"></router-link>
  <the-header></the-header>
  <section>
    <!-- <base-dialog>
      <template v-slot:title>
        <h2>This is a dialog</h2>
      </template>

      <template v-slot:description>
        <p>This is the dialog description</p>
      </template>
      </base-dialog > -->
    <!-- <base-card>
      <template v-slot:title> <h2>Gigi</h2></template>
      <template v-slot:description>
        <p>Questa è la descrizioine di gigi</p></template
      >
    </base-card> -->
    <calendar-nav class="nav"></calendar-nav>
    <goals-list class="goals"></goals-list>
  </section>
</template>

<script setup>
import { defineComponent } from "vue";
import TheHeader from "../UI/TheHeader.vue";
import CalendarNav from "../navigation/CalendarNav.vue";
import GoalsList from "../navigation/GoalsList.vue";
// import BaseCard from "../../components/base/BaseCard.vue";

// defineComponent(BaseCard);
defineComponent(TheHeader);
defineComponent(CalendarNav);
defineComponent(GoalsList);
</script>

<style scoped>
section {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  /* align-items: center; */
  width: 100vw;
  height: 90vh;
}

h2,
p {
  font-size: 3rem;
  padding: 1rem;
}

.goals {
  height: 80vh;
  width: 40rem;
  margin: auto;
}
</style>
