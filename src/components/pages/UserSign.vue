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
        <section
          class="section__presets"
          :class="{
            'submit-mode--signup': mode === 'signup',
          }"
          inert
        >
          <span class="presets__credential">email: 'john.smith@email.com'</span>
          <span class="presets__credential">password: 'password'</span>

          <span class="presets__credential">email: 'jane.doe@email.com'</span>
          <span class="presets__credential">password: 'passphrase'</span>
        </section>
      </section>
    </section>
    <base-dialog
      :errorMessage="errorMessage"
      :show="!!errorMessage"
      @close="closeDialog"
      :wrapperBackground="`var(--warning)`"
      :buttonBackground="`var(--confirm-default)`"
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

  const isToggle = target.classList.contains("toggle");
  const isSubmitBtn = target.dataset.buttonId === "sign-submit";
  const isLogin = mode.value === "login";

  if (!isToggle && !isSubmitBtn) return;

  if (isToggle) {
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
  font-family: var(--font-stack);
}
@mixin vertical-flex {
  display: flex;
  flex-direction: column;
}

@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.section__disclaimer {
  @include vertical-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 2rem;
  background: linear-gradient(70deg, #d9eef81b 20%, #ffdfe3db 100%);

  .disclaimer__title {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 60%;
    max-width: 60rem;
    min-height: max-content;
    padding: 1.5rem 3rem;
    margin-bottom: 2rem;
    text-align: center;

    font-size: 3rem;
    color: var(--confirm-default);
    background: rgb(255, 0, 64);
    border-radius: 40px;
    box-shadow: 0.2rem 0.5rem 0.5rem rgb(164, 75, 88);
    cursor: pointer;

    &:before {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      width: 100%;
      height: 100%;
      content: "got it";
      color: inherit;
      text-align: center;
      background: inherit;
      border-radius: inherit;
      opacity: 0;
      transition: all 0.2s ease;
    }

    &:hover:before {
      opacity: 1;
      background-color: darken(rgb(255, 0, 64), 10%);
    }
  }

  .disclaimer__text-container {
    display: contents;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-top: 0.5rem;
    padding: 0.5rem;
    overflow: visible;
    border-radius: 40px;

    .disclaimer__text-card {
      position: relative;
      width: 80%;
      max-width: 60rem;
      height: 20rem;
      padding: 2rem;
      margin: 0.5rem 0rem;
      overflow: visible;
      font-size: 1.8rem;
      font-weight: 600;
      text-align: center;
      hyphens: auto;
      line-clamp: 6;
      text-anchor: center;
      align-content: center;
      white-space-collapse: preserve-breaks;

      border-radius: 40px;
      background: rgb(254, 252, 255);
      border: solid rgba(255, 255, 255, 0.7);

      @media screen and (max-width: 500px) {
        width: 80%;
      }

      &::before,
      &::after {
        position: absolute;
        inset: -0.1rem;
        z-index: -7;
        content: "";
        overflow: visible;

        border-radius: 40px;
        background: conic-gradient(
          from var(--angle),
          rgb(255, 0, 68),
          rgb(255, 255, 255)
        );
        background-size: 500% 500%;
        will-change: background;
        animation: border-glow 4s linear infinite;

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
        font-size: 2rem;
        text-decoration: underline;
        font-weight: 600;
        color: rgb(255, 0, 51);
      }
    }
  }
}

.section__sign {
  @include vertical-flex;

  align-items: center;
  justify-content: center;
  position: relative;
  height: 100dvh;
  overflow: hidden;
  background: linear-gradient(70deg, #d9eef81b 20%, #e7dfffdb 100%);

  .section__logo {
    position: absolute;
    left: 3%;
    top: 3%;
    margin-bottom: 1rem;

    font-size: 12rem;
    font-weight: 700;
    line-height: 100%;
    text-align: center;
    white-space: break-spaces;
    color: rgb(55, 51, 78);
    background: linear-gradient(
      to bottom,
      var(--theme-primary-dark) 25%,
      var(--theme-primary-light)
    );

    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    filter: brightness(95%);
  }

  .section__3d-obj {
    position: absolute;
    top: 10%;
    right: 10%;
    width: 3rem;
    aspect-ratio: 1;
    z-index: 4;
    overflow: visible;

    color: var(--theme-primary-dark);
    background: var(--theme-primary-light);
    box-shadow: 0.2rem 0.1rem 0rem;

    offset-path: path("M 200 0 A 200 200 0 1 0 -200 0 A 200 200 0 1 0 200 0");
    animation: firefly 10s linear infinite;
    transform-style: preserve-3d;

    &::after {
      position: absolute;
      top: 100%;
      width: 3rem;
      height: 3rem;

      content: "";
      color: var(--theme-secondary-dark);
      offset-path: path("M 100 0 A 100 100 0 1 0 -100 0 A 100 100 0 1 0 100 0");

      background: var(--theme-secondary-light);
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
    @include vertical-flex;

    justify-content: space-between;
    align-items: center;
    justify-self: center;
    position: relative;
    overflow: visible;
    z-index: 6;
    padding: 6rem 0rem;

    border-radius: 80px;
    background: rgb(95, 48, 197);
    box-shadow: 0rem 0.6rem 0.6rem rgba(0, 0, 0, 0.229),
      0rem 12rem 0rem var(--theme-primary-light),
      0rem 12.5rem 0.6rem rgba(0, 0, 0, 0.229);

    transition: all 0.5s ease;

    &.submit-mode--login {
      background: var(--theme-primary-mid);
    }

    &.submit-mode--signup {
      background: var(--theme-secondary-mid);
      box-shadow: 0rem 0.6rem 0.6rem rgba(0, 0, 0, 0.229);

      .section__presets {
        bottom: -11rem;
        opacity: 0;
      }
    }

    .form__card {
      @include vertical-flex;

      width: 80vw;
      max-width: 50rem;
      color: var(--confirm-default);
      border: solid rgba(159, 142, 255, 0.736);
      border: none;
      border-radius: 40px;
      background: transparent;
      transition: border-color 0.3s ease;

      @media screen and(max-width:500px) {
        min-width: 90vw;
        max-width: 95vw;
      }

      .form__input-section {
        @include vertical-flex;

        color: var(--confirm-default);

        .form__label {
          padding: 0.8rem 0rem;
          align-content: center;
          font-size: 3rem;
          font-weight: 500;
          text-align: center;
          color: inherit;
        }

        .form__input {
          align-self: center;
          width: 60%;
          height: 3.2rem;
          margin: 0.6rem 0rem 1rem 0rem;
          padding-left: 1rem;

          font-size: 2.3rem;
          font-weight: 500;
          color: var(--confirm-default);
          caret-shape: bar;
          border: none;
          border-radius: 20px;
          background: transparent;
          outline: 2px solid rgb(239, 239, 239);

          &::placeholder {
            color: rgb(232, 232, 232);
            font-size: 2.3rem;
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
            outline-color: var(--confirm-delete-hover);
          }
        }
      }

      .form__submit-section {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-auto-rows: auto;
        padding: 1rem 0rem 0rem 0rem;
        z-index: 6;
        color: var(--confirm-default);

        @media screen and(max-width:500px) {
          padding: 1rem 6rem 0rem 6rem;
        }

        .btn--action-submit {
          justify-self: flex-end;
          overflow: visible;
          font-size: 5rem;
          font-weight: bolder;
          text-decoration: none;
          color: inherit;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.15s ease;

          &:hover {
            color: rgb(224, 26, 89);
          }
        }

        .toggle__container {
          @include vertical-flex;

          justify-content: center;
          align-items: flex-start;
          margin-left: 1rem;
          overflow: visible;

          .toggle {
            width: 5.7rem;
            height: 3.2rem;
            padding: 0.3rem;
            transform: translateY(25%);
            margin-left: 4rem;
            border-radius: 30px;
            background: rgb(244, 244, 244);

            .toggle__switch {
              position: relative;
              left: 0%;
              height: 100%;
              aspect-ratio: 1;
              border-radius: 30px;
              background-color: var(--theme-secondary-mid);
              border-bottom: solid 3px var(--theme-secondary-dark);
              transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);

              &.switch-mode--signup {
                left: 50%;
                background-color: var(--theme-primary-mid);
                border-bottom: solid 3px var(--theme-primary-dark);
              }
            }
          }
        }
      }
    }
    .section__presets {
      @include vertical-flex;

      align-items: center;
      justify-content: flex-end;
      align-self: center;
      position: absolute;
      bottom: -12rem;
      z-index: 7;
      width: 80vw;
      max-width: 50rem;
      aspect-ratio: 1;
      padding: 1rem 5rem;
      font-size: 1.8rem;
      font-weight: 400;
      line-height: 2.5rem;
      font-weight: 600;
      opacity: 1;
      border-radius: 80px;
      background: transparent;
      transition: all 0.4s ease;

      @media screen and(max-width:500px) {
        min-width: 90vw;
        max-width: 95vw;
      }
      .presets__credential,
      .presets__title {
        color: var(--confirm-default);
        padding-inline: 1rem;
      }
      .presets__credential:nth-child(2) {
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
