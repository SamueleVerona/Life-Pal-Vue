<template>
  <router-link to="/userSign"></router-link>
  <section class="container">
    <form @submit.prevent class="form">
      <base-card class="card">
        <template #title> </template>
        <template #content>
          <label for="email">Type in your email</label>
          <input
            type="email"
            name="email"
            id="email"
            v-model="userName"
            placeholder="@email"
          />
          <label for="password">Type in your password</label>

          <input
            type="text"
            name="password"
            id="password"
            placeholder="password"
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
  </section>
  <base-dialog
    :errorMessage="gottenError"
    :show="!!gottenError"
    @close="closeDialog"
  ></base-dialog>
</template>

<script setup>
import { useStore } from "vuex";
import { ref } from "vue";
import { useRouter } from "vue-router";

const store = useStore();
const userName = ref("");
const userPwd = ref("");
const gottenError = ref(null);

const router = useRouter();

function closeDialog() {
  gottenError.value = false;
}

function handleControls(e) {
  const target = e.target;
  const isValidTarget = target.id.includes("dialog-toggle");

  const isSubmitBtn = target.id.includes("submit");

  console.log(isSubmitBtn);
  const isLogin = mode.value === "login";

  if (isValidTarget) {
    target.firstElementChild.classList.toggle("other");

    isLogin ? (mode.value = "signup") : (mode.value = "login");
  } else if (isSubmitBtn) submit();
  else {
    return;
  }
}

const mode = ref("login");

async function submit() {
  try {
    await store.dispatch(mode.value, {
      email: userName.value,
      password: userPwd.value,
    });

    router.push({
      name: "user-home",
      params: { userId: userName.value },
      meta: { isAuth: true },
    });
  } catch (err) {
    gottenError.value = err.message;
  }
}
</script>

<style scoped>
.container {
  background: linear-gradient(70deg, #d9eef81b 20%, #e7dfffdb 100%);
}
.form {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 50rem;
  display: flex;
  flex-direction: column;
  border: solid rgba(159, 142, 255, 0.736);
  border-radius: 40px;
  background: transparent;
}

#section-buttons {
  display: flex;
  justify-content: center;
  border-top: solid 1px rgb(235, 235, 235);
}

.wrapper-dialog-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
}

#dialog-toggle {
  width: 6rem;
  height: 3.5rem;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border: solid 2px rgb(202, 202, 202);
  background: rgb(244, 244, 244);
}

.sign-option {
  height: 100%;
  width: 50%;
  border-radius: 30px;
  background-color: var(--sign-option-login);
  border-bottom: solid 3px var(--sign-option-login-darker);
  align-self: center;
}

#submit-button {
  min-width: 12rem;
  font-size: 3rem;
  padding: 1.5rem 0;
  border: none;
  background: none;
  font-weight: bolder;
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
  border: solid 2px rgb(169, 169, 169);
  height: max-content;
  caret-shape: bar;
  padding-left: 1rem;
  font-size: 2.5rem;
}
input::placeholder {
  color: rgb(183, 183, 183);
}

input:focus,
input:hover {
  background: rgba(197, 229, 255, 0.371);
  outline-color: rgb(0, 255, 195);
}

label {
  font-size: 3rem;
  font-weight: 500;
  text-align: center;
  align-content: center;
}

.other {
  justify-self: right;
  background-color: var(--sign-option-signup);
  border-bottom: solid 3px var(--sign-option-signup-darker);
}

.gottenError-desc,
#close-dialog {
  font-size: 3rem;
}
</style>
