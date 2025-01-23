<template>
  <div class="item__container" :class="classes">
    <section class="item__title">
      <h2 class="item__title-text">
        {{
          props.item.title[0].toUpperCase() +
          props.item.title.slice(1).toLowerCase()
        }}
      </h2>
    </section>
    <section class="item__info">
      <p class="item__description" v-if="props.item.desc">
        {{
          props.item.desc[0].toUpperCase() +
          props.item.desc.slice(1).toLowerCase()
        }}
      </p>
      <div class="item__status">
        <h3 class="item__status-text">
          <span class="status-title">{{
            props.isRequest ? "Status: " : "Set for: "
          }}</span>
          <span class="status-label">
            {{ props.item.itemLabel }}
          </span>
        </h3>
      </div>
      <div class="item__reply" v-if="props.isRequest">
        <span class="item__reply-title">Admin says:</span>
        <button
          type="button"
          class="item__reply-btn"
          v-if="isAdmin && props.userIsEditing"
          @mousedown="() => (adminIsReplying = !adminIsReplying)"
        >
          {{ props.item.reply ? "change reply" : "add reply" }}
        </button>
        <p class="item__reply-text">{{ props.item.reply || "no reply yet" }}</p>
      </div>
      <div
        class="item__reply-admin"
        v-if="isAdmin && props.userIsEditing && adminIsReplying"
      >
        <textarea
          name="amdin-reply"
          class="reply-admin__input"
          rows="3"
          cols="60"
          v-model="requestReply"
        ></textarea>
      </div>
      <div class="item__progress" v-if="isProgressVisible && !props.isRequest">
        <div
          class="progress-bar"
          :style="{ width: compRate(props.item.started, props.item.compDate) }"
        >
          <span class="progress-bar__text">
            {{ timeLeft }}
          </span>
        </div>
      </div>
    </section>
    <section
      class="item__controls"
      v-if="props.hasExpired || (isAdmin && props.userIsEditing)"
    >
      <div
        class="controls__toggle"
        :class="{
          'controls__toggle--positive': goalStatus && markFlag,
          'controls__toggle--negative': !goalStatus && markFlag,
        }"
      >
        <h3 class="controls__toggle-text">
          {{ goalToggleText }}
        </h3>
        <div class="controls__btn-container">
          <button
            type="button"
            class="controls__btn controls__btn--completed"
            :class="{ selected: goalStatus && markFlag }"
            @click="markAs"
          >
            ✔
          </button>
          <button
            type="button"
            class="controls__btn controls__btn--failed"
            :class="{ selected: !goalStatus && markFlag }"
            @click="markAs"
          >
            ✖
          </button>
        </div>
      </div>
    </section>
    <div>
      <slot name="selector"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref, defineEmits, inject, watch } from "vue";

const isAdmin = inject("isAdmin");

const isProgressVisible = computed(
  () => !props.hasExpired && !props.item.isCompleted && !props.item.isFailed
);
const requestReply = ref();

const props = defineProps([
  "item",
  "hasExpired",
  "isRequest",
  "userIsEditing",
  "timeInc",
]);

const emits = defineEmits(["sendMarkedItem", "sendReply"]);
const classes = computed(() => {
  return {
    day: props.item.type === "day",
    week: props.item.type === "week",
    month: props.item.type === "month",
    year: props.item.type === "year",
    "in-dialog": props.hasExpired,
  };
});

function compRate(start, comp) {
  const totalTime = new Date(comp).getTime() - new Date(start).getTime();
  const elapsedTime = Date.now() - new Date(start).getTime();
  const rate = (elapsedTime / totalTime) * 100;
  if (new Date(comp).getTime() <= Date.now()) return "100%";
  else {
    return Math.min(rate, 100).toFixed(0) + "%";
  }
}

const goalStartMs = new Date(props.item.started).getTime();
const goalCompMs = new Date(props.item.compDate).getTime();
const totalTime = goalCompMs - goalStartMs;
const elapsedTime = Date.now() - goalStartMs;

const timeLeft = computed(() => {
  const timeLeftS = (totalTime - elapsedTime + props.timeInc) / 1000;
  const seconds = Math.floor(timeLeftS % 60);
  const mins = Math.floor((timeLeftS / 60) % 60);
  const hours = Math.floor(timeLeftS / 3600);

  if (timeLeftS <= 0) {
    return "expired";
  }

  return `left: ${hours}H ${mins}M ${seconds}S `;
});

const goalToggleText = ref("");

if (props.isRequest) {
  props.item.itemLabel === "pending"
    ? (goalToggleText.value = "mark status")
    : (goalToggleText.value = "change status");
} else {
  goalToggleText.value = "mark it";
}

const goalStatus = ref(false);
const markFlag = ref(false);

const reqStatus = ref();
const adminIsReplying = ref(false);

function markAs(e) {
  const isButtonComp = e.target.classList.contains("controls__btn--completed");
  const isButtonFail = e.target.classList.contains("controls__btn--failed");

  const itemId = props.item.databaseId;
  const userId = props.item.userId;

  if (isButtonComp) {
    markFlag.value = true;

    goalStatus.value = true;
    reqStatus.value = "accepted";
    goalToggleText.value = isAdmin ? "accepted" : "completed";
  }
  if (isButtonFail) {
    markFlag.value = true;

    goalStatus.value = false;
    reqStatus.value = "rejected";
    goalToggleText.value = isAdmin ? "rejected" : "failed";
  }

  const markedGoal = {
    itemId,
    isCompleted: goalStatus.value,
    isFailed: !goalStatus.value,
  };
  const markedRequest = {
    userId,
    itemId,
    itemLabel: reqStatus.value,
    reply: requestReply.value,
  };

  if (reqStatus.value != props.item.itemLabel)
    emits("sendMarkedItem", isAdmin ? markedRequest : markedGoal);
}

function sendReply() {
  if (requestReply.value && requestReply.value.length > 5) {
    emits("sendReply", {
      isReply: true,
      request: {
        itemId: props.item.databaseId,
        userId: props.item.userId,
        itemLabel: reqStatus.value,
        reply: requestReply.value,
      },
    });
  }
}

watch(requestReply, () => sendReply());
watch(props.item, () => {
  requestReply.value = "";
  adminIsReplying.value = false;
});
</script>

<style lang="scss" scoped>
* {
  font-family: "Poppins", sans-serif;
}

@mixin reply-format {
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
}
@mixin item-btn-format {
  border: none;
  border-radius: 30px;
  padding: 0rem 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
}

.item__container {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0.8rem 0rem;
  padding: 1rem;
  max-height: max-content;
  width: 100%;
  border-radius: 40px;
  box-shadow: var(--basic-shadow);

  border: solid 3px rgb(230, 230, 230);
  border-bottom: solid 10px rgba(157, 157, 157, 0.978);
  border-bottom: solid 10px rgba(176, 176, 176, 0.978);
  border: solid 1px rgba(162, 162, 162, 0.389);

  background: radial-gradient(
    ellipse at bottom left,
    var(--dialog-button-color-default-earth) 1%,
    rgba(255, 225, 161, 0.659) 20%,
    rgba(244, 236, 209, 0.345) 13%,
    rgba(234, 231, 224, 0.345) 15%,
    transparent 95%
  );

  &.in-dialog {
    min-height: 40%;
    width: 95%;
    margin: 0.5rem auto;
  }

  &.day {
    border: solid 1px var(--item-goal-day);
    background: radial-gradient(
      ellipse at bottom right,
      var(--item-goal-day) 1%,
      rgba(169, 255, 219, 0.659) 35%,
      rgba(209, 244, 231, 0.345) 18%,
      rgba(224, 234, 230, 0.345) 20%,
      transparent 95%
    );

    .item__title-text {
      color: var(--item-goal-day);
    }
  }

  &.week {
    border: solid 1px var(--item-goal-week);
    background: radial-gradient(
      ellipse at bottom right,
      rgba(255, 73, 60, 0.742) 1%,
      rgba(236, 169, 255, 0.348) 35%,
      rgba(209, 244, 231, 0.345) 18%,
      rgba(224, 234, 230, 0.345) 20%,
      transparent 25%
    );

    .item__title-text {
      color: var(--item-goal-week);
    }
  }

  &.month {
    border: solid 1px var(--item-goal-month);
    background: radial-gradient(
      ellipse at bottom right,
      var(--item-goal-month) 1%,
      rgba(255, 199, 169, 0.348) 35%,
      rgba(209, 244, 231, 0.345) 18%,
      rgba(224, 234, 230, 0.345) 20%,
      transparent 25%
    );

    .item__title-text {
      color: var(--item-goal-month);
    }
  }

  .item__title {
    min-height: max-content;
    width: 100%;

    .item__title-text {
      padding: 0rem 1.5rem 0.5rem 1.5rem;
      margin: 0.5rem 0rem;
      align-self: center;
      border: none;

      font-size: 3rem;
      line-height: 3rem;
      text-align: center;
      font-weight: bolder;
    }
  }
  .item__info {
    display: flex;
    flex-direction: column;
    text-overflow: clip;
    font-size: 3rem;

    .item__description {
      width: 90%;
      padding: 0.5rem 1.5rem 0.5rem 0.8rem;
      border: none;
      border-bottom: solid 2px rgba(92, 88, 97, 0.352);
      align-self: center;
      text-align: center;
      font-weight: 500;
      font-size: 2.2rem;
    }
    .item__status {
      position: relative;
      display: flex;
      padding-top: 0.5rem;
      margin: 0.5rem 0rem;
      width: max-content;
      text-align: center;

      background: rgba(248, 255, 253, 0.164);
      align-self: center;

      .item__status-text {
        font-size: 1.5rem;
        font-weight: bold;

        .status-label {
          color: brown;
        }

        .status-title {
          color: rgb(0, 87, 187);
        }
      }
    }
    .item__reply {
      border-top: solid 2px rgba(92, 88, 97, 0.177);
      width: max-content;
      align-self: center;
      overflow: visible;
      @include reply-format;

      .item__reply-title,
      .item__reply-text {
        font-size: 1.5rem;
        font-weight: bold;
      }

      .item__reply-title {
        color: rgb(0, 87, 187);
      }

      .item__reply-btn {
        position: absolute;
        font-size: 1.3rem;
        width: max-content;
        color: red;
        background: transparent;

        @include item-btn-format;
      }
    }

    .item__reply-admin {
      @include reply-format;

      .reply-admin__input {
        font-size: 1.5rem;
        font-weight: 500;
        resize: none;
        width: 80%;
      }
    }

    .item__progress {
      height: 2rem;
      width: 50%;
      margin-bottom: 0.3rem;
      border: solid 1px rgb(226, 226, 226);
      border-radius: 50px;
      background: rgb(255, 255, 255);
      align-self: center;
      position: relative;

      .progress-bar {
        background: rgb(84, 162, 247);
        border-radius: 30px;
        border-right: solid 4px rgb(67, 199, 251);
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;

        height: 100%;
        z-index: 100;

        &:after {
          content: "";
          height: 100%;
          width: inherit;
          position: absolute;
          bottom: 0;
          border-radius: 30px;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0),
            rgb(146, 255, 199)
          );
          animation: progress-glow 3s cubic-bezier(0.86, 0, 0.07, 1) infinite;
          box-shadow: 0rem 0rem 0.6rem 0.1rem rgb(67, 199, 251);
          overflow: visible;

          @keyframes progress-glow {
            0% {
              opacity: 0;
              width: 0rem;
            }
            40% {
              opacity: 0.8;
            }
            50% {
              opacity: 1;
              width: inherit;
              box-shadow: 0rem 0rem 0.6rem 0rem rgb(67, 199, 251);
            }

            100% {
              opacity: 0;
            }
          }
        }
        .progress-bar__text {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: max-content;

          text-align: center;
          font-size: 1.2rem;
          line-height: 1.8rem;
          font-weight: 600;
          text-transform: lowercase;

          color: inherit;
          background: none;
        }
      }
    }
  }
  .item__controls {
    align-items: center;

    .controls__toggle {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      align-self: center;
      margin: auto;

      width: 50%;
      border-radius: 18px;
      border: solid 2px rgb(183, 183, 183);
      text-align: center;
      font-size: 1.8rem;
      font-weight: bold;
      padding: 0.5rem 0.8rem;

      .controls__toggle-text {
        flex: 2;
        font-size: 1.5rem;
        font-weight: bold;
        justify-self: flex-start;
      }

      .controls__btn-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        border-radius: 18px;

        .controls__btn {
          @include item-btn-format;
          margin: 0rem 0.2rem;

          &:hover {
            color: aqua;
          }

          &.selected {
            & .controls__btn--completed {
              color: rgb(6, 255, 135);
            }
            & .controls__btn--failed {
              color: rgb(255, 6, 81);
            }
          }
        }
      }

      &.controls__toggle--positive {
        border-color: rgb(4, 208, 109);
      }
      &.controls__toggle--negative {
        border-color: rgb(255, 6, 102);
      }
    }
  }
}
</style>
