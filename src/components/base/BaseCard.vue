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
.card-content {
  display: flex;
  flex-direction: column;
}

input {
  font-size: 3rem;
  height: 5rem;
}
</style>
