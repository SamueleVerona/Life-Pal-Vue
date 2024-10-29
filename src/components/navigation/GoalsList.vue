<template>
  <section>
    <ul>
      <li v-for="el in data" :key="el.id">
        <h2>{{ el.title }}</h2>
        <hr />
        <h2>{{ el.desc }}</h2>
        <div class="comp-type"></div>
      </li>
    </ul>
  </section>
</template>

<script setup>
// import { ref } from "vue";

const data = [
  { id: "g1", title: "Titolo", desc: "descrizione" },
  { id: "g2", title: "Altro", desc: "altra desc" },
];
</script>

<style scoped>
section {
  background: linear-gradient(90deg, #ff758c 0%, #ff7eb3 100%);
  border-radius: 30px;
  padding-top: 4rem;
  box-shadow: 1rem 1rem 0.5rem rgba(128, 128, 128, 0.308);
}
li {
  display: flex;
  justify-content: space-between;
  /* border: solid; */
  border-radius: 10px;
  background: white;
  margin: 1rem 0;
}

h2 {
  font-size: 2.5rem;
  padding: 0.5rem 0.5rem;
}

.comp-type {
  width: 3rem;
  background: rgb(47, 255, 137);
}
</style>
