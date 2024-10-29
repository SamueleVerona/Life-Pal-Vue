<template>
  <nav>
    <ul>
      <li v-for="division in timeDivisons" :key="division">
        <base-button :text-content="division"> </base-button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const timeDivisons = ["Days", "Weeks", "Months", "Years", "Decades"];
</script>

<style scoped>
nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0;
  margin-left: 2rem;
  width: 30rem;
  height: 80vh;
  text-align: center;

  background: linear-gradient(90deg, #89f7fe 0%, #66a6ff 100%);
  border-radius: 30px;

  box-shadow: 1rem 1rem 0.5rem rgba(128, 128, 128, 0.308);
}

ul {
  list-style: none;
  background: transparent;
}

button {
  width: 18rem;
  height: 8rem;
  border-radius: 10px;
  border: none;
  margin: 0.6rem 0;

  font-size: 3rem;
  background: linear-gradient(90deg, #ffeb3b 0%, #f0f3bd 100%);
}
</style>
