<template>
  <section id="servicios-ayp" class="services-section">
    <p class="section-title-1">Arriendo de herramientas de construccion</p>
    <h2 class="section-title">ESTOS SON NUESTROS SERVICIOS EN ARRIENDO</h2>
    <div class="service-grid">
      <div class="service-card">
        <img src="/images/andamio.png" alt="Andamios">
        <h3>ARRIENDO DE ANDAMIOS</h3>
        <p>Andamios en General</p>
      </div>
      <div class="service-card">
        <img src="/images/GENERADORES2.png" alt="Generadores">
        <h3>GENERADORES DE ENERGÍA</h3>
        <p>Generadores de 2200 Watts a 11000 Watts</p>
      </div>
      <div class="service-card">
        <img src="/images/trompo.png" alt="Trompos">
        <h3>ARRIENDO DE TROMPOS</h3>
        <p>Trompos de 130 litros a 250 litros</p>
      </div>
    </div>
    <!--   <h2 class="section-title">TAMBIÉN OFRECEMOS SERVICIOS DE:</h2> -->
    <div class="service-grid">
      <div class="service-card">
        <img src="/images/placa_compacta.jpg" alt="Placas Compactadoras">
        <h3>PLACAS COMPACTADORAS</h3>
        <p>Placa compactadora Rev 7.5hp 30kn Mtr Robn</p>
      </div>
      <div class="service-card">
        <img src="/images/cortadora_pav.jpg" alt="Cortadora de Pavimento">
        <h3>CORTADORA DE PAVIMENTO</h3>
        <p>Bencinera 15hp 16-20" GEWILSON GFS480G</p>
      </div>
      <div class="service-card">
        <img src="/images/alisador1.jpg" alt="Alisador de Pavimentos">
        <h3>ALISADOR DE PAVIMENTOS</h3>
        <p>48 7,5hp Gasolina S-120</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'OfferingsComponent',
});
</script>

<style scoped>
.services-section {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('/images/fondo3.jpg') center/cover no-repeat;
  padding: 60px 20px;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  color: white;
}

.section-title {
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 30px;
  text-transform: uppercase;
  font-weight: bold;
}

.section-title-1 {
  color: #ffffff;
  margin-bottom: 0px;
  text-transform: uppercase;
  font-weight: 10px;
}

.service-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 50px;
}

.service-card {
  background: rgba(255, 255, 255, 0.932);
  width: 280px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}

.service-card img {
  width: 100%;
  height: 170px;
  object-fit: cover;
}

.service-card h3 {
  margin: 15px 10px 5px;
  font-size: 1.1rem;
  color: #9B3B32;
}

.service-card p {
  margin: 0 10px 15px;
  font-size: 0.95rem;
  color: #333;
}





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
