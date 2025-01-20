<template>
  <section id="landing" @scrollend="handleScroll">
    <section id="hero">
      <h2>Life<br />Pal</h2>
      <!-- <h3>Set goals for your future!</h3> -->
      <router-link class="link" to="/userSign">Sign up to start</router-link>
    </section>
    <section id="bio">
      <h3>What's Life Pal?</h3>

      <div class="text-cards-container" @click="handleAnimation">
        <p class="text-card card1">
          It's a interactive web app for setting and managing goals.
        </p>
        <p class="text-card card2">
          It's a demo project built with Vue.js to practice my knowledge of this
          framework and WebDev in general.
        </p>

        <p class="text-card card3">
          Check the slides below for a preview of what you'll find inside!
        </p>
      </div>
    </section>
    <section id="slideshow">
      <transition
        name="carousel"
        mode="out-in"
        class="card-container"
        @click="handleSlides"
      >
        <div class="card" v-if="slideCounter === 1">
          <div class="slide-img slide-1"></div>
          <span>choose a day, a week or a month</span>
        </div>
        <div class="card" v-else-if="slideCounter === 2">
          <div class="slide-img slide-2"></div>
          <span>add a new goal</span>
        </div>
        <div class="card" v-else-if="slideCounter === 3">
          <div class="slide-img slide-3"></div>
          <span>review it on your dashboard</span>
        </div>
        <div class="card" v-else-if="slideCounter === 4">
          <div class="slide-img slide-4"></div>
          <span>or send a request to the developer</span>
        </div>
        <div class="card" v-else-if="slideCounter === 5">
          <div class="slide-img slide-5"></div>
          <span>delete what you don't like</span>
        </div>
        <div class="card" v-else>
          <div class="slide-img slide-6"></div>
          <span>or confirm your success</span>
        </div>
      </transition>
      <div class="btns-container">
        <button
          type="button"
          class="btn"
          :class="{ 'btn-active': slideCounter === 1 }"
        ></button>
        <button
          type="button"
          class="btn"
          :class="{ 'btn-active': slideCounter === 2 }"
        ></button>
        <button
          type="button"
          class="btn"
          :class="{ 'btn-active': slideCounter === 3 }"
        ></button>
        <button
          type="button"
          class="btn"
          :class="{ 'btn-active': slideCounter === 4 }"
        ></button>
        <button
          type="button"
          class="btn"
          :class="{ 'btn-active': slideCounter === 5 }"
        ></button>
        <button
          type="button"
          class="btn"
          :class="{ 'btn-active': slideCounter === 6 }"
        ></button>
      </div>
    </section>
    <button class="scrollto-btn" @mousedown="scrollSections"></button>
  </section>
</template>

<script setup>
import { ref } from "vue";

const slideCounter = ref(1);

function handleSlides() {
  slideCounter.value++;
  if (slideCounter.value > 6) slideCounter.value = 1;
}

const positions = [
  { inset: "15% 0 0 20%", zIndex: 1 }, //pink third
  { inset: "20% 0 0 25%", zIndex: 2 }, //yel sec
  { inset: "25% 0 0 30%", zIndex: 3 }, //blu first
];
let counter = 0;

function handleAnimation(e) {
  const validTarget = e.target.classList.contains("text-card");
  if (!validTarget) return;
  const firstCard = document.querySelector(".card1");
  const secondCard = document.querySelector(".card2");
  const thirdCard = document.querySelector(".card3");

  const cards = [thirdCard, secondCard, firstCard];

  counter = (counter + 1) % 3;

  cards.forEach((card, idx) => {
    const newIndex = (idx + counter) % 3;
    card.classList.remove("front-anim");

    if (idx + counter === 0 && card === thirdCard) {
      card.classList.add("front-anim");
    }

    if (idx + counter > 2) {
      card.classList.add("front-anim");
      card.style.inset = positions[newIndex].inset;
      card.style.zIndex = positions[newIndex].zIndex;
    } else {
      card.style.inset = positions[counter + idx].inset;
      card.style.zIndex = positions[counter + idx].zIndex;
    }
  });
}

let btnCounter = 0;
function scrollSections(e) {
  const sectionHero = document.querySelector("#hero");
  const sectionBio = document.querySelector("#bio");
  const sectionSlides = document.querySelector("#slideshow");
  const target = e.target;
  btnCounter++;
  console.log(btnCounter);

  if (btnCounter > 2) btnCounter = 0;
  if (btnCounter === 0) {
    target.classList.remove("rotated");
    sectionHero.scrollIntoView({ behavior: "smooth" });
  }
  if (btnCounter === 1) {
    sectionBio.scrollIntoView({ behavior: "smooth" });
  }
  if (btnCounter === 2) {
    target.classList.add("rotated");
    sectionSlides.scrollIntoView({ behavior: "smooth" });
  }
}

function handleScroll(e) {
  const target = e.target;
  const scrollOffset = target.scrollTop;
  const viewportHeight = target.clientHeight;

  if (scrollOffset > viewportHeight * 1.5) {
    btnCounter = 2;
    target.querySelector(".scrollto-btn").classList.add("rotated");
  }

  if (scrollOffset === 0) {
    btnCounter = 0;

    target.querySelector(".scrollto-btn").classList.remove("rotated");
  }
  // console.log(scrollOffset, viewportHeight);
}
</script>

<style scoped>
#landing {
  position: relative;
  overflow: auto;
  scrollbar-gutter: stable both-edges;
  scrollbar-width: thin;
  scrollbar-color: rgba(98, 37, 253, 0) rgba(3, 3, 255, 0);
  height: 100vh;
  background: linear-gradient(70deg, #d9eef81b 20%, #e7dfffdb 100%);
}

#hero {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: visible;
  z-index: 1;
}

h2 {
  font-size: 20rem;
  line-height: 100%;
  text-align: center;
  white-space: break-spaces;
  margin-bottom: 1rem;
}
#hero h3 {
  display: none;
  font-size: 6rem;
  color: #0080ff;
  margin: 5rem 10rem;
  filter: drop-shadow(0rem 0.2rem 0.9rem rgba(0, 0, 0, 0.464));
}
.link {
  position: absolute;
  bottom: 10%;
  font-size: 5rem;
  color: var(--item-goal-day);
  color: white;
  font-weight: 600;
  text-decoration: none;
  filter: drop-shadow(-0rem -0.4rem 0.6rem rgb(162, 162, 162));
  transition: all 0.2s ease;
}

a:hover {
  filter: drop-shadow(0rem -0.1rem 0.2rem rgb(162, 162, 162));

  cursor: pointer;
}

#slideshow {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 0rem;
}
.card-container {
  width: 100%;
  height: max-content;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: visible;
}
.card {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin: 0rem 1rem;
  min-width: 90%;
}

.card .slide-img {
  width: 45rem;
  height: 45rem;
  background-size: cover;
  background-position: center;
  border-radius: 40px;
  padding: 1rem;
  box-shadow: 0.3rem 0.8rem 0.8rem rgba(128, 128, 128, 0.478);
  cursor: pointer;

  transition: all 0.5s ease;
}

.card .slide-img:hover {
  transform: translateY(-5px);
}

.card span {
  font-size: 2.5rem;
  margin-top: 2rem;
  font-weight: 500;
  color: inherit;
  text-shadow: 0rem 0.2rem 0.5rem rgb(191, 191, 191);
}

.slide-1 {
  background-image: url("/src/assets/lifepal-slide-1.png");
}
.slide-2 {
  background-image: url("/src/assets/lifepal-slide-2.png");
}
.slide-3 {
  background-image: url("/src/assets/lifepal-slide-3.png");
}
.slide-4 {
  background-image: url("/src/assets/lifepal-slide-4.png");
}
.slide-5 {
  background-image: url("/src/assets/lifepal-slide-5.png");
}
.slide-6 {
  background-image: url("/src/assets/lifepal-slide-6.png");
}

.btns-container {
  position: relative;
  text-align: center;
  overflow: visible;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 10%;
  margin-top: 2rem;
  height: 1.5rem;
}

.btn {
  border: solid 1px rgb(206, 156, 103);
  border: none;
  width: 1.1rem;
  aspect-ratio: 1;
  margin: 0px 2px;
  border-radius: 50px;

  background: rgba(255, 255, 255, 0.389);
  box-shadow: 0rem 0.1rem 0.3rem grey;
}
.btn-active {
  background: rgb(206, 156, 103);
  transition: all 0.3s ease;
}

.carousel-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.carousel-enter-active {
  transition: all 0.3s ease-out;
}
.carousel-leave-active {
  transition: all 0.3s ease-out;
}

.carousel-enter-to,
.carousel-leave-from {
  opacity: 1;
  transform: translateX(0px);
}

.carousel-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

#bio {
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  overflow: visible;
}

#bio h3 {
  align-self: center;
  font-size: 6rem;
  text-align: center;
}

.text-cards-container {
  /* padding: 1rem; */
  height: 70vh;
  position: relative;
  overflow: visible;
}
#bio p {
  padding: 0rem 2rem;
  margin: 0.5rem 0rem;
  height: 50%;
  width: 50%;
  font-size: 2.2rem;
  border-radius: 40px;
  box-shadow: 0.2rem 0.5rem 0.8rem rgb(169, 169, 169);

  text-justify: auto;
  text-overflow: ellipsis;
  text-align: center;
  font-weight: 500;
  align-content: center;

  /* display: flex;
  justify-content: center;
  align-items: center; */
  background: rgb(255, 255, 255);
  background: rgba(235, 227, 255, 0.037);
  backdrop-filter: blur(100px);

  color: inherit;
  cursor: pointer;
  position: absolute;
  overflow: visible;
  transition: all 0.5s ease;
}

#bio p.card1 {
  inset: 25% 0 0 30%;
  z-index: 3;
  background: rgb(255, 254, 253);
}

#bio p.card2 {
  inset: 20% 0 0 25%;
  z-index: 2;
  background: rgb(255, 251, 244);
}

#bio p.card3 {
  inset: 15% 0 0 20%;
  z-index: 1;
  background: rgb(255, 249, 239);

  /* background: rgb(255, 255, 254); */
}

#bio p.front-anim {
  animation: shuffle-front 0.6s forwards;
}

.scrollto-btn {
  position: fixed;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 3rem;
  aspect-ratio: 1;
  border-radius: 100%;
  border: none;
  background: url("/src/assets/down-arrow.png");
  background-size: cover;

  background-position: center;
  cursor: pointer;
  z-index: 5;
  transition: all 0.3s ease;
}

.scrollto-btn.rotated {
  transform: rotate(180deg) translateX(50%);
}

@keyframes shuffle-front {
  0%,
  100% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(100px, 100px);
  }
}

/* #bio p:before {
  content: "";
  width: 5px;
  height: 2px;
  aspect-ratio: 1;
  border-radius: 50%;
  border-top-left-radius: 100%;
  border-bottom-left-radius: 100%;

  color: rgba(255, 255, 255, 0.519);
  background: rgba(255, 255, 255, 0.512);
  box-shadow: -0.5rem 0rem 0.5rem 0.3rem, -0.8rem 0rem 0.5rem 0.2rem;
  position: absolute;

  offset-path: xywh(0px 0px 100% 100% round 20px 20px);
  offset-distance: 0%;
  offset-rotate: auto;
  transform: translateZ(2px);

  animation: firefly 10s infinite linear;
} */
@keyframes firefly {
  0% {
    offset-distance: 0%;
  }

  100% {
    offset-distance: 100%;
  }
}
</style>
