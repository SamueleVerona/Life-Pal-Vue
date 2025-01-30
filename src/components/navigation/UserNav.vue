<template>
  <nav class="nav">
    <ul class="nav__list">
      <li>
        <button
          type="button"
          data-button-id="calendar"
          class="btn btn--flippable btn--calendar"
          :class="{ 'btn--flipped': props.toggleProfile || $props.isAdmin }"
          :disabled="props.toggleProfile || isAdmin"
        >
          <span class="btn__face btn__face--front" inert>calendar</span>
          <span class="btn__face btn__face--back" inert>dashboard:</span>
        </button>
      </li>
      <li>
        <button
          type="button"
          data-button-id="dashboard"
          class="btn btn--flippable btn--dashboard"
          :class="{ 'btn--flipped': props.toggleProfile || $props.isAdmin }"
          :disabled="props.toggleProfile || props.isAdmin"
        >
          <span class="btn__face btn__face--front" inert>dashboard</span>
          <span class="btn__face btn__face--back" inert>requests</span>
        </button>
      </li>
      <li v-if="!props.isAdmin && props.toggleProfile && !props.isLocked">
        <button type="button" data-button-id="unsub" class="btn btn--unsub">
          delete account
        </button>
      </li>
      <li v-if="props.toggleProfile || props.isAdmin">
        <button type="button" data-button-id="logout" class="btn btn--logout">
          log out
        </button>
      </li>
      <li>
        <button
          type="button"
          data-button-id="profile"
          class="btn btn--profile"
          :disabled="props.isAdmin"
          :toggled="props.toggleProfile"
        ></button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps(["toggleProfile", "isAdmin", "isLocked"]);
</script>

<style lang="scss" scoped>
* {
  font-family: var(--font-stack);
}
.nav {
  position: relative;
  overflow: visible;

  .nav__list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    list-style: none;
    background: transparent;

    .btn {
      padding: 0.5rem 1rem;
      box-sizing: border-box;

      color: inherit;
      font-size: 2.5rem;
      font-weight: bolder;
      background: none;
      border: none;

      cursor: pointer;
      transition: color 0.1s ease-out;

      &:not(:disabled) {
        &:hover {
          color: var(--hover-default);
        }
        &:active {
          color: var(--active-default);
        }
      }

      &.btn--flippable {
        position: relative;
        height: max-content;

        &.btn--flipped {
          width: 20rem;
          border: none;

          .btn__face.btn__face--front {
            opacity: 0;
            transform: rotateX(180deg);
          }

          .btn__face.btn__face--back {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }

        .btn__face {
          display: block;
          height: 100%;
          font-size: 2.5rem;
          transition: transform 0.6s ease;

          &.btn__face--front {
            backface-visibility: hidden;
            transform: rotateX(0deg);
          }

          &.btn__face--back {
            position: absolute;
            top: 0;
            left: 0;
            min-width: 100%;
            align-content: center;
            line-height: 3rem;

            opacity: 0;
            backface-visibility: hidden;
            transform: rotateX(180deg);
          }
        }
      }

      &.btn--calendar {
        border-right: solid 1px rgb(218, 218, 218);

        &.btn--flipped {
          border: none;
        }
      }

      &.btn--dashboard.btn--flipped {
        width: 16rem;
      }

      &.btn--profile {
        height: 5rem;
        aspect-ratio: 1/1;
        margin-left: 0.5rem;
        margin-right: 2rem;
        z-index: 1;
        overflow: visible;
        background-image: url(/src/assets/imgs/user.png);
        background-size: cover;
        border: solid 2px rgb(221, 221, 221);
        border-radius: 100%;
        transition: all 0.2s ease;

        &:hover,
        &[toggled="true"] {
          border-color: var(--hover-default);
        }
      }

      &.btn--logout {
        color: rgb(0, 145, 255);
        border: none;
        border-left: solid 1px rgb(218, 218, 218);

        &:hover {
          color: orange;
        }
      }

      &.btn--unsub {
        border: none;
        border-left: solid 1px rgb(218, 218, 218);
        color: rgb(121, 0, 127);
        &:hover {
          color: rgb(255, 0, 38);
        }
      }
    }
  }
}

@media screen and (max-width: 900px) {
  .btn--calendar.btn--flipped {
    display: none;
  }
}

@media screen and (max-width: 600px) {
  .nav .nav__list .btn {
    font-size: 2.5rem;

    &.btn--flippable {
      &.btn--flipped {
        display: none;
      }

      .btn__face {
        font-size: 2.5rem;

        &.btn__face--back {
          display: none;
        }
      }
    }

    &.btn--unsub {
      border: none;
      border-right: solid 1px rgb(218, 218, 218);
    }

    &.btn--logout {
      border: none;
    }
  }
}
</style>
