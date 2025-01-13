<template>
  <div class="container">
    <section class="card-content" v-if="$slots.title">
      <slot name="title" class="title">
        <!-- <h2>Titolo</h2> -->
      </slot>
      <slot name="content" class="content">
        <p>Ipse dixit descritione</p>
      </slot>
      <slot name="options" class="content"></slot>
    </section>
    <slot name="button">
      <button>Press me</button>
    </slot>
  </div>
</template>

<style>
:root {
  --sign-option-login: rgb(105, 255, 200);
  --sign-option-login-darker: rgb(85, 211, 165);

  --sign-option-signup: rgb(94, 188, 255);
  --sign-option-signup-darker: rgb(71, 144, 197);
}
/* .container {
  box-shadow: 1rem 1rem 3rem grey;
  border-radius: 20px;
  font-size: 3rem;
} */

.card-content {
  display: flex;
  flex-direction: column;
}

input {
  font-size: 3rem;
  height: 5rem;
}
</style>
