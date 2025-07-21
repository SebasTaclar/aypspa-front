<template>
  <div v-if="show" class="popup-overlay" @click.self="handleOverlayClick">
    <div class="popup-content">
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
            <label for="priceTotal">Precio Total*</label>
            <input type="number" id="priceTotal" v-model="localProduct.priceTotal" required min="0" step="0.01"
              placeholder="0.00" @input="calculateFromTotal" />
          </div>

          <div class="form-group">
            <label for="priceWarranty">Precio Garantía*</label>
            <input type="number" id="priceWarranty" v-model="localProduct.priceWarranty" required min="0" step="0.01"
              placeholder="0.00" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="priceNet">Precio Neto (Calculado)</label>
            <input type="number" id="priceNet" v-model="localProduct.priceNet" readonly step="0.01"
              placeholder="0.00" />
          </div>

          <div class="form-group">
            <label for="priceIva">IVA (Calculado)</label>
            <input type="number" id="priceIva" v-model="localProduct.priceIva" readonly step="0.01"
              placeholder="0.00" />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="handleOverlayClick" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>

    <ConfirmationModal v-if="showConfirmation" title="¿Descartar cambios?"
      message="¿Estás seguro de que deseas cerrar el formulario? Los cambios no guardados se perderán."
      confirm-text="Descartar" cancel-text="Continuar editando" @confirm="confirmClose" @cancel="cancelClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
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
const showConfirmation = ref(false)

// Store original product data for change detection
const originalProductData = ref<Partial<Product> | null>(null)

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
    // Ensure calculated values are correct when editing
    calculateTotals()
    // Store original data after calculation for proper change detection
    originalProductData.value = { ...localProduct.value }
    showConfirmation.value = false // Reset confirmation modal
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
    // For new products, start with empty values
    // Store original data for proper change detection
    originalProductData.value = { ...localProduct.value }
    showConfirmation.value = false // Reset confirmation modal
  }
})

const calculateFromTotal = () => {
  const total = Number(localProduct.value.priceTotal) || 0

  // Calcular precio neto e IVA desde el total
  // IVA en Chile es 19%, por lo que:
  // Total = Neto + IVA
  // Total = Neto + (Neto * 0.19)
  // Total = Neto * 1.19
  // Neto = Total / 1.19

  const priceNet = total / 1.19
  const priceIva = total - priceNet

  localProduct.value.priceNet = Math.round(priceNet)
  localProduct.value.priceIva = Math.round(priceIva)
}

const calculateTotals = () => {
  // Esta función se mantiene para casos donde se necesite calcular desde neto e IVA
  const net = Number(localProduct.value.priceNet) || 0
  const iva = Number(localProduct.value.priceIva) || 0
  localProduct.value.priceTotal = net + iva
}

const hasChanges = computed(() => {
  if (!isEditing.value) {
    // For create mode, check if any field has been filled
    const currentProduct = localProduct.value;
    return !!(
      currentProduct.name?.trim() ||
      currentProduct.code?.trim() ||
      currentProduct.brand?.trim() ||
      (currentProduct.priceTotal && currentProduct.priceTotal > 0) ||
      (currentProduct.priceWarranty && currentProduct.priceWarranty > 0)
    );
  } else {
    // For edit mode, compare with original data
    if (!originalProductData.value) return false;

    const current = localProduct.value;
    const original = originalProductData.value;

    // Compare mainly the user-editable fields
    return !!(
      current.name !== original.name ||
      current.code !== original.code ||
      current.brand !== original.brand ||
      current.priceTotal !== original.priceTotal ||
      current.priceWarranty !== original.priceWarranty
    );
  }
});

const handleOverlayClick = () => {
  if (hasChanges.value) {
    showConfirmation.value = true
  } else {
    emit('close')
  }
}

const confirmClose = () => {
  showConfirmation.value = false
  emit('close')
}

const cancelClose = () => {
  showConfirmation.value = false
}

const submitForm = async () => {
  isSubmitting.value = true
  try {
    // Ensure calculations are up to date before submitting
    if ((localProduct.value.priceTotal ?? 0) > 0) {
      calculateFromTotal()
    }
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
