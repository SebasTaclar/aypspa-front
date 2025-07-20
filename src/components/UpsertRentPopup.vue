<template>
  <div class="popup-overlay" @click.self="handleOverlayClick">
    <div class="popup-content">
      <h2>{{ mode === 'edit' ? 'Editar Arrendamiento' : 'Crear Arrendamiento' }}</h2>
      <form @submit.prevent="saveRent">
        <div class="form-row">
          <div class="form-group">
            <label for="code">Código</label>
            <input id="code" v-model="rent.code" type="text" required placeholder="Ej: GEN18" />
          </div>
          <div class="form-group">
            <label for="quantity">Cantidad</label>
            <input id="quantity" v-model.number="rent.quantity" type="number" min="1" required placeholder="1" />
          </div>
        </div>

        <div class="form-group">
          <label for="productName">Nombre del Producto</label>
          <input id="productName" v-model="rent.productName" type="text" required
            placeholder="Ej: GENERADOR DUCAR 7.0KVA" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="totalValuePerDay">Valor por Día ($)</label>
            <input id="totalValuePerDay" v-model.number="rent.totalValuePerDay" type="number" min="0" required
              placeholder="13000" />
          </div>
          <div class="form-group">
            <label for="warrantyValue">Valor Garantía ($)</label>
            <input id="warrantyValue" v-model.number="rent.warrantyValue" type="number" min="0" required
              placeholder="750000" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="clientName">Nombre del Cliente</label>
            <input id="clientName" v-model="rent.clientName" type="text" required
              placeholder="Nombre completo del cliente" />
          </div>
          <div class="form-group">
            <label for="clientRut">RUT del Cliente</label>
            <input id="clientRut" v-model="rent.clientRut" type="text" required placeholder="12.345.678-9" />
          </div>
        </div>

        <div class="form-group">
          <label for="paymentMethod">Forma de Pago</label>
          <select id="paymentMethod" v-model="rent.paymentMethod" required>
            <option value="">Seleccionar forma de pago</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div class="form-group" v-if="mode === 'edit'">
          <label for="deliveryDate">Fecha de Entrega</label>
          <input id="deliveryDate" v-model="rent.deliveryDate" type="datetime-local"
            placeholder="Fecha de entrega (opcional)" />
        </div>

        <div class="form-group" v-if="mode === 'edit'">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rent.isFinished" class="checkbox-input" />
            <span class="checkbox-custom"></span>
            Arrendamiento Finalizado
          </label>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="handleOverlayClick">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
    <!-- Confirmation Modal -->
    <ConfirmationModal v-if="showConfirmation" title="¿Descartar cambios?"
      message="¿Estás seguro de que deseas cerrar el formulario? Los cambios no guardados se perderán."
      confirm-text="Descartar" cancel-text="Continuar editando" @confirm="confirmClose" @cancel="cancelClose" />
  </div>

  <Spinner v-if="loading" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getBaseUrl } from '@/utils/apiConfig'
import axios from 'axios'
import Spinner from '@/components/Spinner.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import type { Rent } from '@/types/RentType'

const { rentData, mode } = defineProps<{
  rentData: Rent | null
  mode: 'edit' | 'create'
}>()

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const showConfirmation = ref(false)

// Store original rent data for change detection
const originalRentData = ref<Rent | null>(null)

// Initialize original data when component loads
if (mode === 'create') {
  originalRentData.value = null
} else {
  originalRentData.value = rentData ? { ...rentData } : null
}

// Use reactive refs for rent data instead of computed
const rent = ref({
  id: mode === 'create' ? '' : (rentData?.id || ''),
  code: mode === 'create' ? '' : (rentData?.code || ''),
  productName: mode === 'create' ? '' : (rentData?.productName || ''),
  quantity: mode === 'create' ? 1 : (rentData?.quantity || 1),
  totalValuePerDay: mode === 'create' ? 0 : (rentData?.totalValuePerDay || 0),
  clientRut: mode === 'create' ? '' : (rentData?.clientRut || ''),
  deliveryDate: mode === 'create' ? '' : (rentData?.deliveryDate || ''),
  paymentMethod: mode === 'create' ? '' : (rentData?.paymentMethod || ''),
  clientName: mode === 'create' ? '' : (rentData?.clientName || ''),
  warrantyValue: mode === 'create' ? 0 : (rentData?.warrantyValue || 0),
  creationDate: mode === 'create' ? new Date().toISOString() : (rentData?.creationDate || new Date().toISOString()),
  isFinished: mode === 'create' ? false : (rentData?.isFinished || false)
})

const hasChanges = computed(() => {
  if (mode === 'create') {
    // For create mode, check if any field has been filled (excluding default values)
    const currentRent = rent.value
    return !!(
      currentRent.code.trim() ||
      currentRent.productName.trim() ||
      currentRent.quantity !== 1 ||
      currentRent.totalValuePerDay !== 0 ||
      currentRent.clientRut.trim() ||
      currentRent.paymentMethod.trim() ||
      currentRent.clientName.trim() ||
      currentRent.warrantyValue !== 0 ||
      currentRent.deliveryDate.trim()
    )
  } else {
    // For edit mode, compare with original data
    if (!originalRentData.value) return false

    const current = rent.value
    const original = originalRentData.value

    return !!(
      current.code !== original.code ||
      current.productName !== original.productName ||
      current.quantity !== original.quantity ||
      current.totalValuePerDay !== original.totalValuePerDay ||
      current.clientRut !== original.clientRut ||
      current.paymentMethod !== original.paymentMethod ||
      current.clientName !== original.clientName ||
      current.warrantyValue !== original.warrantyValue ||
      current.deliveryDate !== original.deliveryDate ||
      current.isFinished !== original.isFinished
    )
  }
})

const handleOverlayClick = () => {
  checkForChanges()
}

const checkForChanges = () => {
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

const saveRent = async () => {
  loading.value = true
  try {
    const rentPayload = {
      ...rent.value,
      // Ensure dates are in proper format
      creationDate: rent.value.creationDate || new Date().toISOString(),
      deliveryDate: rent.value.deliveryDate || ''
    }

    if (mode === 'edit') {
      await handleEditRent(rentPayload)
    } else {
      await handleCreateRent(rentPayload)
    }
  } catch (error) {
    console.error('Error saving rent:', error)
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message)
    }
  } finally {
    loading.value = false
  }
}

const handleCreateRent = async (rentPayload: Rent) => {
  const token = sessionStorage.getItem('token')
  const response = await axios.post(`${getBaseUrl()}/api/v1/rents`, rentPayload, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (response.data?.success) {
    emit('save', response.data.data)
    emit('close')
  } else {
    throw new Error('Failed to create rent')
  }
}

const handleEditRent = async (rentPayload: Rent) => {
  const token = sessionStorage.getItem('token')
  const response = await axios.put(`${getBaseUrl()}/api/v1/rents/${rentPayload.id}`, rentPayload, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (response.data?.success) {
    emit('save', response.data.data)
    emit('close')
  } else {
    throw new Error('Failed to update rent')
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--overlay-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: var(--backdrop-blur);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.popup-content {
  background: var(--bg-secondary);
  backdrop-filter: var(--backdrop-blur);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid var(--border-primary);
  box-shadow: 0 20px 60px var(--shadow-primary);
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.popup-content h2 {
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 2px 4px var(--shadow-primary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.95rem;
  text-shadow: 0 1px 2px var(--shadow-secondary);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: var(--backdrop-blur);
  box-sizing: border-box;
}

.form-group input::placeholder {
  color: var(--text-muted);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color-alpha-60);
  background: var(--bg-secondary);
  box-shadow: 0 0 20px var(--primary-color-alpha-30);
  transform: translateY(-1px);
}

.form-group select {
  cursor: pointer;
  background-repeat: no-repeat !important;
  background-position: right 12px center !important;
  background-size: 20px !important;
  padding-right: 40px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

/* Ensure no multiple backgrounds in any state */
.form-group select:focus {
  background-repeat: no-repeat !important;
  background-position: right 12px center !important;
  background-size: 20px !important;
}

/* Dark theme dropdown styling */
:root[data-theme='dark'] .form-group select,
:root:not([data-theme]) .form-group select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
}

:root[data-theme='dark'] .form-group select:focus,
:root:not([data-theme]) .form-group select:focus {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
}

/* Light theme dropdown styling */
:root[data-theme='light'] .form-group select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
}

:root[data-theme='light'] .form-group select:focus {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
}

/* Select option styling for better contrast */
.form-group select option {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: none;
  padding: 8px 12px;
}

/* Dark theme option styling */
:root[data-theme='dark'] .form-group select option,
:root:not([data-theme]) .form-group select option {
  background: #1a1a1a;
  color: #ffffff;
}

/* Light theme option styling */
:root[data-theme='light'] .form-group select option {
  background: #ffffff;
  color: #333333;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 0;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-primary);
  border-radius: 6px;
  background: var(--bg-tertiary);
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkbox-input:checked+.checkbox-custom {
  background: var(--primary-gradient);
  border-color: var(--primary-color);
  transform: scale(1.1);
}

.checkbox-input:checked+.checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.checkbox-label:hover .checkbox-custom {
  border-color: var(--primary-color-alpha-60);
  transform: scale(1.05);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-secondary);
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: var(--backdrop-blur);
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 15px var(--primary-color-alpha-30);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-gradient-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--primary-color-alpha-40);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  border-color: var(--border-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--shadow-secondary);
}

/* Custom scrollbar for modal content */
.popup-content::-webkit-scrollbar {
  width: 8px;
}

.popup-content::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
  border-radius: 4px;
}

.popup-content::-webkit-scrollbar-thumb {
  background: var(--border-primary);
  border-radius: 4px;
}

.popup-content::-webkit-scrollbar-thumb:hover {
  background: var(--border-secondary);
}

/* Responsive */
@media (max-width: 768px) {
  .popup-content {
    margin: 20px;
    padding: 2rem;
    max-width: none;
    width: calc(100% - 40px);
  }

  .popup-content h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .popup-content {
    padding: 1.5rem;
  }

  .form-group input,
  .form-group select {
    padding: 10px 14px;
    font-size: 0.95rem;
  }
}
</style>
