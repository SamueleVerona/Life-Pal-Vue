<template>
  <router-link to="/users"></router-link>
  <section class="container">
    <form @submit.prevent="submit" class="form">
      <base-card class="card">
        <template #title>
          <label for="email">Type in your email</label>
          <input type="email" name="email" id="email" v-model="userName" />
        </template>
        <template #description>
          <label for="password">Type in your password</label>

          <input type="text" name="password" id="password" v-model="userPwd" />
        </template>
        <template #button>
          <button>Sign up</button>
        </template>
      </base-card>
    </form>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref } from "vue";

const router = useRouter();
const store = useStore();

const userName = ref("");
const userPwd = ref("");

function submit() {
  router.push("/home");
  store.dispatch("userLogin", {
    email: userName.value,
    password: userPwd.value,
  });
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
button {
  text-orientation: sideways;
  height: 100%;
  width: 100%;
  background: rgba(43, 226, 147, 0.879);
  border: none;
  font-size: 3rem;
}
button:active {
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
</style>
