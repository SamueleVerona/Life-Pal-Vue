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
          ></button>
          <button
            type="button"
            class="controls__btn controls__btn--failed"
            :class="{ selected: !goalStatus && markFlag }"
            @click="markAs"
          ></button>
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
  position: relative;
  margin-bottom: 1rem;
  text-align: center;
}
@mixin item-btn-format {
  padding: 0rem 0.5rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
}

.item__container {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  max-height: max-content;
  margin: 0.8rem 0rem;
  padding: 1rem;
  border-radius: 40px;
  box-shadow: var(--basic-shadow);
  border: solid 3px rgb(230, 230, 230);
  border-bottom: solid 10px rgba(157, 157, 157, 0.978);
  border-bottom: solid 10px rgba(176, 176, 176, 0.978);
  border: solid 1px rgba(162, 162, 162, 0.389);

  background: radial-gradient(
    ellipse at bottom left,
    var(--warning) 1%,
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
    border: solid 1px var(--theme-day);
    background: radial-gradient(
      ellipse at bottom right,
      var(--theme-day) 1%,
      rgba(169, 255, 219, 0.659) 35%,
      rgba(209, 244, 231, 0.345) 18%,
      rgba(224, 234, 230, 0.345) 20%,
      transparent 95%
    );

    .item__title-text {
      color: var(--theme-day);
    }
  }

  &.week {
    border: solid 1px var(--theme-week);
    background: radial-gradient(
      ellipse at bottom right,
      rgba(255, 73, 60, 0.742) 1%,
      rgba(236, 169, 255, 0.348) 35%,
      rgba(209, 244, 231, 0.345) 18%,
      rgba(224, 234, 230, 0.345) 20%,
      transparent 25%
    );

    .item__title-text {
      color: var(--theme-week);
    }
  }

  &.month {
    border: solid 1px var(--theme-month);
    background: radial-gradient(
      ellipse at bottom right,
      var(--theme-month) 1%,
      rgba(255, 199, 169, 0.348) 35%,
      rgba(209, 244, 231, 0.345) 18%,
      rgba(224, 234, 230, 0.345) 20%,
      transparent 25%
    );

    .item__title-text {
      color: var(--theme-month);
    }
  }

  .item__title {
    width: 100%;
    min-height: max-content;

    .item__title-text {
      align-self: center;
      padding: 0rem 1.5rem 0.5rem 1.5rem;
      margin: 0.5rem 0rem;

      font-size: 3rem;
      font-weight: bolder;
      line-height: 3rem;
      text-align: center;
      border: none;
    }
  }
  .item__info {
    display: flex;
    flex-direction: column;
    font-size: 3rem;
    text-overflow: clip;

    .item__description {
      align-self: center;
      width: 90%;
      padding: 0.5rem 1.5rem 0.5rem 0.8rem;
      font-weight: 500;
      font-size: 2.2rem;
      text-align: center;
      border: none;
      border-bottom: solid 2px rgba(92, 88, 97, 0.352);
    }
    .item__status {
      display: flex;
      align-self: center;
      position: relative;
      width: max-content;
      margin: 0.5rem 0rem;
      padding-top: 0.5rem;
      text-align: center;
      background: rgba(248, 255, 253, 0.164);

      .item__status-text {
        font-size: 1.5rem;
        font-weight: bold;
        line-height: 1.5rem;

        .status-title {
          color: rgb(0, 87, 187);
        }
        .status-label {
          color: brown;
        }
      }
    }
    .item__reply {
      align-self: center;
      width: max-content;
      overflow: visible;
      border-top: solid 2px rgba(92, 88, 97, 0.177);
      @include reply-format;

      .item__reply-title,
      .item__reply-text {
        font-size: 1.5rem;
        font-weight: bold;
      }

      .item__reply-title {
        position: relative;
        color: rgb(0, 87, 187);
      }

      .item__reply-btn {
        position: absolute;
        width: max-content;
        @include item-btn-format;
        font-weight: 600;
        line-height: 2rem;
        color: rgb(255, 0, 43);
        background: transparent;
        transform: translateY(48%);
      }
    }

    .item__reply-admin {
      @include reply-format;

      .reply-admin__input {
        width: 80%;
        font-size: 1.5rem;
        font-weight: 500;
        resize: none;
      }
    }

    .item__progress {
      align-self: center;
      position: relative;
      width: 50%;
      height: 2rem;
      margin-bottom: 0.3rem;
      border-radius: 50px;
      background: rgb(255, 255, 255);

      .progress-bar {
        height: 100%;
        z-index: 100;
        background: linear-gradient(
          to right,
          rgb(183, 255, 242),
          rgb(152, 216, 253)
        );
        border-radius: 30px;
        border-right: solid 4px rgb(125, 224, 196);
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;

        &:after {
          position: absolute;
          bottom: 0;
          width: inherit;
          height: 100%;
          overflow: visible;
          content: "";
          box-shadow: 0rem 0rem 0.6rem 0.1rem rgb(67, 199, 251);
          border-radius: 30px;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0),
            rgb(115, 232, 255)
          );
          animation: progress-glow 3s cubic-bezier(0.86, 0, 0.07, 1) infinite;

          @keyframes progress-glow {
            0% {
              opacity: 0;
              width: 0rem;
            }
            40% {
              opacity: 0.8;
            }
            50% {
              width: inherit;
              opacity: 1;
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

          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
          line-height: 1.8rem;
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
      width: 50%;
      margin: auto;
      padding: 0.5rem 0.8rem;

      font-size: 1.8rem;
      font-weight: bold;
      text-align: center;
      border-radius: 18px;
      border: solid 2px rgb(183, 183, 183);

      .controls__toggle-text {
        flex: 2;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .controls__btn-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        border-radius: 18px;

        .controls__btn {
          @include item-btn-format;
          align-items: center;
          width: 1.5rem;
          aspect-ratio: 1;
          margin: 0rem 0.2rem;
          font-size: 0.8em;
          text-align: center;
          transition: all 0.1s ease;

          @mixin btn-bkg {
            background-size: contain;
            background-position-y: -2px;
            background-repeat: no-repeat;
          }

          &:first-of-type {
            background: url("/src/assets/imgs/check-mark.png");
            @include btn-bkg;
            &:hover {
              background: url("/src/assets/imgs/check-mark-checked.png");
              @include btn-bkg;
            }
          }

          &:last-of-type {
            background: url("/src/assets/imgs/cross-mark.png");
            @include btn-bkg;

            &:hover {
              background: url("/src/assets/imgs/cross-mark-checked.png");
              @include btn-bkg;
            }
          }

          &.selected {
            &.controls__btn--completed {
              background: url("/src/assets/imgs/check-mark-checked.png");
              @include btn-bkg;
            }
            &.controls__btn--failed {
              background: url("/src/assets/imgs/cross-mark-checked.png");
              @include btn-bkg;
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
