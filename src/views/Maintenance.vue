<template>
 <div class="maintenance-container">
  <div class="maintenance-content">
   <div class="maintenance-icon">
    🔧
   </div>

   <h1 class="maintenance-title">
    Página en Mantenimiento
   </h1>

   <p class="maintenance-description">
    Estamos trabajando para mejorar tu experiencia. Esta sección estará disponible pronto.
   </p>

   <div class="maintenance-details">
    <div class="detail-item">
     <div class="detail-icon">⚙️</div>
     <p>Realizando mejoras en el sistema</p>
    </div>

    <div class="detail-item">
     <div class="detail-icon">🚀</div>
     <p>Optimizando el rendimiento</p>
    </div>

    <div class="detail-item">
     <div class="detail-icon">🔒</div>
     <p>Actualizando medidas de seguridad</p>
    </div>
   </div>

   <button @click="goBack" class="btn-back">
    ← Volver al Inicio
   </button>

   <div class="estimated-time">
    <p>Tiempo estimado de finalización: <strong>Próximamente</strong></p>
   </div>
  </div>

  <div class="maintenance-animation">
   <div class="gear gear1">⚙️</div>
   <div class="gear gear2">🔧</div>
   <div class="gear gear3">⚙️</div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'MaintenanceView' })

const router = useRouter()

const goBack = () => {
 router.push('/')
}
</script>

<style scoped>
.maintenance-container {
 min-height: 100vh;
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
 padding: 2rem;
 background: var(--bg-gradient-primary);
 position: relative;
 overflow: hidden;
}

.maintenance-container::before {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background-image: var(--bg-gradient-accent);
 pointer-events: none;
}

.maintenance-content {
 background: var(--bg-secondary);
 backdrop-filter: var(--backdrop-blur);
 border-radius: 25px;
 padding: 3rem 2rem;
 border: 1px solid var(--border-primary);
 box-shadow: 0 20px 60px var(--shadow-primary);
 text-align: center;
 max-width: 600px;
 width: 100%;
 position: relative;
 z-index: 2;
 animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
 from {
  transform: translateY(50px);
  opacity: 0;
 }

 to {
  transform: translateY(0);
  opacity: 1;
 }
}

.maintenance-icon {
 font-size: 5rem;
 margin-bottom: 1.5rem;
 animation: bounce 2s infinite;
}

@keyframes bounce {

 0%,
 20%,
 50%,
 80%,
 100% {
  transform: translateY(0);
 }

 40% {
  transform: translateY(-10px);
 }

 60% {
  transform: translateY(-5px);
 }
}

.maintenance-title {
 color: var(--text-primary);
 font-size: 2.5rem;
 font-weight: 700;
 margin-bottom: 1rem;
 text-shadow: 2px 2px 4px var(--shadow-primary);
}

.maintenance-description {
 color: var(--text-secondary);
 font-size: 1.2rem;
 margin-bottom: 2rem;
 line-height: 1.6;
}

.maintenance-details {
 display: flex;
 flex-direction: column;
 gap: 1rem;
 margin-bottom: 2rem;
}

.detail-item {
 display: flex;
 align-items: center;
 justify-content: flex-start;
 gap: 1rem;
 padding: 1rem;
 background: var(--bg-tertiary);
 border-radius: 15px;
 border: 1px solid var(--border-primary);
 transition: all 0.3s ease;
}

.detail-item:hover {
 transform: translateX(5px);
 background: var(--bg-secondary);
 box-shadow: 0 5px 15px var(--shadow-secondary);
}

.detail-icon {
 font-size: 1.5rem;
 filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.detail-item p {
 margin: 0;
 color: var(--text-primary);
 font-weight: 500;
 flex: 1;
 text-align: left;
}

.btn-back {
 background: var(--primary-gradient);
 color: white;
 border: none;
 border-radius: 15px;
 padding: 15px 30px;
 font-size: 1.1rem;
 font-weight: 600;
 cursor: pointer;
 transition: all 0.3s ease;
 box-shadow: 0 6px 20px var(--primary-color-alpha-30);
 margin-bottom: 2rem;
}

.btn-back:hover {
 transform: translateY(-3px);
 box-shadow: 0 10px 30px var(--primary-color-alpha-40);
 background: var(--primary-gradient-hover);
}

.estimated-time {
 padding-top: 1rem;
 border-top: 1px solid var(--border-primary);
}

.estimated-time p {
 color: var(--text-secondary);
 margin: 0;
 font-size: 0.95rem;
}

.estimated-time strong {
 color: var(--text-primary);
}

.maintenance-animation {
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 pointer-events: none;
 z-index: 1;
}

.gear {
 position: absolute;
 font-size: 3rem;
 opacity: 0.1;
 animation: rotate 4s linear infinite;
}

.gear1 {
 top: 10%;
 left: 10%;
 animation-duration: 4s;
}

.gear2 {
 top: 20%;
 right: 15%;
 animation-duration: 6s;
 animation-direction: reverse;
}

.gear3 {
 bottom: 15%;
 left: 20%;
 animation-duration: 5s;
}

@keyframes rotate {
 from {
  transform: rotate(0deg);
 }

 to {
  transform: rotate(360deg);
 }
}

/* Dark theme adjustments */
:root[data-theme='dark'] .maintenance-animation .gear,
:root:not([data-theme]) .maintenance-animation .gear {
 opacity: 0.05;
}

/* Light theme adjustments */
:root[data-theme='light'] .maintenance-animation .gear {
 opacity: 0.15;
}

/* Responsive */
@media (max-width: 768px) {
 .maintenance-container {
  padding: 1rem;
 }

 .maintenance-content {
  padding: 2rem 1.5rem;
 }

 .maintenance-title {
  font-size: 2rem;
 }

 .maintenance-description {
  font-size: 1rem;
 }

 .maintenance-icon {
  font-size: 4rem;
 }

 .detail-item {
  flex-direction: column;
  text-align: center;
  gap: 0.5rem;
 }

 .detail-item p {
  text-align: center;
 }

 .btn-back {
  padding: 12px 24px;
  font-size: 1rem;
 }

 .gear {
  font-size: 2rem;
 }
}

@media (max-width: 480px) {
 .maintenance-title {
  font-size: 1.5rem;
 }

 .maintenance-description {
  font-size: 0.9rem;
 }

 .maintenance-icon {
  font-size: 3rem;
 }
}
</style>
