<template>
  <section class="section">
    <section
      class="section__disclaimer"
      @mousedown="infoClosed = true"
      v-if="!infoClosed"
    >
      <h3 class="disclaimer__title">Before you start</h3>
      <div class="disclaimer__text-container">
        <p class="disclaimer__text-card">
          I've pre-set two "locked" accounts which have full functionality but
          cannot be deleted. <br />
          You can enter both with the credentials i provide or you can create a
          new one.
        </p>
        <p class="disclaimer__text-card">
          Keep in mind that this is a demo app for front-end WebDev so security
          measures are basic. <br />
          <span class="text--stressed">Don't put any personal info.</span>
          <br />
          Use a fictional email instead like "user@email.com"
        </p>
      </div>
    </section>
    <section class="section__sign" v-if="infoClosed">
      <h2 class="section__logo">Life<br />Pal</h2>
      <div class="section__3d-obj"></div>
      <section
        @submit.prevent
        class="section__form-container"
        :class="{
          'submit-mode--login': mode === 'login',
          'submit-mode--signup': mode === 'signup',
        }"
      >
        <form class="form__card">
          <section class="form__input-section">
            <label for="email" class="form__label">Type in your email</label>
            <input
              type="email"
              name="email"
              class="form__input"
              v-model="userEmail"
              placeholder="user@email.com"
              minlength="11"
            />
            <label for="password" class="form__label"
              >Type in your password</label
            >
            <input
              type="text"
              name="password"
              class="form__input"
              placeholder="password"
              minlength="6"
              v-model="userPwd"
            />
          </section>
          <section class="form__submit-section" @mousedown="handleControls">
            <button class="btn--action-submit" data-button-id="sign-submit">
              {{ mode }}
            </button>
            <div class="toggle__container">
              <div class="toggle">
                <div class="toggle__switch switch-mode--signup" inert></div>
              </div>
            </div>
          </section>
        </form>
      </section>
      <div class="section__presets">
        <h3 class="presets__title">Presets</h3>
        <span class="presets__credential">email: "john.smith@email.com"</span>
        <span class="presets__credential">password: "password"</span>
        <hr />
        <span class="presets__credential">email: "jane.doe@email.com"</span>
        <span class="presets__credential">password: "passphrase"</span>
      </div>
    </section>
    <base-dialog
      :errorMessage="errorMessage"
      :show="!!errorMessage"
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
const errorMessage = ref(null);

const infoClosed = ref(false);

const router = useRouter();

function closeDialog() {
  errorMessage.value = false;
}

function handleControls(e) {
  const target = e.target;

  const isValidTarget = target.classList.contains("toggle");
  const isSubmitBtn = target.dataset.buttonId === "sign-submit";
  const isLogin = mode.value === "login";

  if (isValidTarget) {
    target.firstElementChild.classList.toggle("switch-mode--signup");

    isLogin ? (mode.value = "signup") : (mode.value = "login");
  } else if (isSubmitBtn && userEmail.value && userPwd.value) submit();
  else {
    errorMessage.value =
      "Your credentials can not be empty.\nPlease enter a valid email and password\n(at least 6 characters)";
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
    errorMessage.value = err.message;
  }
}
</script>

<style lang="scss" scoped>
* {
  font-family: "Roboto Regular", sans-serif;
}

@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.section__disclaimer {
  position: absolute;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(70deg, #d9eef81b 20%, #ffdfe3db 100%);
  height: 100%;

  .disclaimer__title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3.5rem;
    color: white;
    padding: 1.5rem 3rem;
    background: rgb(255, 0, 64);
    border-radius: 40px;
    box-shadow: 0.2rem 0.5rem 0.5rem rgb(164, 75, 88);
    position: relative;
    cursor: pointer;

    &:before {
      content: "got it";
      width: 100%;
      height: 100%;
      color: inherit;
      background: inherit;
      border-radius: inherit;
      position: absolute;
      text-align: center;
      align-content: center;
      opacity: 0;
      transition: all 0.2s ease;
      transform: rotateX(0deg);
      backface-visibility: hidden;
    }

    &:hover:before {
      opacity: 1;
      background-color: darken(rgb(255, 0, 64), 10%);
    }
  }

  .disclaimer__text-container {
    margin-top: 0.5rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    overflow: visible;
    align-self: center;
    align-items: center;
    justify-content: center;

    .disclaimer__text-card {
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

      &::before,
      &::after {
        position: absolute;
        content: "";
        inset: -0.1rem;

        border-radius: 40px;
        background: conic-gradient(
          from var(--angle),
          rgb(255, 0, 68),
          rgb(255, 255, 255)
        );
        background-size: 500% 500%;
        animation: border-glow 4s linear infinite;
        z-index: -7;
        overflow: visible;

        @keyframes border-glow {
          0% {
            --angle: 360deg;
          }
          100% {
            --angle: 0deg;
          }
        }
      }

      &::after {
        filter: blur(6px);
        z-index: -6;
      }

      .text--stressed {
        font-size: 1.8rem;
        text-decoration: underline;
        font-size: 600;
        color: rgb(255, 0, 51);
      }
    }
  }
}

.section__sign {
  background: linear-gradient(70deg, #d9eef81b 20%, #e7dfffdb 100%);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .section__logo {
    font-size: 10rem;
    line-height: 100%;
    text-align: center;
    white-space: break-spaces;
    margin-bottom: 1rem;
    position: absolute;
    left: 3%;
    top: 3%;
    color: rgb(55, 51, 78);
    -webkit-box-reflect: bottom;
  }

  .section__3d-obj {
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

    &::after {
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
  }
  .section__form-container {
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

    &.submit-mode--login {
      background: var(--sign-option-login);
    }

    &.submit-mode--signup {
      background: var(--sign-option-signup);
    }

    .form__card {
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

      .form__input-section {
        display: flex;
        flex-direction: column;

        .form__label {
          font-size: 2.2rem;
          font-weight: 500;
          text-align: center;
          align-content: center;
          padding: 0.8rem 0rem;
        }

        .form__input {
          margin: 0.6rem 0rem 1rem 0rem;
          align-self: center;
          width: 60%;
          border-radius: 20px;
          background: transparent;
          outline: solid rgb(239, 239, 239);
          border: none;
          caret-shape: bar;
          padding-left: 1rem;
          font-size: 2rem;
          color: white;
          height: 3.2rem;

          &::placeholder {
            color: rgb(232, 232, 232);
            font-size: 2rem;
            justify-self: center;
          }

          &:focus {
            &::placeholder {
              color: transparent;
            }
            &:valid {
              outline-color: rgb(0, 255, 195);
            }
          }

          &:focus,
          &:hover {
            background: rgba(197, 229, 255, 0.371);
          }

          &:invalid {
            outline-color: var(--dialog-button-color-delete-darker);
          }
        }
      }

      .form__submit-section {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem 11rem 0rem 11rem;

        .btn--action-submit {
          text-decoration: none;
          font-size: 3.5rem;
          border: none;
          background: none;
          font-weight: bolder;
          flex: 1;
          color: inherit;
          cursor: pointer;

          &:hover {
            color: rgb(224, 26, 89);
          }
        }

        .toggle__container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-left: 1rem;
          flex: 1;

          .toggle {
            width: 5.7rem;
            height: 3.2rem;
            border-radius: 30px;
            align-items: center;
            justify-content: center;
            padding: 0.3rem;
            background: rgb(244, 244, 244);

            .toggle__switch {
              height: 100%;
              aspect-ratio: 1;
              border-radius: 30px;
              background-color: var(--sign-option-signup);
              border-bottom: solid 3px var(--sign-option-signup-darker);
              transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
              position: relative;
              left: 0%;

              &.switch-mode--signup {
                left: 50%;
                background-color: var(--sign-option-login);
                border-bottom: solid 3px var(--sign-option-login-darker);
              }
            }
          }
        }
      }
    }
  }
  .section__presets {
    position: absolute;
    bottom: 2%;
    display: flex;
    flex-direction: column;
    align-self: center;
    min-width: max-content;
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
    & .presets__credential,
    & .presets__title {
      padding-inline: 1rem;
    }

    &.presets__credential:nth-child(3) {
      margin-bottom: 0.5rem;
    }

    @media screen and (max-width: 500px) {
      bottom: 5%;
    }
  }
}
</style>
