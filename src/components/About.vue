<template>
  <section class="conocenos-section">
    <div class="overlay">
      <h4>Frutillar, Chile · Décima Región de Los Lagos</h4>
      <h2>CONÓCENOS</h2>

      <div class="cards-container">
        <div class="card" data-aos="fade-up" data-aos-delay="100">
          <i class="fas fa-tools icon-card"></i>
          <h3>¿Qué Hacemos?</h3>
          <p>Nuestra empresa arrienda equipos de maquinaria y andamios, y vende herramientas para construcción a nivel
            nacional.</p>
        </div>

        <div class="card" data-aos="fade-up" data-aos-delay="200">
          <i class="fas fa-users icon-card"></i>
          <h3>¿Quiénes Nos Conforman?</h3>
          <p>Brindamos servicios a grandes y pequeñas empresas. Nuestros aliados WESCO e ITAKA garantizan calidad.</p>
        </div>

        <div class="card" data-aos="fade-up" data-aos-delay="300">
          <i class="fas fa-handshake icon-card"></i>
          <h3>Nuestros Servicios</h3>
          <p>Atención personalizada, asesorías y servicio técnico, apoyando a microempresarios del sector construcción.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

defineOptions({
  name: 'AboutComponent',
});

</script>

<style scoped>
.conocenos-section {
  background: url(/images/img_constr.png) center/cover no-repeat;
  position: relative;
  padding: 60px 20px;
  color: #fff;
  overflow: hidden;
}

.conocenos-section .overlay {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 40px 20px;
  border-radius: 12px;
}

.conocenos-section h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
}

.conocenos-section h4 {
  text-align: center;
  font-weight: 400;
  font-size: 1rem;
  margin-bottom: 10px;
  color: #ccc;
}

.cards-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;
}

.card {
  background: #ffffff;
  color: #333;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  padding: 30px 20px;
  width: 300px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  text-align: center;
}

.card h3 {
  font-weight: 600;
  font-size: 1.2rem;
  margin: 10px 0 15px;
  border-bottom: 2px solid #e74c3c;
  padding-bottom: 5px;
}

.card p {
  font-size: 0.95rem;
  line-height: 1.5;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.icon-card {
  font-size: 2.2rem;
  color: #e74c3c;
  margin-bottom: 10px;
}


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
