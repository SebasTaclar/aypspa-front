<template>
  <main class="home-main">
    <section class="section">
      <MainBanner />
    </section>
    <section id="offerings" class="section offset">
      <Offerings />
    </section>
    <section class="section offset">
      <About />
    </section>
    <section class="section offset">
      <Contact />
    </section>
  </main>
</template>

<script setup lang="ts">
import MainBanner from '@/components/MainBanner.vue';
import Offerings from '@/components/Offerings.vue';
import About from '@/components/About.vue';
import Contact from '@/components/Contact.vue';

defineOptions({
  name: 'HomeView',
});

</script>

<style scoped>
.home-main {
  padding-top: 60px;
  background-color: transparent;
}

.section {
  padding: 0.1px 0 0 0;
  border-bottom: 1px solid #ccc;
  /* Light gray color for separation */
}

.section:last-child {
  border-bottom: none;
}

.offset {
  padding-top: 60px;
  /* Adjust this value to match the height of your fixed navbar */
  margin-top: -60px;
  /* Negative margin to offset the added padding */
}
</style>
