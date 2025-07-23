<template>
  <section class="contacto-section" id="contacto">
    <div class="container-contacto">
      <h2 data-aos="fade-up">CONTÁCTANOS</h2>
      <p class="subtexto" data-aos="fade-up" data-aos-delay="100">
        Si estás interesado en alguno de nuestros productos
      </p>

      <div class="contacto-grid">
        <!-- IZQUIERDA: INFO DE CONTACTO -->
        <div class="info-contacto">
          <div class="card-contacto" data-aos="fade-right">
            <i class="fas fa-user icon"></i>
            <strong>Fono Yonatan Oyarzo:</strong><br>+56 987 531 754
          </div>
          <div class="card-contacto" data-aos="fade-right" data-aos-delay="100">
            <i class="fas fa-user icon"></i>
            <strong>Fono Pamela Mansilla Ruiz:</strong><br>+56 993 013 623
          </div>
          <div class="card-contacto" data-aos="fade-right" data-aos-delay="200">
            <i class="fas fa-phone icon"></i>
            <strong>Fono Fijo:</strong><br>65-2-421931
          </div>
          <div class="card-contacto" data-aos="fade-right" data-aos-delay="300">
            <i class="fas fa-envelope icon"></i>
            <strong>Email 1:</strong><br>yonatan.8587@gmail.com
          </div>
          <div class="card-contacto" data-aos="fade-right" data-aos-delay="400">
            <i class="fas fa-envelope icon"></i>
            <strong>Email 2:</strong><br>pamenicoruiz@gmail.com
          </div>
          <div class="card-contacto" data-aos="fade-right" data-aos-delay="500">
            <i class="fas fa-map-marker-alt icon"></i>
            <strong>Visítanos:</strong><br>Av Septiembre 04, Frutillar Alto
          </div>
        </div>
        <!-- FOTO EMPRESA -->
        <div class="media-contacto">
          <img src="/images/contactanos.png" alt="Foto empresa" class="foto-contacto" data-aos="fade-left" />
        </div>
      </div>
      <!-- MAPA DEBAJO, CENTRADO Y MODERNO -->
      <div class="mapa-section">
        <h3 class="mapa-titulo" data-aos="fade-up">¿Cómo llegar?</h3>
        <div class="mapa-wrapper" data-aos="fade-up" data-aos-delay="100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3005.154595993112!2d-73.05477!3d-41.131151!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96178dacdd6cf6e7%3A0x7e444233f5e00047!2sAYP%20ANDAMIOS%20Y%20CONSTRUCCION!5e0!3m2!1ses!2sco!4v1752808331472!5m2!1ses!2sco"
            allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="mapa-contacto"></iframe>
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
.main-banner {
  background-color: #c5a025;
  /* Blue color */
  height: 33vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
}

.conocenos-section {
  background: url(img/img_constr.png) center/cover no-repeat;
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


.contacto-section {
  padding: 60px 20px;
  background: #f9f9f9;
  color: #333;
  font-family: 'Montserrat', sans-serif;
}

.contacto-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtexto {
  text-align: center;
  font-size: 1rem;
  color: #666;
  margin-bottom: 40px;
}

.contacto-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
  align-items: flex-start;
}


.info-contacto {
  flex: none;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0 auto;
}

.card-contacto {
  background: #fff;
  padding: 15px 20px;
  border-left: 4px solid #e74c3c;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-size: 0.95rem;
  transition: transform 0.3s ease;
}

.card-contacto:hover {
  transform: translateX(5px);
}

.icon {
  margin-right: 10px;
  color: #e74c3c;
}


/* Mejoras visuales para el área de mapa y foto */

/* Moderniza la sección de foto y mapa */
.media-contacto {
  flex: 1 1 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #fff;
  padding: 24px 18px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  align-items: center;
  min-width: 320px;
  max-width: 600px;
  margin: 0 auto;
}


.foto-contacto {
  width: 100%;
  max-width: 900px;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13);
  margin-bottom: 18px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.mapa-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
}

.mapa-titulo {
  font-size: 1.7rem;
  font-weight: 700;
  color: #e74c3c;
  margin-bottom: 18px;
  letter-spacing: 1px;
  text-align: center;
  text-shadow: 0 2px 8px rgba(231, 76, 60, 0.08);
}

.mapa-wrapper {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.10);
  padding: 18px;
  max-width: 600px;
  width: 100%;
  display: flex;
  justify-content: center;
}



.mapa-contacto {
  width: 100%;
  min-height: 380px;
  max-width: 900px;
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13);
  display: block;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .contacto-grid {
    flex-direction: column;
    align-items: center;
  }

  .media-contacto {
    width: 100%;
    max-width: 500px;
    min-width: unset;
    padding: 16px 8px;
  }

  .mapa-section {
    margin-top: 24px;
  }

  .mapa-wrapper {
    max-width: 100%;
    padding: 8px;
  }

  .mapa-contacto {
    min-height: 200px;
    max-width: 100%;
  }
}
</style>
