<template>
  <main class="home-main">
    <!-- Desktop Version -->
    <div class="desktop-version">
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
    </div>

    <!-- Mobile Version -->
    <div class="mobile-version">
      <!-- Mobile Hero Section -->
      <section class="mobile-hero">
        <div class="mobile-hero-content">
          <!-- Mobile AYP Logo with Icons -->
          <div class="mobile-logo-section">
            <div class="mobile-letras">
              <img src="/images/engranaje.png" alt="Engranaje" class="mobile-service-icon">
              <div class="mobile-ayp-letters">
                <span class="mobile-letra-a">A</span>
                <span class="mobile-letra-y">Y</span>
                <span class="mobile-letra-p">P</span>
              </div>
            </div>
            <div class="mobile-subtitle">
              <p>LA SOLUCIÓN PARA TU CONSTRUCCIÓN</p>
            </div>
            <div class="mobile-linea-roja"></div>
          </div>

          <!-- Mobile Logo Hexagon -->
          <div class="mobile-hexagon-container">
            <div class="mobile-hexagon">
              <img src="/images/logoayp.jpeg" alt="Logo AYP" class="mobile-logo-hexagon">
            </div>
            <p class="mobile-slogan">Construimos contigo,<br>con calidad y eficiencia</p>
          </div>

          <!-- Mobile Key Services -->
          <div class="mobile-key-services">
            <div class="mobile-service-item">
              <img src="/images/bombilla-remo.png" alt="Asesoría" class="mobile-service-img">
              <span>ASESORÍA PERSONALIZADA</span>
            </div>
            <div class="mobile-service-item">
              <img src="/images/herr-remo1.png" alt="Herramientas" class="mobile-service-img">
              <span>VENTA DE HERRAMIENTAS</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Mobile Services Grid -->
      <section class="mobile-services">
        <h2>Nuestros Servicios</h2>
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon">🏗️</div>
            <h3>Arriendo de Herramientas</h3>
            <p>Equipos profesionales para construcción</p>
          </div>
          <div class="service-card">
            <div class="service-icon">🔧</div>
            <h3>Venta de Herramientas</h3>
            <p>Herramientas de calidad para profesionales</p>
          </div>
          <div class="service-card">
            <div class="service-icon">📋</div>
            <h3>Gestión de Proyectos</h3>
            <p>Administración completa de tus proyectos</p>
          </div>
        </div>
      </section>

      <!-- Mobile Contact -->
      <section class="mobile-contact">
        <h2>Contáctanos</h2>
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <span>+56 9 XXXX XXXX</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">📧</span>
            <span>contacto@ayp.cl</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <span>Santiago, Chile</span>
          </div>
        </div>
      </section>
    </div>
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
  padding-top: 70px;
  /* Updated for new navbar height */
  background-color: transparent;
  overflow-x: hidden;
  /* Prevent horizontal scroll */
}

/* Desktop Version */
.desktop-version {
  display: block;
}

.mobile-version {
  display: none;
}

.section {
  padding: 0.1px 0 0 0;
  border-bottom: 1px solid var(--border-secondary);
  position: relative;
}

.section:last-child {
  border-bottom: none;
}

.offset {
  padding-top: 0px;
  /* Updated for new navbar height */
  margin-top: -70px;
}

/* Mobile Version Styles */
.mobile-hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.mobile-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/images/img_constr.png') center/cover;
  opacity: 0.9;
  z-index: 1;
}

.mobile-hero-content {
  padding: 2rem 1rem;
  position: relative;
  z-index: 2;
  max-width: 400px;
  margin: 0 auto;
}

/* Mobile AYP Letters Section */
.mobile-logo-section {
  margin-bottom: 3rem;
}

.mobile-letras {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.mobile-service-icon {
  width: 40px;
  height: 40px;
  filter: brightness(0) invert(1);
  animation: rotate 3s linear infinite;
}

.mobile-ayp-letters {
  display: flex;
  gap: 0.5rem;
}

.mobile-letra-a,
.mobile-letra-y,
.mobile-letra-p {
  font-size: 3rem;
  font-weight: 900;
  color: var(--primary-color);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: pulse 2s ease-in-out infinite alternate;
}

.mobile-letra-a {
  animation-delay: 0s;
}

.mobile-letra-y {
  animation-delay: 0.3s;
}

.mobile-letra-p {
  animation-delay: 0.6s;
}

.mobile-subtitle {
  margin-bottom: 1rem;
}

.mobile-subtitle p {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: #ffffff;
  margin: 0;
}

.mobile-linea-roja {
  width: 60px;
  height: 3px;
  background: var(--primary-color);
  margin: 0 auto 2rem auto;
  border-radius: 2px;
}

/* Mobile Hexagon Logo */
.mobile-hexagon-container {
  margin-bottom: 3rem;
}

.mobile-hexagon {
  width: 120px;
  height: 120px;
  background: var(--primary-color);
  margin: 0 auto 1.5rem auto;
  position: relative;
  border-radius: 15px;
  transform: rotate(45deg);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
}

.mobile-logo-hexagon {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  object-fit: cover;
}

.mobile-slogan {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;
  color: #ffffff;
  margin: 0;
  opacity: 0.95;
}

/* Mobile Key Services */
.mobile-key-services {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-service-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 107, 53, 0.3);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.mobile-service-item:hover {
  background: rgba(255, 107, 53, 0.2);
  transform: translateX(5px);
}

.mobile-service-img {
  width: 30px;
  height: 30px;
  filter: brightness(0) invert(1);
}

.mobile-service-item span {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 1px;
}

/* Animations */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  from {
    transform: scale(1);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  to {
    transform: scale(1.05);
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
  }
}

.mobile-services {
  padding: 2rem 1rem;
  background: var(--bg-primary);
}

.mobile-services h2 {
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 400px;
  margin: 0 auto;
}

.service-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-primary);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px var(--shadow-primary);
  background: var(--bg-secondary);
}

.service-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.service-card h3 {
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.service-card p {
  color: var(--text-muted);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.mobile-contact {
  padding: 2rem 1rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
}

.mobile-contact h2 {
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  margin: 0 auto;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
}

.contact-icon {
  font-size: 1.2rem;
  width: 1.5rem;
  text-align: center;
}

/* ========== RESPONSIVE BREAKPOINTS ========== */
@media (max-width: 768px) {
  .home-main {
    padding-top: 60px;
    /* Consistent mobile spacing */
  }

  /* Switch to mobile version */
  .desktop-version {
    display: none !important;
  }

  .mobile-version {
    display: block !important;
  }
}

@media (max-width: 640px) {
  .mobile-hero-content {
    padding: 1.5rem 0.75rem;
  }

  .mobile-letras {
    gap: 0.75rem;
  }

  .mobile-service-icon {
    width: 35px;
    height: 35px;
  }

  .mobile-letra-a,
  .mobile-letra-y,
  .mobile-letra-p {
    font-size: 2.5rem;
  }

  .mobile-subtitle p {
    font-size: 0.8rem;
    letter-spacing: 1.5px;
  }

  .mobile-hexagon {
    width: 100px;
    height: 100px;
  }

  .mobile-logo-hexagon {
    width: 70px;
    height: 70px;
  }

  .mobile-slogan {
    font-size: 0.9rem;
  }

  .mobile-service-item {
    padding: 0.75rem;
  }

  .mobile-service-img {
    width: 25px;
    height: 25px;
  }

  .mobile-service-item span {
    font-size: 0.75rem;
  }

  .services-grid {
    gap: 1rem;
  }

  .service-card {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .mobile-hero {
    min-height: 70vh;
  }

  .mobile-hero-content {
    padding: 1rem 0.5rem;
  }

  .mobile-letras {
    gap: 0.5rem;
  }

  .mobile-service-icon {
    width: 30px;
    height: 30px;
  }

  .mobile-letra-a,
  .mobile-letra-y,
  .mobile-letra-p {
    font-size: 2rem;
  }

  .mobile-subtitle p {
    font-size: 0.75rem;
    letter-spacing: 1px;
  }

  .mobile-hexagon {
    width: 80px;
    height: 80px;
  }

  .mobile-logo-hexagon {
    width: 55px;
    height: 55px;
  }

  .mobile-slogan {
    font-size: 0.8rem;
  }

  .mobile-key-services {
    gap: 1rem;
  }

  .mobile-service-item {
    padding: 0.5rem;
    gap: 0.75rem;
  }

  .mobile-service-img {
    width: 20px;
    height: 20px;
  }

  .mobile-service-item span {
    font-size: 0.7rem;
    letter-spacing: 0.5px;
  }

  .service-card {
    padding: 1rem;
  }

  .mobile-contact {
    padding: 1.5rem 0.75rem;
  }
}

/* Ensure all child components are responsive on desktop */
@media (min-width: 769px) {
  .offset {
    padding-top: 70px;
    margin-top: -70px;
  }

  .section {
    max-width: 100%;
  }
}

@media (min-width: 1025px) {
  .section {
    max-width: 100%;
  }
}
</style>
