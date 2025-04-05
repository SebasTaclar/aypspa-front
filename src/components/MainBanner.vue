<template>
  <div class="main-banner">
    <div class="content">
      <h1>ARRIENDO DE HERRAMIENTAS PARA CONSTRUCCION</h1>
      <div class="button-container">
        <button @click="scrollToOfferings">Conozca nuestros servicios</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainBannerView',
  methods: {
    scrollToOfferings() {
      const offeringsSection = document.getElementById('offerings')
      if (offeringsSection) {
        offeringsSection.scrollIntoView({ behavior: 'smooth' })
      }
    },
  },
})
</script>

<style scoped>
.main-banner {
  background-color: #fffdd0;
  background-image: url('/images/main_banner.png');
  background-size: contain;
  background-position: center;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 2rem;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-items: center;
}

.button-container {
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #333;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Bricolage Grotesque', sans-serif;
}

button:hover {
  background-color: #7d8083;
}
</style>
