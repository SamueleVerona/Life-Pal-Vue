<template>
  <div class="goal-content" :class="classes">
    <h2 class="goal-title">
      {{
        props.item.title[0].toUpperCase() +
        props.item.title.slice(1).toLowerCase()
      }}
    </h2>
    <div class="goal-info">
      <p class="goal-description">
        {{ props.item.desc }}
      </p>
      <div class="goal-stats">
        <h3 class="goal-date">
          <span>{{ props.isRequest ? "Status: " : "Set for: " }}</span>
          <span>
            {{ props.item.itemLabel }}
          </span>
        </h3>
      </div>
      <div class="request-reply" v-if="props.isRequest">
        <span>Admin says:</span>
        <button
          type="button"
          v-if="isAdmin && props.userIsEditing"
          @mousedown="() => (adminIsReplying = !adminIsReplying)"
        >
          {{ props.item.reply ? "change reply" : "add reply" }}
        </button>
        <p>{{ props.item.reply || "no reply yet" }}</p>
      </div>
      <div
        class="admin-reply"
        v-if="isAdmin && props.userIsEditing && adminIsReplying"
      >
        <textarea
          name="amdin-reply"
          class="txtarea"
          rows="3"
          cols="60"
          v-model="requestReply"
        ></textarea>
      </div>
      <div
        class="goal-toggle"
        :class="{ comp: goalStatus && markFlag, fail: !goalStatus && markFlag }"
        v-if="props.hasExpired || (isAdmin && props.userIsEditing)"
      >
        <h3 class="goal-toggle-text">{{ goalToggleText }}</h3>
        <div class="button-wrapper">
          <button
            type="button"
            class="button-completed"
            :class="{ selected: goalStatus && markFlag }"
            @click="markAs"
          >
            ✔
          </button>
          <button
            type="button"
            class="button-fail"
            :class="{ selected: !goalStatus && markFlag }"
            @click="markAs"
          >
            ✖
          </button>
        </div>
      </div>
      <div class="progress-bar" v-if="isProgressVisible && !props.isRequest">
        <h3 class="progress-bar-text">
          <!-- time left:
                    {{ compRate(goal.started, goal.compDate) }} -->
        </h3>
        <div
          :style="{ width: compRate(props.item.started, props.item.compDate) }"
        ></div>
      </div>
    </div>
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

const props = defineProps(["item", "hasExpired", "isRequest", "userIsEditing"]);

const emits = defineEmits(["sendMarkedItem", "sendReply"]);
const classes = computed(() => {
  return {
    day: props.item.type === "day",
    week: props.item.type === "week",
    month: props.item.type === "month",
    year: props.item.type === "year",
    dialog: props.hasExpired,
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

const goalToggleText = ref("");

props.item.itemLabel === "pending"
  ? (goalToggleText.value = "mark status")
  : (goalToggleText.value = "change status");

const goalStatus = ref(false);
const markFlag = ref(false);

// const completed = ref(false);
// const failed = ref(false);
const reqStatus = ref();
const adminIsReplying = ref(false);

function markAs(e) {
  const isButtonComp = e.target.classList.contains("button-completed");
  const isButtonFail = e.target.classList.contains("button-fail");

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
    console.log("writing");
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

<style scoped>
.goal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0.8rem 0rem;

  min-height: max-content;
  width: 100%;

  border-radius: 40px;
  /* align-self: center; */
  box-shadow: var(--basic-shadow);
}

.goal-content .dialog {
  min-height: 40%;
  width: 90%;
  margin: 0.5rem auto;
}
.goal-title {
  min-height: max-content;
  width: max-content;

  padding: 0.5rem 1.5rem;
  margin: 0.5rem 0rem;
  align-self: center;
  border: none;

  font-size: 3rem;
  line-height: 3rem;
  text-align: center;
  font-weight: bolder;
  font-style: italic;
}

.goal-info {
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  text-overflow: clip;
  font-size: 3rem;
  min-height: 10rem;
}
.goal-description {
  /* min-height: 3rem; */
  width: 90%;
  padding: 0.5rem 1.5rem 0.5rem 0.8rem;
  border: none;
  border-bottom: solid 2px rgba(92, 88, 97, 0.352);
  align-self: center;
  text-align: center;
  font-weight: 500;
  font-size: 2.5rem;
}
.goal-stats {
  position: relative;
  display: flex;
  padding: 0.5rem;
  margin: 0.5rem 0rem;
  width: max-content;
  text-align: center;

  background: rgba(248, 255, 253, 0.164);
  align-self: center;
}

.goal-date,
.goal-date span,
.request-reply span,
.request-reply p {
  font-size: 1.5rem;
  font-weight: bold;
}
.goal-date span:last-child {
  color: brown;
}
.goal-date span,
.request-reply span {
  color: rgb(0, 87, 187);
}

.request-reply {
  border-top: solid 2px rgba(92, 88, 97, 0.177);
  /* border: solid; */
  width: max-content;
  align-self: center;
  overflow: visible;
}

.request-reply,
.admin-reply {
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
}
.txtarea {
  font-size: 1.5rem;
  font-weight: 500;
  resize: none;
  width: 80%;
}

.goal-toggle {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  align-self: center;

  width: 50%;
  border-radius: 18px;
  border: solid 2px blue;
  margin-bottom: 0.5rem;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  padding: 0.5rem 0.8rem;
}
.goal-toggle-text {
  flex: 2;
  font-size: 1.5rem;
  font-weight: bold;
  justify-self: flex-start;
}

.button-wrapper {
  display: flex;
  flex: 1;

  justify-content: center;
  align-items: center;
  border-radius: 18px;
}

.button-wrapper button,
.request-reply button {
  border: none;
  border-radius: 30px;
  padding: 0rem 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
}
.request-reply button {
  position: absolute;
  font-size: 1.3rem;
  width: max-content;
  /* top: 0.4rem; */
  color: red;
}
button:hover {
  color: aqua;
}

.goal-toggle.comp {
  border-color: rgb(4, 208, 109);
}

.button-wrapper .button-completed.selected {
  color: rgb(6, 255, 135);
}
.goal-toggle.fail {
  border-color: rgb(255, 6, 102);
}
.button-wrapper .button-fail.selected {
  color: rgb(255, 6, 6);
}

.progress-bar {
  height: 2rem;
  width: 50%;
  margin-bottom: 0.3rem;
  border: solid 2px rgb(6, 82, 148);
  border-bottom: solid 3px rgb(6, 82, 148);

  border-radius: 30px;
  background: rgb(255, 255, 255);

  align-self: center;
}
.progress-bar > div {
  background: rgb(84, 162, 247);
  border-radius: 30px;
  border-right: solid 4px rgb(67, 199, 251);

  height: 100%;
  z-index: 100;
}
.progress-bar-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgb(26, 42, 101);
  font-size: 1.5rem;
  line-height: 1.5rem;

  background: none;
}
.label {
  font-size: 1.5rem;
}
.goal-content {
  border: solid 3px rgb(230, 230, 230);
  border-bottom: solid 10px rgba(157, 157, 157, 0.978);
  border-bottom: solid 10px rgba(176, 176, 176, 0.978);
  border: solid 1px rgba(162, 162, 162, 0.389);

  background: radial-gradient(
    ellipse at bottom left,
    rgba(109, 106, 255, 0.67) 1%,
    rgba(117, 200, 255, 0.659) 20%,
    rgba(244, 236, 209, 0.345) 13%,
    rgba(234, 231, 224, 0.345) 15%,
    transparent 95%
  );
}

.goal-content.day {
  border: solid 1px var(--item-goal-day);

  background: radial-gradient(
    ellipse at bottom right,
    var(--item-goal-day) 1%,
    rgba(169, 255, 219, 0.659) 35%,
    rgba(209, 244, 231, 0.345) 18%,
    rgba(224, 234, 230, 0.345) 20%,
    transparent 95%
  );
}
.goal-content.day .goal-title {
  color: var(--item-goal-day);
}
.goal-content.week {
  border: solid 1px rgb(255, 116, 47, 0.389);
  background: radial-gradient(
    ellipse at bottom right,
    rgba(255, 73, 60, 0.742) 1%,
    rgba(236, 169, 255, 0.348) 35%,
    rgba(209, 244, 231, 0.345) 18%,
    rgba(224, 234, 230, 0.345) 20%,
    transparent 25%
  );
}
.goal-content.month {
  border: solid 1px rgba(255, 161, 47, 0.389);
  background: radial-gradient(
    ellipse at bottom right,
    rgba(235, 60, 255, 0.742) 1%,
    rgba(255, 199, 169, 0.348) 35%,
    rgba(209, 244, 231, 0.345) 18%,
    rgba(224, 234, 230, 0.345) 20%,
    transparent 25%
  );
}
/* .goal-content.year {
  border: solid 2px rgb(255, 203, 47);
  border-bottom: solid 10px rgb(255, 203, 47);
}
.goal-content.decade {
  border: solid 2px rgb(47, 210, 255);
  border-bottom: solid 10px rgb(47, 210, 255);
} */
</style>
