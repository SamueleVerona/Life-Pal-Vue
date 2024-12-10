<template>
  <div class="goal-content exploded" :class="classes">
    <h2 class="goal-title">{{ props.goal.title }}</h2>
    <div class="goal-info">
      <p class="goal-description">{{ props.goal.desc }}</p>
      <div class="goal-stats">
        <h3 class="goal-date">
          Set for:
          {{
            typeof props.goal.compDate === "number"
              ? new Date(props.goal.compDate).toISOString().slice(0, 10)
              : props.goal.compDate
          }}
        </h3>
      </div>
      <div class="progress-bar">
        <h3 class="progress-bar-text">
          <!-- time left:
                    {{ compRate(goal.started, goal.compDate) }} -->
        </h3>
        <div
          :style="{ width: compRate(props.goal.started, props.goal.compDate) }"
        ></div>
      </div>
    </div>
    <div>
      <slot name="selector"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps(["goal", "hasExp"]);
const classes = computed(() => {
  return {
    day: props.goal.type === "day",
    week: props.goal.type === "week",
    month: props.goal.type === "month",
    year: props.goal.type === "year",
    dialog: props.hasExp,
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
</script>

<style scoped>
.goal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0.8rem 0rem;
}
.goal-content.exploded {
  height: 20rem;

  border-radius: 40px;
}

.goal-content.exploded.dialog {
  min-height: 40%;
  width: 90%;
  margin: 0.5rem auto;
}
.goal-title {
  text-align: center;
  padding: 0.5rem 0.8rem 1rem 1rem;
  margin: 0.5rem 0rem;
  border-radius: 30px;
  border: solid 1px rgb(81, 138, 243);
  border-bottom: solid 3px rgba(81, 138, 243);
  width: max-content;
  align-self: center;
  font-size: 2.5rem;
  padding: 0.5rem 1.5rem;
  /* border-bottom: solid 1px; */
}

.goal-info {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  padding-top: 1rem;
  text-overflow: clip;
  font-size: 3rem;
  height: 100%;
}
.goal-description {
  height: max-content;
  width: 90%;
  padding: 0.5rem 1.5rem 0.5rem 0.8rem;
  border-radius: 10px;
  border: solid 1px rgb(166, 93, 255);
  border-bottom: solid 2px rgb(166, 93, 255);

  border-radius: 18px;
  background: rgba(255, 255, 255, 0.185);
  align-self: center;

  font-weight: bold;
  text-align: center;
}
.goal-stats {
  position: relative;
  display: flex;
  padding: 0.5rem;
  margin: 0.5rem 0rem;
  width: max-content;
  text-align: center;

  background: rgba(248, 255, 253, 0.164);
  border-radius: 12px;
  border: solid 1px rgb(42, 223, 157);
  border-bottom: solid 2px rgb(42, 223, 157);

  align-self: center;
}
.goal-date {
  font-size: 1.5rem;
  font-weight: bold;
}
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  height: 2rem;
  width: 60%;
  margin-bottom: 0.3rem;
  border: solid 2px rgb(6, 82, 148);
  border-bottom: solid 3px rgb(6, 82, 148);

  border-radius: 30px;
  background: rgb(255, 255, 255);
}
.progress-bar > div {
  background: rgb(84, 162, 247);
  border-radius: 30px;
  border-right: solid 4px rgb(67, 199, 251);

  /* border: solid; */
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

.goal-content.day {
  border: solid 2px rgb(94, 156, 255);
  border-bottom: solid 10px rgb(94, 156, 255);
}
.goal-content.week {
  border: solid 2px rgb(255, 116, 47);
  border-bottom: solid 10px rgb(255, 116, 47);
}
.goal-content.month {
  border: solid 2px rgb(47, 47, 255);
  border-bottom: solid 10px rgb(47, 47, 255);
}
.goal-content.year {
  border: solid 2px rgb(255, 203, 47);
  border-bottom: solid 10px rgb(255, 203, 47);
}
.goal-content.decade {
  border: solid 2px rgb(47, 210, 255);
  border-bottom: solid 10px rgb(47, 210, 255);
}
</style>
