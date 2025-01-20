<template>
  <section id="sign">
    <section id="info" @mousedown="infoClosed = true" v-if="!infoClosed">
      <h3>Before you start</h3>
      <!-- <h4>got it</h4> -->
      <div class="info-text">
        <p>
          I've pre-set two "locked" accounts which have full functionality but
          cannot be deleted. <br />
          You can enter both with the credentials i provide or you can create a
          new one.
        </p>
        <p>
          Keep in mind that this is a demo app for front-end WebDev so security
          measures are basic. <br />
          <span>Don't put any personal info.</span> <br />
          Use a fictional email instead like "user@email.com"
        </p>
      </div>
    </section>
    <section class="form-container" v-if="infoClosed">
      <h2>Life<br />Pal</h2>
      <div class="animated-obj"></div>
      <form
        @submit.prevent
        class="form"
        :class="{ login: mode === 'login', signup: mode === 'signup' }"
      >
        <base-card class="card">
          <template #title> </template>
          <template #content>
            <label for="email">Type in your email</label>
            <input
              type="email"
              name="email"
              id="email"
              v-model="userEmail"
              placeholder="user@email"
            />
            <label for="password">Type in your password</label>
            <input
              type="text"
              name="password"
              id="password"
              placeholder="password"
              minlength="6"
              v-model="userPwd"
            />
          </template>
          <template #button>
            <section id="section-buttons" @mousedown="handleControls">
              <button id="submit-button">{{ mode }}</button>
              <div class="wrapper-dialog-toggle">
                <div id="dialog-toggle">
                  <div class="sign-option other" inert></div>
                </div>
              </div>
            </section>
          </template>
        </base-card>
      </form>
      <div class="presets">
        <h3>Presets</h3>
        <span>email: "john.smith@email.com"</span>
        <span>password: "password"</span>
        <hr />
        <span>email: "jane.doe@email.com"</span>
        <span>password: "passphrase"</span>
      </div>
    </section>
    <base-dialog
      :errorMessage="gottenError"
      :show="!!gottenError"
      @close="closeDialog"
      :wrapperBackground="`var(--dialog-button-color-default-earth)`"
      :buttonBackground="`white`"
    ></base-dialog>
  </section>
</template>

<script setup>
import { useStore } from "vuex";
import { ref } from "vue";
import { useRouter } from "vue-router";

const store = useStore();
const userEmail = ref("");
const userPwd = ref("");
const gottenError = ref(null);

const infoClosed = ref(false);

const router = useRouter();

function closeDialog() {
  gottenError.value = false;
}

function handleControls(e) {
  const target = e.target;
  const isValidTarget = target.id.includes("dialog-toggle");

  const isSubmitBtn = target.id.includes("submit");

  const isLogin = mode.value === "login";

  if (isValidTarget) {
    target.firstElementChild.classList.toggle("other");

    isLogin ? (mode.value = "signup") : (mode.value = "login");
  } else if (isSubmitBtn && userEmail.value && userPwd.value) submit();
  else {
    gottenError.value =
      "Your credentials can not be empty.\nPlease enter a valid email\n(must include a '@') and password\n(at least 6 characters)";
    return;
  }
}

const mode = ref("login");

async function submit() {
  try {
    await store.dispatch(mode.value, {
      email: userEmail.value,
      password: userPwd.value,
    });

    router.push({
      name: "user-home",
    });
  } catch (err) {
    gottenError.value = err.message;
  }
}
</script>

<style scoped>
.form-container h2 {
  font-size: 10rem;
  line-height: 100%;
  text-align: center;
  white-space: break-spaces;
  margin-bottom: 1rem;
  position: absolute;
  left: 3%;
  top: 3%;
  /* transform: translateX(-50%); */
  color: rgb(55, 51, 78);
  -webkit-box-reflect: bottom;
}

.animated-obj {
  position: absolute;
  width: 3rem;
  aspect-ratio: 1;
  top: 10%;
  right: 10%;
  background: rgb(160, 149, 232);
  color: rgb(132, 122, 194);
  box-shadow: 0.2rem 0.1rem 0rem;
  offset-path: path("M 200 0 A 200 200 0 1 0 -200 0 A 200 200 0 1 0 200 0");

  animation: firefly 10s linear infinite;
  transform-style: preserve-3d;
  z-index: 6;
  overflow: visible;
}

.animated-obj::after {
  position: absolute;
  content: "";
  width: 3rem;
  height: 3rem;
  top: 100%;
  offset-path: path("M 100 0 A 100 100 0 1 0 -100 0 A 100 100 0 1 0 100 0");

  background: var(--sign-option-signup);
  color: var(--sign-option-signup-darker);
  box-shadow: 0.2rem 0.1rem 0rem;
  animation: firefly 12s linear infinite backwards;
}
@keyframes firefly {
  0% {
    offset-distance: 0%;
    offset-rotate: 0deg;
    transform: rotateZ(0deg);
  }

  100% {
    offset-distance: 100%;
    offset-rotate: 360deg;
    transform: rotateZ(360deg);
  }
}

#info {
  position: absolute;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* background: rgba(128, 128, 128, 0.077); */
  background: linear-gradient(70deg, #d9eef81b 20%, #ffdfe3db 100%);
  height: 100%;
}

#info h3 {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.5rem;
  color: white;
  padding: 1.5rem 3rem;
  border: solid 2px rgb(255, 0, 64);
  background: rgb(255, 0, 64);
  border-radius: 40px;
}

#info h4 {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  color: rgba(129, 117, 158, 0.486);
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

#info h4:hover {
  color: rgb(141, 104, 211);
}

.info-text {
  margin-top: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: visible;
  align-self: center;
  align-items: center;
  justify-content: center;
  /* height: 100%; */
}

.info-text p {
  font-size: 1.8rem;
  font-weight: 400;
  width: 60%;
  max-width: 60rem;
  border-radius: 40px;
  padding: 2rem;
  margin: 1rem 1rem;
  background: rgb(254, 252, 255);
  border: solid rgba(255, 255, 255, 0.7);

  text-align: center;
  hyphens: auto;
  line-clamp: 6;
  text-anchor: center;
  align-content: center;
  white-space-collapse: preserve-breaks;
  position: relative;
  overflow: visible;
}

@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
.info-text p:before,
.info-text p:after {
  position: absolute;
  content: "";
  inset: -0.1rem;

  border-radius: 40px;
  background: conic-gradient(
    from var(--angle),
    rgb(255, 0, 68),
    rgb(255, 255, 255) /* rgb(255, 0, 68) */
  );
  background-size: 500% 500%;
  animation: border-glow 4s linear infinite;

  z-index: -7;
  overflow: visible;
}

.info-text p:after {
  filter: blur(6px);
  z-index: -6;
}

@keyframes border-glow {
  0% {
    --angle: 360deg;
  }
  100% {
    --angle: 0deg;
  }
}

.info-text p span {
  font-size: 1.8rem;
  text-decoration: underline;
  font-size: 600;
  color: rgb(255, 0, 51);
}

.form-container {
  background: linear-gradient(70deg, #d9eef81b 20%, #e7dfffdb 100%);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: center;

  padding: 6rem 0rem;
  border-radius: 80px;
  background: rgb(95, 48, 197);
  box-shadow: 0.6rem 0.6rem 0.6rem rgb(180, 171, 214);
  z-index: 5;

  transition: all 0.5s ease;
}

.form.login {
  background: var(--sign-option-login);
}
.form.signup {
  background: var(--sign-option-signup);
}

.card {
  width: 80vw;
  max-width: 50rem;
  display: flex;
  flex-direction: column;
  border: solid rgba(159, 142, 255, 0.736);
  border: none;
  border-radius: 40px;
  background: transparent;
  transition: border-color 0.3s ease;
  color: white;
}

#section-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 11rem 0rem 11rem;
}

.wrapper-dialog-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
  flex: 1;
  /* border: solid; */
}

#dialog-toggle {
  width: 5.7rem;
  height: 3.2rem;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  /* border: solid 2px rgb(202, 202, 202); */
  background: rgb(244, 244, 244);
}

.sign-option {
  height: 100%;
  aspect-ratio: 1;
  border-radius: 30px;
  background-color: var(--sign-option-signup);
  border-bottom: solid 3px var(--sign-option-signup-darker);
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  left: 0%;
}

.sign-option.other {
  left: 50%;
  /* justify-self: right; */
  background-color: var(--sign-option-login);
  border-bottom: solid 3px var(--sign-option-login-darker);
}

#submit-button {
  text-decoration: none;
  font-size: 3.5rem;
  border: none;
  background: none;
  font-weight: bolder;
  flex: 1;
  color: inherit;
  cursor: pointer;
  /* border: solid; */
}

#submit-button:hover {
  color: rgb(195, 56, 100);
}

#submit-button:active {
  background-color: rgba(43, 226, 147, 0.266);
}
input {
  margin: 0.5rem 0rem 1rem 0rem;
  align-self: center;
  width: 70%;
  border-radius: 20px;
  background: transparent;
  outline: solid rgb(239, 239, 239);
  border: none;
  caret-shape: bar;
  padding-left: 1rem;
  font-size: 2rem;
  color: white;
  height: 3.5rem;
}

input::placeholder {
  color: rgb(232, 232, 232);
  font-size: 2rem;
  justify-self: center;
}
input:focus::placeholder {
  color: transparent;
}

input:focus,
input:hover {
  background: rgba(197, 229, 255, 0.371);
}
input:invalid {
  outline-color: var(--dialog-button-color-delete-darker);
}
input:focus:valid {
  outline-color: rgb(0, 255, 195);
}

input:last-child {
  margin-bottom: 1.5rem;
}

label {
  font-size: 2.5rem;
  font-weight: 500;
  text-align: center;
  align-content: center;
  /* display: none; */
}

.gottenError-desc,
#close-dialog {
  font-size: 3rem;
}

.form-container .presets {
  position: absolute;
  bottom: 1%;
  display: flex;
  flex-direction: column;
  align-self: center;
  /* width: 50rem; */
  width: 80vw;
  max-width: 50rem;
  padding: 1rem 2rem;
  border: solid rgba(159, 142, 255, 0.138);
  border-radius: 30px;
  background: transparent;
  font-size: 1.5rem;
  font-weight: 500;
  color: inherit;
  offset-anchor: top;

  transition: all 0.3s ease;
}

.presets span,
.presets h3 {
  padding-inline: 1rem;
}

.presets span.hidden {
  display: none;
}

.presets span:nth-child(3) {
  margin-bottom: 0.5rem;
}

@media screen and (max-width: 500px) {
  .form-container .presets {
    bottom: 5%;
  }
}
</style>
