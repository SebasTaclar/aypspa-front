<template>
  <section class="hero">
    <div class="hero-container">
      <div class="hero-content">
        <div class=" letras">
          <img src="/images/engranaje.png" alt="" class="service-icon-1">
          <span class="letra-a">A</span>
          <span class="letra-y">Y</span>
          <span class="letra-p">P</span>
        </div>
        <div class="subtitle">
          <p class="subtitle">LA SOLUCIÓN PARA TU CONSTRUCCIÓN</p>
        </div>
        <div class="linea-roja-nueva"></div>
        <ul class="services-list">
          <li style="--delay: 0s;">
            <div class="service-icon"><img src="/images/bombilla-remo.png" alt=".service-icon" class="service-icon">
            </div>
            <p class="p-icon">ASESORÍA PERSONALIZADA</p>
          </li>
          <li style="--delay: 0.2s;">
            <div class="service-icon"><img src="/images/herr-remo1.png" alt="" class="service-icon"></div>
            <p class="p-icon">VENTA DE HERRAMIENTAS</p>
          </li>
          <li style="--delay: 0.4s;">
            <div class="service-icon"><img src="/images/proveedor.png" alt="" class="service-icon"></div>
            <p class="p-icon">PROVEEDORES WESCO E ITAKA</p>
          </li>
        </ul>
        <!-- <div class="servicios-ayp">
                <a href="#servicios-ayp" class="interactive-btn">CONOZCA NUESTROS SERVICIOS</a>
              </div> -->
      </div>

      <div class="hero-visual">
        <div class="hexagon">
          <div class="hexagon-content">
            <img src="/images/logoayp.jpeg" alt="Logo AYP" class="logo-hexagono">

            <p class="letrero-rombo">Construimos contigo,<br> con calidad y <br> eficiencia garantizadas.</p>
          </div>
        </div>

        <div class="floating-tools">
          <div class="tool">🔨</div>
          <div class="tool">⚙️</div>
          <div class="tool">🏗️</div>
          <div class="tool">🔩</div>
        </div>
      </div>
    </div>
  </section>

</template>

<script setup lang="ts">
</script>

<style scoped>
.letrero-rombo {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.1rem;
  /* Tamaño de letra */
  font-weight: 10;
  /* Negrita */
  letter-spacing: -2px;
  /* Opcional: ajusta el espaciado */
  color: white;
  /* Opcional: color blanco para mejor contraste */
}

.logo-hexagono {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  background: white;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, rgba(44, 62, 80, 0), rgba(74, 103, 65, 0)),
    url(/images/img_constr.png);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(1px);
}

@keyframes constructionPattern {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(20px);
  }
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
  min-height: 80vh;
}

.hero-content {
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero-content h1 {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  font-family: Arial, sans-serif;
  margin: 0;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite alternate;
  /* Es el nombre de la animación (definida con @keyframes titleGlow {})2s	Duración de la animación (2 segundos por ciclo)ease-in-out	Función de tiempo: la animación empieza y termina suavementeinfinite	La animación se repite infinitamentealternate	La animación va y vuelve (reproduce normal y luego al revés)/  letter-spacing: -11px; / Ajusta aquí el espaciado */
  letter-spacing: -10px;
}

.fondo-rojo {
  background-color: rgba(238, 231, 231, 0.123);
  /* rojo con opacidad */
  display: inline-block;
  padding: 3px 0px;
  /* reduce el tamaño del fondo */
  border-radius: 15px;
  /* opcional: bordes suavizados */
}


.letra-a {
  color: white;
  font-size: 2.6rem;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 1s ease-out 0.5s both;
}

.letra-y {
  color: white;
  font-size: 2.6rem;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 1s ease-out 0.7s both;
}

.letra-p {
  color: white;
  font-size: 2.6rem;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 1s ease-out 0.9s both;
}

.letras {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

@keyframes titleGlow {
  0% {
    filter: drop-shadow(0 0 5px #9B3B32);
  }

  100% {
    filter: drop-shadow(0 0 20px #9B3B32);
  }
}

.subtitle {
  font-size: 1.7rem;
  margin-bottom: 2rem;
  margin-top: 6rem;
  margin-right: -200px;
  text-align: center;
  color: #ecf0f1;
  animation: fadeInUp 1s ease-out 0.5s both;

}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.services-list {
  list-style: none;
  margin-bottom: 2rem;
}

.services-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  animation: fadeInUp 1s ease-out calc(0.7s + var(--delay)) both;
}

.services-list li:hover {
  transform: translateX(10px);
  background: rgba(255, 107, 53, 0.1);
  border-radius: 10px;
  padding-left: 1.5rem;
}

.p-icon {
  font-weight: normal !important;
  /* Asegura que no sea negrita */
  font-size: 21px;
  margin-top: 10px;

}


.service-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.services-list li:hover .service-icon {
  transform: scale(1.2) rotate(10deg);
}

.service-icon-1 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all 0.3s ease;
  margin-right: 1rem;
  animation: fadeInUp 1s ease-out 0.5s both;
}

.services-list li:hover .service-icon-1 {
  transform: scale(1.2) rotate(10deg);
}

.hero-visual {
  position: relative;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hexagon {
  width: 500px;
  height: 400px;
  margin-right: -220px;
  background: linear-gradient(135deg, #1a1a1a, #1a1a1a);
  clip-path: polygon(25% 0%,
      /* arriba izquierda */
      75% 0%,
      /* arriba derecha */
      100% 50%,
      /* medio derecha */
      75% 100%,
      /* abajo derecha */
      25% 100%,
      /* abajo izquierda */
      0% 50%
      /* medio izquierda */
    );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: hexagonFloat 3s ease-in-out infinite;
  animation: fadeInUp 0.4s ease-out 0.5s both;
}

@keyframes hexagonFloat {

  0%,
  100% {
    transform: translateX(30px)
  }

  50% {
    transform: translateX(0);
  }
}

.hexagon-content {
  color: white;
  text-align: center;
  padding: 2rem;
}

.hexagon-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 900;
}

.hexagon-content p {
  font-size: 1.9rem;
  margin-bottom: 4rem;
}

.cta-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #f44336;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.floating-tools {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.tool {
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  animation: float 4s ease-in-out infinite;
}

.tool:nth-child(1) {
  top: 15%;
  left: 30%;
  animation-delay: 0s;
}

.tool:nth-child(2) {
  top: 20%;
  right: -15%;
  animation-delay: 1s;
}

.tool:nth-child(3) {
  bottom: 13%;
  left: 30%;
  animation-delay: 2s;
}

.tool:nth-child(4) {
  bottom: 20%;
  right: -15%;
  animation-delay: 3s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

.linea-roja-nueva {
  width: 170%;
  /* Ajusta el ancho para que llegue hasta el hexágono */
  max-width: 700px;
  height: 3px;
  background-color: #f44336;
  margin: 18px auto 0 auto;
  border-radius: 2px;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablets and Medium Screens */
@media (max-width: 1024px) {
  .hero-container {
    gap: 2rem;
    padding: 0 2rem;
  }

  .letras {
    font-size: 3rem;
  }

  .letra-a,
  .letra-y,
  .letra-p {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 1.4rem;
    margin-top: 4rem;
  }

  .logo-hexagono {
    width: 150px;
    height: 150px;
  }

  .letrero-rombo {
    font-size: 1.6rem;
  }

  .hexagon {
    width: 350px;
    height: 350px;
  }
}

/* Mobile Landscape and Small Tablets */
@media (max-width: 768px) {
  .hero {
    background-attachment: scroll;
    /* Fix for mobile */
    min-height: 100vh;
    padding: 1rem 0;
  }

  .hero-container {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
    padding: 0 1rem;
  }

  .hero-content {
    order: 2;
    width: 100%;
  }

  .hero-visual {
    order: 1;
    width: 100%;
  }

  .letras {
    font-size: 2.5rem;
    justify-content: center;
  }

  .letra-a,
  .letra-y,
  .letra-p {
    font-size: 2.5rem;
    margin-left: 0;
    position: relative;
  }

  .service-icon-1 {
    width: 40px;
    height: 40px;
  }

  .subtitle {
    font-size: 1.2rem;
    margin-top: 2rem;
    margin-bottom: 1.5rem;
  }

  .services-list {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .services-list li {
    flex-direction: row;
    text-align: left;
    width: 100%;
    max-width: 300px;
  }

  .service-icon {
    width: 40px;
    height: 40px;
  }

  .p-icon {
    font-size: 0.9rem;
    margin-left: 1rem;
  }

  .hexagon {
    width: 280px;
    height: 280px;
  }

  .logo-hexagono {
    width: 120px;
    height: 120px;
    margin-bottom: 1rem;
  }

  .letrero-rombo {
    font-size: 1.2rem;
    line-height: 1.4;
  }

  .linea-roja-nueva {
    width: 80%;
    max-width: 300px;
  }

  .floating-tools {
    display: none;
    /* Hide floating tools on mobile for cleaner look */
  }
}

/* Mobile Portrait */
@media (max-width: 480px) {
  .hero {
    min-height: 90vh;
    padding: 0.5rem 0;
  }

  .hero-container {
    gap: 2rem;
    padding: 0 0.5rem;
  }

  .letras {
    font-size: 2rem;
  }

  .letra-a,
  .letra-y,
  .letra-p {
    font-size: 2rem;
  }

  .service-icon-1 {
    width: 30px;
    height: 30px;
  }

  .subtitle {
    font-size: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }

  .services-list li {
    max-width: 250px;
  }

  .service-icon {
    width: 35px;
    height: 35px;
  }

  .p-icon {
    font-size: 0.8rem;
  }

  .hexagon {
    width: 220px;
    height: 220px;
  }

  .logo-hexagono {
    width: 100px;
    height: 100px;
  }

  .letrero-rombo {
    font-size: 1rem;
    line-height: 1.3;
  }

  .linea-roja-nueva {
    width: 90%;
    max-width: 250px;
    height: 2px;
  }
}

/* Extra Small Screens */
@media (max-width: 360px) {
  .letras {
    font-size: 1.8rem;
  }

  .letra-a,
  .letra-y,
  .letra-p {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .hexagon {
    width: 180px;
    height: 180px;
  }

  .logo-hexagono {
    width: 80px;
    height: 80px;
  }

  .letrero-rombo {
    font-size: 0.9rem;
  }

  .services-list li {
    max-width: 200px;
  }

  .p-icon {
    font-size: 0.75rem;
  }
}

/* Landscape Orientation on Mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .hero {
    min-height: 100vh;

  }

  .hero-container {
    flex-direction: row;
    gap: 2rem;
  }

  .hero-content {
    order: 1;
    width: 60%;
  }

  .hero-visual {
    order: 2;
    width: 40%;
  }

  .hexagon {
    width: 200px;
    height: 200px;
  }

  .logo-hexagono {
    width: 80px;
    height: 80px;
  }

  .letrero-rombo {
    font-size: 0.8rem;
  }

  .services-list {
    flex-direction: column;
    gap: 0.5rem;
  }

  .subtitle {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}
</style>
