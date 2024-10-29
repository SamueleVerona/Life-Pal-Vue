<template>
  <div class="card">
    <section class="card-content" v-if="$slots.title">
      <slot name="title" class="title">
        <h2>Titolo</h2>
      </slot>
      <slot name="description" class="description">
        <p>Ipse dixit descritione</p>
      </slot>
    </section>
    <section class="card-type">
      <base-button>
        <template v-slot:button></template>
      </base-button>
    </section>
  </div>
</template>

<script>
export default {};
</script>
<style scoped>
.card {
  display: flex;
  flex-direction: row;
  box-shadow: 1rem 1rem 3rem grey;
  background: transparent;
  border-radius: 20px;
}

.card-content {
  display: flex;
  flex-direction: column;
  background-color: azure;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border: solid rgba(0, 0, 0, 0.188) 2px;
  width: 25rem;
  height: 30rem;
}

.card-type {
  background-color: rgb(43, 226, 147);
  width: 6rem;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>
