<template>
  <div class="main-banner">
    <h1>About</h1>
  </div>
</template>

<script setup lang="ts">

defineOptions({
  name: 'AboutComponent',
});

</script>

<style scoped>
.main-banner {
  background-color: #4caf50;
  /* Green color */
  height: 33vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
}
</style>
