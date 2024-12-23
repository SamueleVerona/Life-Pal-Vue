<template>
  <nav>
    <ul>
      <li>
        <button id="button-calendar" data-button-id="calendar">calendar</button>
      </li>
      <li>
        <button id="button-dash" data-button-id="dashboard">dashboard</button>
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
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  background: transparent;
  /* border: solid; */
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

button:active {
  border: solid 1px rgb(1, 217, 229);
  border-bottom: solid 2px rgb(0, 242, 255);
  color: rgb(4, 167, 172);
}
</style>
