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

        <div class="form-group">
          <label>
            <input type="checkbox" v-model="localProduct.rented" />
            Producto arrendado
          </label>
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
  priceWarranty: 0,
  rented: false
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
      priceWarranty: 0,
      rented: false
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

h2 {
  margin-bottom: 25px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="number"]:focus {
  outline: none;
  border-color: #007bff;
}

input[readonly] {
  background-color: #f8f9fa;
  color: #6c757d;
}

input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.btn-cancel,
.btn-submit {
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

.btn-submit {
  background-color: #007bff;
  color: white;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.btn-submit:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
</style>
