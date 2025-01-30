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
          <span class="slideshow__text">send a request to the developer</span>
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
      <div class="slideshow__btns-container" @mousedown="selectSlide">
        <button
          type="button"
          data-btn-index="1"
          class="btn"
          :class="{ 'btn--active': slideCounter === 1 }"
        ></button>
        <button
          type="button"
          data-btn-index="2"
          class="btn"
          :class="{ 'btn--active': slideCounter === 2 }"
        ></button>
        <button
          type="button"
          data-btn-index="3"
          class="btn"
          :class="{ 'btn--active': slideCounter === 3 }"
        ></button>
        <button
          type="button"
          data-btn-index="4"
          class="btn"
          :class="{ 'btn--active': slideCounter === 4 }"
        ></button>
        <button
          type="button"
          data-btn-index="5"
          class="btn"
          :class="{ 'btn--active': slideCounter === 5 }"
        ></button>
        <button
          type="button"
          data-btn-index="6"
          class="btn"
          :class="{ 'btn--active': slideCounter === 6 }"
        ></button>
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

function selectSlide(e) {
  const target = e.target;
  if (!target.classList.contains("btn")) return;
  const btnIndex = +target.dataset.btnIndex;
  slideCounter.value = btnIndex;
}

const positions = [
  {
    inset: "46%",
    zIndex: 1,
  },
  { inset: "48%", zIndex: 2 },
  { inset: "50%", zIndex: 3 },
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

  if (scrollOffset > viewportHeight * 1.1) {
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
  font-family: var(--font-stack);
}

@mixin horizontal-flex {
  display: flex;
  flex-direction: row;
}
@mixin vertical-flex {
  display: flex;
  flex-direction: column;
}

.section {
  position: relative;
  height: 100dvh;
  overflow-y: scroll;
  scrollbar-gutter: stable both-edges;
  scrollbar-width: thin;
  scrollbar-color: rgba(98, 37, 253, 0) rgba(3, 3, 255, 0);
  background: var(--theme-bkg);
  transition: all 0.3s ease;

  .section__hero {
    @include vertical-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    height: 100dvh;
    overflow: visible;

    .hero__logo {
      position: relative;
      margin-bottom: 1rem;
      overflow: visible;
      font-size: 20rem;
      line-height: 100%;
      text-align: center;
      white-space: break-spaces;
      opacity: 1;

      background: linear-gradient(
        to bottom,
        var(--theme-primary-dark) 25%,
        var(--theme-primary-light)
      );
      background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
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
    }
    .hero__link {
      position: absolute;
      bottom: 10%;

      font-size: 5rem;
      font-weight: 600;
      color: var(--confirm-default);
      text-decoration: none;
      filter: drop-shadow(0rem -0.3rem 0.6rem rgb(162, 162, 162));
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
    @include vertical-flex;
    justify-content: space-evenly;
    height: 100dvh;
    overflow: visible;

    .bio__title {
      align-self: center;
      font-size: 6rem;
      text-align: center;
    }

    .bio__cards-container {
      position: relative;
      width: 100%;
      height: 70lvh;
      overflow: visible;

      .bio__card {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        transform: translate(-50%, -50%);

        width: 80%;
        max-width: 45rem;
        aspect-ratio: 1;
        padding: 0rem 2rem;
        overflow: visible;

        font-size: 2.2rem;
        font-weight: 600;
        text-align: center;
        color: inherit;

        border-radius: 40px;
        box-shadow: 0.2rem 0.5rem 0.8rem rgb(169, 169, 169);
        background: rgb(255, 255, 255);
        background: rgba(235, 227, 255, 0.037);
        backdrop-filter: blur(100px);
        cursor: pointer;
        transition: all 0.5s ease;

        @media screen and (max-width: 500px) {
          max-width: 35rem;
        }

        &.bio__card--1 {
          inset: 50%;
          z-index: 3;
          background: rgb(255, 254, 253);
        }

        &.bio__card--2 {
          inset: 48%;
          z-index: 2;
          background: rgb(255, 251, 244);
        }

        &.bio__card--3 {
          inset: 46%;
          z-index: 1;
          background: rgb(255, 249, 239);
        }

        &.front-anim {
          animation: card-shuffle 0.6s forwards;

          @keyframes card-shuffle {
            0%,
            100% {
              transform: translate(-50%, -50%);
            }
            50% {
              transform: translate(calc(-50% + 50px), calc(-50% + 50px));
            }
          }
        }
      }
    }
  }
  .section__slideshow {
    @include vertical-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100dvh;
    padding: 2rem 0rem;

    .slideshow__card-container {
      @include horizontal-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: max-content;
      height: 100%;
      overflow: visible;
    }
    .slideshow__card {
      @include vertical-flex;

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

        @media screen and (max-width: 500px) {
          width: 35rem;
          height: 35rem;
        }

        &:hover {
          transform: translateY(-5px);
        }

        &.img--1 {
          background-image: url("/src/assets/imgs/lp-slide-1.webp");
        }
        &.img--2 {
          background-image: url("/src/assets/imgs/lp-slide-2.webp");
        }
        &.img--3 {
          background-image: url("/src/assets/imgs/lp-slide-3.webp");
        }
        &.img--4 {
          background-image: url("/src/assets/imgs/lp-slide-4.webp");
        }
        &.img--5 {
          background-image: url("/src/assets/imgs/lp-slide-5.webp");
        }
        &.img--6 {
          background-image: url("/src/assets/imgs/lp-slide-6.webp");
        }
      }

      .slideshow__text {
        margin-top: 2rem;
        font-size: 2.5rem;
        font-weight: 600;
        text-shadow: 0.2rem 0.2rem 0.4rem rgb(191, 191, 191);
        color: inherit;
      }
    }

    .slideshow__btns-container {
      @include horizontal-flex;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      width: 10rem;
      height: 1.5rem;
      margin-top: 2rem;
      bottom: 10%;
      overflow: visible;
      text-align: center;

      .btn {
        width: 1rem;
        aspect-ratio: 1;
        margin: 0px 2px;
        border: none;
        border-radius: 50px;

        background: rgba(255, 255, 255, 0.389);
        box-shadow: 0rem 0.1rem 0.3rem grey;
        cursor: pointer;
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
