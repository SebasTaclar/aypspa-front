<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="popup-content" @click.stop>
      <h2>{{ isEditing ? 'Editar Producto' : 'Crear Producto' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Nombre del Producto*</label>
          <input type="text" id="name" v-model="localProduct.name" required
            placeholder="Ingrese el nombre del producto" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="code">Código*</label>
            <input type="text" id="code" v-model="localProduct.code" required placeholder="Código del producto" />
          </div>

          <div class="form-group">
            <label for="brand">Marca*</label>
            <input type="text" id="brand" v-model="localProduct.brand" required placeholder="Marca del producto" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="priceNet">Precio Neto*</label>
            <input type="number" id="priceNet" v-model="localProduct.priceNet" required min="0" step="0.01"
              placeholder="0.00" @input="calculateTotals" />
          </div>

          <div class="form-group">
            <label for="priceIva">IVA*</label>
            <input type="number" id="priceIva" v-model="localProduct.priceIva" required min="0" step="0.01"
              placeholder="0.00" @input="calculateTotals" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="priceTotal">Precio Total</label>
            <input type="number" id="priceTotal" v-model="localProduct.priceTotal" readonly step="0.01"
              placeholder="0.00" />
          </div>

          <div class="form-group">
            <label for="priceWarranty">Precio Garantía*</label>
            <input type="number" id="priceWarranty" v-model="localProduct.priceWarranty" required min="0" step="0.01"
              placeholder="0.00" />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="closePopup" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Product } from '@/types/ProductType'

interface Props {
  show: boolean
  product?: Product | null
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', product: Partial<Product>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isSubmitting = ref(false)

const isEditing = computed(() => props.product !== null && props.product !== undefined)

const localProduct = ref<Partial<Product>>({
  name: '',
  code: '',
  brand: '',
  priceNet: 0,
  priceIva: 0,
  priceTotal: 0,
  priceWarranty: 0
})

watch(() => props.show, (newVal) => {
  if (newVal && props.product) {
    // Editing mode
    localProduct.value = { ...props.product }
  } else if (newVal) {
    // Creating mode
    localProduct.value = {
      name: '',
      code: '',
      brand: '',
      priceNet: 0,
      priceIva: 0,
      priceTotal: 0,
      priceWarranty: 0
    }
  }
})

const calculateTotals = () => {
  const net = Number(localProduct.value.priceNet) || 0
  const iva = Number(localProduct.value.priceIva) || 0
  localProduct.value.priceTotal = net + iva
}

const closePopup = () => {
  emit('close')
}

const submitForm = async () => {
  isSubmitting.value = true
  try {
    calculateTotals()
    emit('submit', localProduct.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.popup-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  width: 600px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

h2 {
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: white;
  font-size: 0.95rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-family: 'Bricolage Grotesque', sans-serif;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input[type="text"]::placeholder,
input[type="number"]::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

input[type="text"]:focus,
input[type="number"]:focus {
  outline: none;
  border-color: var(--primary-color-alpha-60);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 20px var(--primary-color-alpha-30);
}

input[readonly] {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
}

.btn-cancel,
.btn-submit {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: 'Bricolage Grotesque', sans-serif;
  min-width: 120px;
}

.btn-cancel {
  background: rgba(108, 117, 125, 0.8);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.btn-cancel:hover {
  transform: translateY(-2px);
  background: rgba(108, 117, 125, 1);
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
}

.btn-submit {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 15px var(--primary-color-alpha-30);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--primary-color-alpha-40);
  background: var(--primary-gradient-hover);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  background: rgba(108, 117, 125, 0.6);
}

/* Scrollbar styling for modal content */
.popup-content::-webkit-scrollbar {
  width: 8px;
}

.popup-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.popup-content::-webkit-scrollbar-thumb {
  background: var(--primary-color-alpha-60);
  border-radius: 4px;
}

.popup-content::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color-alpha-80);
}

@media (max-width: 768px) {
  .popup-content {
    width: 95vw;
    padding: 1.5rem;
    margin: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
