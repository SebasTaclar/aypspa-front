<template>
  <div class="client-container">
    <div class="header">
      <h1>Comunicate Con Nosotros</h1>
    </div>

    <!-- Sección de Contacto -->
    <div class="contact-section">
      <div class="contact-content">
        <div class="contact-form-container">
          <h2>Contáctanos</h2>
          <form @submit.prevent="handleContactSubmit" class="contact-form">
            <div class="form-group">
              <label for="name">Nombre</label>
              <input type="text" id="name" v-model="contactForm.name" required placeholder="Tu nombre / Empresa">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="contactForm.email" required placeholder="tucorreo@ejemplo.com">
            </div>
            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input type="tel" id="phone" v-model="contactForm.phone" required placeholder="Ingrese su # de Teléfono">
            </div>
            <div class="form-group">
              <label for="message">Mensaje</label>
              <textarea id="message" v-model="contactForm.message" required placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>
            <button type="submit" class="btn-submit">Enviar Mensaje</button>
          </form>
        </div>

        <div class="contact-info">
          <div class="contact-details">
            <h3>Información de Contacto</h3>
            <div class="info-item">
              <span class="icon">📍</span>
              <p>Av Septiembre 04, Frutillar Alto</p>
            </div>
            <div class="info-item">
              <span class="icon">📞</span>
              <p>+56 987 531 754</p>
            </div>
            <div class="info-item">
              <span class="icon">✉️</span>
              <p>yonatan.8587@gmail.com</p>
            </div>
          </div>

          <!-- Mapa de Google -->
          <div class="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3005.154595993112!2d-73.05477!3d-41.131151!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96178dacdd6cf6e7%3A0x7e444233f5e00047!2sAYP%20ANDAMIOS%20Y%20CONSTRUCCION!5e0!3m2!1ses!2sco!4v1752808331472!5m2!1ses!2sco" 
              width="100%" 
              height="300" 
              style="border:0;" 
              allowfullscreen 
              loading="lazy">
            </iframe>
          </div>
        </div>
      </div>

      <!-- Botón flotante de WhatsApp -->
      <a href="https://wa.me/+56987531754?text=Estoy%20interesado%20en%3A%20" target="_blank" class="whatsapp-float">
        <div class="whatsapp-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
        <span class="whatsapp-text">¡Contáctanos!</span>
      </a>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'ContactView',
});

// Formulario de contacto
const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const handleContactSubmit = () => {
  // Aquí puedes implementar la lógica para enviar el formulario
  console.log('Formulario enviado:', contactForm.value);
  // Resetear el formulario
  contactForm.value = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };
  alert('Mensaje enviado correctamente');
};
</script>

<style scoped>
.client-container {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 80px 20px 40px;
  min-height: 100vh;
  background: var(--bg-gradient-primary);
  position: relative;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.client-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: var(--bg-gradient-accent);
  pointer-events: none;
}

.header {
  display: flex;
  padding-left: 13rem;
  align-items: center;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  max-width: 1600px;
  width: 100%;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: left;
  color: var(--text-primary);
  margin: 0;
  text-shadow: 0 2px 4px var(--shadow-primary);
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--primary-color-alpha-30);
  backdrop-filter: blur(10px);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--primary-color-alpha-40);
  background: var(--primary-gradient-hover);
}

/* Estilos para la sección de contacto */
.contact-section {
  position: relative;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 20px;
  margin: 2rem auto;
  max-width: 1200px;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.contact-form-container {
  background: var(--bg-tertiary);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--border-primary);
}

.contact-form-container h2 {
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-primary);
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.btn-submit {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--primary-color-alpha-30);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-details {
  background: var(--bg-tertiary);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--border-primary);
}

.contact-details h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.info-item .icon {
  font-size: 1.5rem;
  min-width: 24px;
  text-align: center;
}

.map-container {
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid var(--border-primary);
  height: 300px;
}

.map-container iframe {
  width: 100%;
  height: 100%;
}

/* Estilos para el botón flotante de WhatsApp */
.whatsapp-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  background-color: #25D366;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.whatsapp-float:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.4);
}

.whatsapp-icon {
  font-size: 24px;
  margin-right: 8px;
}

.whatsapp-text {
  font-size: 16px;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 768px) {
  .client-container {
    padding: 70px 10px 20px;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    justify-content: center;
    padding-left: 0;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin: 0 auto;
    padding: 0;
  }

  .contact-section {
    margin: 1rem auto;
    padding: 1.5rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .whatsapp-text {
    display: none;
  }

  .whatsapp-float {
    padding: 15px;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    justify-content: center;
    margin-right: 0;
  }

  .whatsapp-icon {
    margin-right: 0;
    font-size: 28px;
  }
}
</style>
