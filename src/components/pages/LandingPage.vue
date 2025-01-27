<template>
  <section class="section" @scrollend="handleScroll">
    <section class="section__hero">
      <h2 class="hero__logo">Life<br />Pal</h2>
      <router-link class="hero__link" to="/userSign"
        >Sign up to start</router-link
      >
    </section>
    <section class="section__bio">
      <h3 class="bio__title">What's LifePal?</h3>
      <div class="bio__cards-container" @click="handleAnimation">
        <p class="bio__card bio__card--1">
          It's a interactive web app for setting and managing goals.
        </p>
        <p class="bio__card bio__card--2">
          It's a demo project built with Vue.js to practice my knowledge of this
          framework and WebDev in general.
        </p>
        <p class="bio__card bio__card--3">
          Check the slides below for a preview of what you'll find inside!
        </p>
      </div>
    </section>
    <section class="section__slideshow">
      <transition
        name="slideshow__carousel"
        mode="out-in"
        class="slideshow__card-container"
        @click="handleSlides"
      >
        <div class="slideshow__card" v-if="slideCounter === 1">
          <div class="slideshow__img img--1"></div>
          <span class="slideshow__text">choose a day, a week or a month</span>
        </div>
        <div class="slideshow__card" v-else-if="slideCounter === 2">
          <div class="slideshow__img img--2"></div>
          <span class="slideshow__text">add a new goal</span>
        </div>
        <div class="slideshow__card" v-else-if="slideCounter === 3">
          <div class="slideshow__img img--3"></div>
          <span class="slideshow__text">review it on your dashboard</span>
        </div>
        <div class="slideshow__card" v-else-if="slideCounter === 4">
          <div class="slideshow__img img--4"></div>
          <span class="slideshow__text"
            >or send a request to the developer</span
          >
        </div>
        <div class="slideshow__card" v-else-if="slideCounter === 5">
          <div class="slideshow__img img--5"></div>
          <span class="slideshow__text">delete what you don't like</span>
        </div>
        <div class="slideshow__card" v-else>
          <div class="slideshow__img img--6"></div>
          <span class="slideshow__text">or confirm your success</span>
        </div>
      </transition>
      <div class="slideshow__btns-container">
        <div
          type="button"
          class="btn"
          :class="{ 'btn--active': slideCounter === 1 }"
        ></div>
        <div
          type="button"
          class="btn"
          :class="{ 'btn--active': slideCounter === 2 }"
        ></div>
        <div
          type="button"
          class="btn"
          :class="{ 'btn--active': slideCounter === 3 }"
        ></div>
        <div
          type="button"
          class="btn"
          :class="{ 'btn--active': slideCounter === 4 }"
        ></div>
        <div
          type="button"
          class="btn"
          :class="{ 'btn--active': slideCounter === 5 }"
        ></div>
        <div
          type="button"
          class="btn"
          :class="{ 'btn--active': slideCounter === 6 }"
        ></div>
      </div>
    </section>
    <button class="section__scrollto-btn" @mousedown="scrollSections"></button>
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
  const validTarget = e.target.classList.contains("bio__card");
  if (!validTarget) return;
  const firstCard = document.querySelector(".bio__card--1");
  const secondCard = document.querySelector(".bio__card--2");
  const thirdCard = document.querySelector(".bio__card--3");

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
  const sectionHero = document.querySelector(".section__hero");
  const sectionBio = document.querySelector(".section__bio");
  const sectionSlides = document.querySelector(".section__slideshow");
  const target = e.target;
  btnCounter++;

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
    target.querySelector(".section__scrollto-btn").classList.add("rotated");
  }

  if (scrollOffset === 0) {
    btnCounter = 0;

    target.querySelector(".section__scrollto-btn").classList.remove("rotated");
  }
}
</script>

<style lang="scss" scoped>
* {
  font-family: "Afacad Flux", sans-serif;
}
.section {
  position: relative;
  height: 100vh;
  overflow-y: auto;
  scrollbar-gutter: stable both-edges;
  scrollbar-width: thin;
  scrollbar-color: rgba(98, 37, 253, 0) rgba(3, 3, 255, 0);
  background: var(--theme-bkg);

  .section__hero {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    height: 100vh;
    overflow: visible;

    .hero__logo {
      position: relative;
      margin-bottom: 1rem;
      overflow: visible;
      font-size: 20rem;
      font-family: "Comfortaa", sans-serif;
      line-height: 100%;
      text-align: center;
      white-space: break-spaces;
      opacity: 1;

      background: url("/src/assets/imgs/logo-bkg-full.png");
      background-size: 500%;
      background-position: bottom;
      background-position-y: 25%;
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      background-repeat: no-repeat;
      filter: brightness(95%);
      animation: fade-in-top 2s ease;

      @keyframes fade-in-top {
        0% {
          opacity: 0;
          transform: translateY(-40px);
        }
        100% {
          opacity: 1;
          transform: translateY(0px);
        }
      }

      &:after {
        position: absolute;
        top: 0;
        left: 5%;
        width: 30rem;
        aspect-ratio: 1;

        content: "";
        border-radius: 100%;
        background: rgb(255, 255, 255);
        backdrop-filter: contrast(100%) brightness(85%);
        box-shadow: 0.3rem 0.5rem 0.8rem white;
        offset-path: path("M.4 84.1s127.4 188 267.7 0 247.3 0 247.3 0");
        offset-distance: 0%;
        animation: bubble-out 2s ease forwards reverse;

        @keyframes bubble-out {
          0% {
            offset-distance: 0%;
            transform: scale(3);
            background: rgba(255, 255, 255, 0);
          }
          100% {
            offset-distance: 100%;
            transform: scale(0);
          }
        }
      }
    }
    .hero__link {
      position: absolute;
      bottom: 10%;

      font-size: 5rem;
      font-weight: 600;
      color: white;
      text-decoration: none;
      filter: drop-shadow(-0rem -0.4rem 0.6rem rgb(162, 162, 162));
      cursor: pointer;
      transition: all 0.2s ease;
      animation: slide-in-bottom 2s ease forwards;

      &:hover {
        filter: drop-shadow(0rem -0.1rem 0.2rem rgb(162, 162, 162));
      }

      @keyframes slide-in-bottom {
        0% {
          opacity: 0;
          transform: translateY(30px);
        }
        100% {
          opacity: 1;
          transform: translateY(0px);
        }
      }
    }
  }
  .section__bio {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    min-height: 100vh;
    overflow: visible;

    .bio__title {
      align-self: center;
      font-size: 6rem;
      text-align: center;
    }

    .bio__cards-container {
      position: relative;
      height: 70vh;
      overflow: visible;

      .bio__card {
        position: absolute;
        height: 50%;
        width: 50%;
        padding: 0rem 2rem;
        margin: 0.5rem 0rem;
        overflow: visible;

        align-content: center;
        font-size: 2.2rem;
        font-weight: 500;
        text-align: center;
        color: inherit;

        border-radius: 40px;
        box-shadow: 0.2rem 0.5rem 0.8rem rgb(169, 169, 169);
        background: rgb(255, 255, 255);
        background: rgba(235, 227, 255, 0.037);
        backdrop-filter: blur(100px);

        cursor: pointer;
        transition: all 0.5s ease;

        &.bio__card--1 {
          inset: 25% 0 0 30%;
          z-index: 3;
          background: rgb(255, 254, 253);
        }

        &.bio__card--2 {
          inset: 20% 0 0 25%;
          z-index: 2;
          background: rgb(255, 251, 244);
        }

        &.bio__card--3 {
          inset: 15% 0 0 20%;
          z-index: 1;
          background: rgb(255, 249, 239);
        }

        &.front-anim {
          animation: card-shuffle 0.6s forwards;

          @keyframes card-shuffle {
            0%,
            100% {
              transform: translate(0px, 0px);
            }
            50% {
              transform: translate(100px, 100px);
            }
          }
        }
      }
    }
  }
  .section__slideshow {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100vh;
    padding: 2rem 0rem;

    .slideshow__card-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: max-content;
      height: 100%;
      overflow: visible;
    }
    .slideshow__card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-width: 90%;
      margin: 0rem 1rem;
      text-align: center;

      .slideshow__img {
        width: 45rem;
        height: 45rem;
        padding: 1rem;
        background-size: cover;
        background-position: center;
        border-radius: 40px;
        box-shadow: 0.3rem 0.8rem 0.8rem rgba(128, 128, 128, 0.478);
        cursor: pointer;
        transition: all 0.5s ease;

        &:hover {
          transform: translateY(-5px);
        }

        &.img--1 {
          background-image: url("/src/assets/imgs/lifepal-slide-1.webp");
        }
        &.img--2 {
          background-image: url("/src/assets/imgs/lifepal-slide-2.webp");
        }
        &.img--3 {
          background-image: url("/src/assets/imgs/lifepal-slide-3.webp");
        }
        &.img--4 {
          background-image: url("/src/assets/imgs/lifepal-slide-4.webp");
        }
        &.img--5 {
          background-image: url("/src/assets/imgs/lifepal-slide-5.webp");
        }
        &.img--6 {
          background-image: url("/src/assets/imgs/lifepal-slide-6.webp");
        }
      }

      .slideshow__text {
        margin-top: 2rem;
        font-size: 2.5rem;
        font-weight: 500;
        text-shadow: 0rem 0.2rem 0.5rem rgb(191, 191, 191);
        color: inherit;
      }
    }

    .slideshow__btns-container {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      width: 10%;
      height: 1.5rem;
      margin-top: 2rem;
      bottom: 10%;
      overflow: visible;
      text-align: center;

      .btn {
        width: 1.1rem;
        aspect-ratio: 1;
        margin: 0px 2px;
        border: none;
        border-radius: 50px;

        background: rgba(255, 255, 255, 0.389);
        box-shadow: 0rem 0.1rem 0.3rem grey;
        &.btn--active {
          background: var(--warning);
          transition: all 0.3s ease;
        }
      }
    }

    .slideshow__carousel-enter-from {
      opacity: 0;
      transform: translateX(100px);
    }
    .slideshow__carousel-enter-active {
      transition: all 0.3s ease-out;
    }
    .slideshow__carousel-leave-active {
      transition: all 0.3s ease-out;
    }

    .slideshow__carousel-enter-to,
    .slideshow__carousel-leave-from {
      opacity: 1;
      transform: translateX(0px);
    }

    .slideshow__carousel-leave-to {
      opacity: 0;
      transform: translateX(-100px);
    }
  }

  .section__scrollto-btn {
    position: fixed;
    bottom: 3rem;
    left: 50%;
    transform: translateX(-50%);
    width: 3rem;
    aspect-ratio: 1;
    z-index: 5;
    border-radius: 100%;
    border: none;
    background: url("/src/assets/imgs/down-arrow.png");
    background-size: cover;

    background-position: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &.rotated {
      transform: rotate(180deg) translateX(50%);
    }
  }
}
</style>
