<template>
  <router-link to="/userSign"></router-link>
  <section class="container">
    <form @submit.prevent class="form">
      <base-card class="card">
        <template #title>
          <label for="email">Type in your email</label>
          <input type="email" name="email" id="email" v-model="userName" />
        </template>
        <template #description>
          <label for="password">Type in your password</label>
          <input type="text" name="password" id="password" v-model="userPwd" />
          <button id="submit-button" @click="submit">Confirm</button>
        </template>
        <template #button>
          <button
            class="sign-option"
            :class="{ 'option-on': isSignup, 'option-off': !isSignup }"
            @click="signUp"
          >
            Sign up
          </button>
          <button
            class="sign-option"
            :class="{ 'option-on': isLogin, 'option-off': !isLogin }"
            @click="logIn"
          >
            Log In
          </button>
        </template>
      </base-card>
    </form>
  </section>
  <base-dialog
    :message="gottenError"
    :show="!!gottenError"
    @close="closeDialog"
  ></base-dialog>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const store = useStore();
const isSignup = ref(true);
const isLogin = ref(false);
const userName = ref("");
const userPwd = ref("");
const gottenError = ref(null);

const router = useRouter();

function closeDialog() {
  gottenError.value = false;
}

function signUp() {
  isSignup.value = true;
  isLogin.value = false;
}
function logIn() {
  isLogin.value = true;
  isSignup.value = false;
}

const mode = computed(function () {
  if (isSignup.value && !isLogin.value) return "signUp";
  else {
    return "logIn";
  }
});

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
#container,
.form {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 50rem;
  height: 25rem;
  display: flex;
}

#submit-button {
  font-size: 2rem;
  height: 5rem;
  padding: 1rem 0;
  border: none;
  background: rgba(255, 223, 65, 0.879);
  font-weight: bolder;
}

.sign-option {
  text-orientation: sideways;
  height: 100%;
  width: 20%;
  background: rgba(43, 226, 147, 0.879);
  border: none;
  font-size: 3rem;
}

#submit-button:active {
  background-color: rgba(43, 226, 147, 0.266);
}
input {
  margin: 1rem 1rem;
  border-radius: 20px;
  background: rgba(255, 129, 112, 0.897);
  border: none;
}
input:focus {
  background: rgba(112, 191, 255, 0.371);
}

input,
label {
  font-size: 3rem;
  line-height: 5rem;
  height: 5rem;
}

label {
  text-align: center;
}

.option-on {
  background: rgb(69, 255, 162);
}
.option-off {
  background: rgb(222, 222, 222);
}
.gottenError-desc,
#close-dialog {
  font-size: 3rem;
}
</style>
