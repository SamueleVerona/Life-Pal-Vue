<template>
  <router-link to="/landing"></router-link>
  <section>
    <h2>Life Pal</h2>
    <h3>Set goals for your future!</h3>
    <router-link :to="'/userSign'">Sign up to start</router-link>
  </section>
</template>

<style scoped>
section {
  width: 100vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h2 {
  font-size: 8rem;
  text-align: center;
}
h3 {
  font-size: 6rem;
  color: #67a9ba;
  text-align: center;
}
a {
  font-size: 4.5rem;
  color: #bc6060;
  padding-top: 3rem;
  font-weight: 600;
  text-decoration: none;
}
a:hover {
  color: #60bcb3;
  cursor: pointer;
}
</style>
