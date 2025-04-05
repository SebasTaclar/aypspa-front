<template>
  <div class="main-banner">
    <h1>Contact</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContactView',
})
</script>

<style scoped>
.main-banner {
  background-color: #c5a025; /* Blue color */
  height: 33vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
}
</style>
