<template>
  <section>
    <div class="bkg"></div>
    <router-link to="/landing"></router-link>
    <h2>Life Pal</h2>
    <h3>Set goals for your future!</h3>
    <router-link class="link" :to="'/userSign'">Sign up to start</router-link>
  </section>
</template>

<style scoped>
section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* justify-content: center;
  align-items: center; */
  position: relative;
  overflow: visible;

  z-index: 1;
}

.bkg {
  position: absolute;
  bottom: -20rem;
  right: -15rem;
  min-width: 70%;
  max-width: 50vw;
  aspect-ratio: 1;
  /* clip-path: circle(50%); */

  border-radius: 100%;
  background: linear-gradient(to bottom right, #ff6a6a86, #6de5f7c6);
  background-size: 500% 500%;
  /* filter: drop-shadow(0rem 0.5rem 0.5rem rgb(0, 0, 0, 0.5)); */
  animation: bkg-animation 10s ease-in-out infinite forwards;
  overflow: visible;
  z-index: -1;
}

h2 {
  font-size: 12rem;
  text-align: center;
  align-self: flex-start;
  margin-top: 5rem;
  margin-left: 5rem;
}
h3 {
  font-size: 6rem;
  color: #0080ff;
  margin: 5rem 10rem;
  filter: drop-shadow(0rem 0.2rem 0.1rem rgba(0, 0, 0, 0.464));
}
.link {
  font-size: 5rem;
  color: #bc6060;
  font-weight: 600;
  text-decoration: none;
  align-self: flex-end;
  margin-top: 5rem;

  margin-right: 15rem;
}
a:hover {
  color: rgb(255, 75, 75);
  cursor: pointer;
}

@keyframes bkg-animation {
  0% {
    background-position: 0% 50%;
    rotate: 0deg;
  }
  20% {
    background-position: 10% 60%;
  }

  50% {
    background-position: 50% 100%;
    rotate: 180deg;
  }
  80% {
    background-position: 25% 60%;
  }
  100% {
    background-position: 0%50%;
    rotate: 360deg;
  }
}
</style>
