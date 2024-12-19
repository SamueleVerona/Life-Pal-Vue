<template>
  <nav>
    <ul>
      <li>
        <button id="button-calendar" data-button-id="calendar">calendar</button>
      </li>
      <li>
        <button id="button-dash" data-button-id="dashboard">dashboard</button>
      </li>
      <li>
        <button id="button-comp" data-button-id="completed">✔</button>
      </li>
      <li>
        <button id="button-fail" data-button-id="failed">✖</button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
* {
  font-family: "Poppins", Sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
nav {
  position: relative;
}
ul {
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  list-style: none;
  background: transparent;
}

button {
  box-sizing: border-box;
  width: max-content;
  height: 100%;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  margin: 0rem 0.5rem;
  font-size: 3rem;
  font-family: inherit;
  font-weight: bolder;
  background: none;
  border: solid 1px rgb(218, 218, 218);
  border-bottom: solid 3px rgb(218, 218, 218);
}

#button-comp,
#button-fail {
  width: max-content;
  padding: 0.8rem;
  font-size: 2.5rem;
  line-height: 1.5rem;
}

#button-comp {
  background: rgb(140, 255, 167);
  border: solid 1px rgb(81, 255, 92);
  border-bottom: solid 3px rgb(41, 255, 55);
}

#button-fail {
  background: rgb(254, 157, 157);
  border: solid 1px rgb(255, 81, 81);
  border-bottom: solid 3px rgb(255, 41, 41);
}
button:active,
#button-comp:active,
#button-fail:active {
  border: solid 1px rgb(1, 217, 229);
  border-bottom: solid 2px rgb(0, 242, 255);
  color: rgb(4, 167, 172);
}
/* button:enabled {
  border: solid 1px rgb(218, 218, 218);
  border-bottom: solid 4px rgb(218, 218, 218);
} */
</style>
