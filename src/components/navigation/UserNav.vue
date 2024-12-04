<template>
  <nav>
    <ul>
      <li>
        <button
          id="button-calendar"
          data-index="0"
          :disabled="props.triggers[0]"
        >
          calendar
        </button>
      </li>
      <li>
        <div
          id="button-dash"
          data-index="1"
          :disabled="!props.triggers[1]"
          :enabled="props.triggers[1]"
        >
          dashboard
          <div>
            <button
              id="button-comp"
              data-index="3"
              :selected="props.triggers[3]"
            >
              ✔
            </button>
            <button
              id="button-fail"
              data-index="4"
              :selected="props.triggers[4]"
            >
              ✖
            </button>
          </div>
        </div>
      </li>
      <li>
        <button id="button-add" data-index="2">add goal</button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { defineProps, watch } from "vue";
const props = defineProps(["triggers"]);
watch(props, () => console.log(props));
</script>

<style scoped>
* {
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
nav {
  position: relative;
}
ul {
  padding: 0;
  list-style: none;
  background: transparent;
  display: flex;
  justify-content: space-evenly;
  height: 100%;
}

button,
#button-dash,
#button-dash > div {
  box-sizing: border-box;
  width: max-content;
  height: 100%;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  margin: 0rem 0.5rem;
  font-size: 3rem;
  font-family: inherit;
  font-weight: bolder;
  background: none;
}

#button-dash {
  display: flex;
  padding-right: 0.1rem;
  justify-content: space-between;
  align-items: center;
}

#button-dash > div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0rem 0rem;
  margin-left: 1rem;
  border: solid 2px rgb(218, 218, 218);
}

#button-add {
  border: solid 1px rgb(236, 225, 71);
  border-bottom: solid 4px rgb(225, 235, 34);
  color: rgb(181, 181, 0);
}
#button-add:active {
  border: solid 1px rgb(236, 137, 71);
  border-bottom: solid 4px rgb(255, 158, 13);
  color: rgb(255, 77, 6);
}

#button-comp,
#button-fail {
  padding: 0.8rem 0.8rem;
  font-size: 2.5rem;
  line-height: 1.5rem;
  position: relative;
  height: 80%;

  /* top: 50%;
  transform: translateY(-50%); */
  background: rgb(140, 255, 167);
  border: solid 1px rgb(81, 255, 92);
  border-bottom: solid 4px rgb(41, 255, 55);
}

#button-fail {
  background: rgb(254, 157, 157);
  border: solid 1px rgb(255, 81, 81);
  border-bottom: solid 4px rgb(255, 41, 41);
}
button:disabled,
#button-dash[disabled="false"],
#button-comp[selected="true"],
#button-fail[selected="true"] {
  border: solid 1px rgb(1, 217, 229);
  border-bottom: solid 3px rgb(0, 242, 255);
  color: rgb(4, 167, 172);
}
button:enabled,
#button-dash[enabled="false"] {
  border: solid 1px rgb(218, 218, 218);
  border-bottom: solid 4px rgb(218, 218, 218);
}
</style>
