<template>
  <div class="container">
    <section class="card-content" v-if="$slots.title">
      <slot name="title" class="title">
        <h2>Titolo</h2>
      </slot>
      <slot name="description" class="description">
        <p>Ipse dixit descritione</p>
      </slot>
    </section>
    <section class="card-type">
      <slot name="button">
        <button>Press me</button>
      </slot>
    </section>
  </div>
</template>

<script>
export default {};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: row;
  box-shadow: 1rem 1rem 3rem grey;
  border-radius: 20px;
  font-size: 3rem;
}

.card-content {
  display: flex;
  flex-direction: column;
  background-color: azure;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.card-type {
  background-color: transparent;
  flex: 1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

input {
  font-size: 3rem;
  height: 5rem;
}
</style>
