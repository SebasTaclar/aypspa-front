<template>
  <div class="offerings">
    <div class="cards">
      <button class="card rent">
        <h2>Arriendo de maquinaria para construcción</h2>
        <p>
          Ofrecemos una amplia variedad de maquinaria para construcción en alquiler, garantizando
          equipos de alta calidad y rendimiento para sus proyectos.
        </p>
      </button>
      <button class="card sell">
        <h2>Venta de herramienta</h2>
        <p>
          Ofrecemos una amplia variedad de herramientas para construcción en venta, garantizando
          equipos de alta calidad y rendimiento para sus proyectos.
        </p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'OfferingsComponent',
});
</script>

<style scoped>
.offerings {
  background-color: rgba(34, 34, 34, 0.9);
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
  overflow: hidden;
}

.cards {
  display: flex;
  justify-content: center;
  gap: 3rem;
  height: 80%;
}

.card {
  border: 2px solid white;
  padding: 1rem;
  border-radius: 8px;
  color: rgb(19, 18, 18);
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition:
    background-color 0.3s,
    color 0.3s;
  width: 30%;
}

.rent {
  background-image: url('/images/rent_building_banner.png');
  background-size: cover;
}

.sell {
  background-image: url('/images/sell_tools_banner.png');
  background-size: contain;
}

.card h2 {
  margin: 0;
  font-family: 'Bricolage Grotesque', sans-serif;
}

.card p {
  margin: 0.5rem 0;
  font-family: 'Bricolage Grotesque', sans-serif;
}

.card:hover {
  background-color: rgba(23, 24, 26, 0.8);
  background-image: none;
  color: white;
}
</style>
