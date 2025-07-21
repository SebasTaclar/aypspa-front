<template>
  <div v-if="isOpen" class="popup-overlay" @click="closeModal">
    <div class="popup-content" @click.stop>
      <h2>Finalizar y Cobrar Arrendamiento</h2>

      <!-- Locked Information Fields -->
      <div class="form-section">
        <h3>Información del Arrendamiento</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Código:</label>
            <input type="text" :value="rent?.code" readonly class="readonly-input" />
          </div>
          <div class="form-group">
            <label>Producto:</label>
            <input type="text" :value="rent?.productName" readonly class="readonly-input" />
          </div>
          <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" :value="rent?.quantity" readonly class="readonly-input" />
          </div>
          <div class="form-group">
            <label>Cliente:</label>
            <input type="text" :value="rent?.clientName" readonly class="readonly-input" />
          </div>
          <div class="form-group">
            <label>RUT Cliente:</label>
            <input type="text" :value="rent?.clientRut" readonly class="readonly-input" />
          </div>
          <div class="form-group">
            <label>Fecha de Entrega:</label>
            <input type="text" :value="rent ? formatDate(rent.deliveryDate) : ''" readonly class="readonly-input" />
          </div>
          <div class="form-group">
            <label>Valor por Día:</label>
            <input type="text" :value="rent ? formatCurrency(rent.totalValuePerDay) : ''" readonly
              class="readonly-input" />
          </div>
          <div class="form-group">
            <label>Valor Garantía:</label>
            <input type="text" :value="rent ? formatCurrency(rent.warrantyValue) : ''" readonly
              class="readonly-input" />
          </div>
        </div>
      </div>

      <!-- Editable Fields -->
      <div class="form-section">
        <h3>Finalización del Arrendamiento</h3>
        <div class="form-grid">
          <div class="form-group">
            <label for="totalDays">Total de Días:</label>
            <input id="totalDays" type="number" v-model.number="finishData.totalDays" min="0.01" step="0.01" required
              class="editable-input" />
            <small class="form-hint">Calculado automáticamente: {{ calculatedDays }} días</small>
          </div>

          <div class="form-group">
            <label for="totalPrice">Precio Total:</label>
            <input id="totalPrice" type="number" v-model.number="finishData.totalPrice" min="0" step="1" required
              class="editable-input" />
            <small class="form-hint">Sugerido: {{ formatCurrency(suggestedPrice) }}</small>
          </div>

          <div class="form-group full-width">
            <label for="observations">Observaciones:</label>
            <textarea id="observations" v-model="finishData.observations" rows="4"
              placeholder="Agregar observaciones adicionales..." class="editable-input"></textarea>
          </div>

          <div class="form-group full-width">
            <div class="checkbox-group">
              <input id="isPaid" type="checkbox" v-model="finishData.isPaid" class="checkbox-input" />
              <label for="isPaid" class="checkbox-label">Arrendamiento Pagado</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="closeModal">
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" @click="handleSubmit">
          Finalizar Arrendamiento
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Rent } from '../types/RentType'

interface FinishRentData {
  totalDays: number
  totalPrice: number
  observations: string
  isPaid: boolean
}

interface Props {
  isOpen: boolean
  rent: Rent | null
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm', data: FinishRentData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const finishData = ref<FinishRentData>({
  totalDays: 0.01,
  totalPrice: 0,
  observations: '',
  isPaid: false
})

// Calculate days between creation date and current date with 2 decimal precision
const calculatedDays = computed(() => {
  if (!props.rent) return 0.01

  const creationDate = new Date(props.rent.createdAt)
  const currentDate = new Date()
  const diffTime = currentDate.getTime() - creationDate.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24) // Convert milliseconds to days

  // Round to 2 decimal places and ensure minimum of 0.01 days
  return Math.max(0.01, Math.round(diffDays * 100) / 100)
})

// Calculate suggested price based on daily rate and total days
const suggestedPrice = computed(() => {
  if (!props.rent) return 0
  return Math.round(props.rent.totalValuePerDay * finishData.value.totalDays)
})

// Watch for changes in calculated days to update the form
watch(calculatedDays, (newDays) => {
  finishData.value.totalDays = newDays
})

// Watch for changes in total days to update suggested price
watch(() => finishData.value.totalDays, (newDays) => {
  if (props.rent) {
    finishData.value.totalPrice = Math.round(props.rent.totalValuePerDay * newDays)
  }
})

// Watch for rent changes to reset form
watch(() => props.rent, (newRent) => {
  if (newRent) {
    const days = calculatedDays.value
    finishData.value = {
      totalDays: days,
      totalPrice: Math.round(newRent.totalValuePerDay * days),
      observations: '',
      isPaid: false
    }
  }
}, { immediate: true })

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-CL')
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount)
}

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!props.rent) return

  if (finishData.value.totalDays < 0.01) {
    alert('El total de días debe ser mayor a 0.01')
    return
  }

  if (finishData.value.totalPrice < 0) {
    alert('El precio total no puede ser negativo')
    return
  }

  emit('confirm', { ...finishData.value })
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

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  border-bottom: 2px solid var(--primary-color-alpha-60);
  padding-bottom: 0.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.readonly-input {
  padding: 0.75rem;
  border: 1px solid var(--border-primary);
  border-radius: 4px;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.editable-input {
  padding: 0.75rem;
  border: 2px solid var(--border-primary);
  border-radius: 4px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: border-color 0.3s ease;
}

.editable-input:focus {
  outline: none;
  border-color: var(--primary-color-alpha-60);
}

.form-hint {
  margin-top: 0.25rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-input {
  width: 18px;
  height: 18px;
}

.checkbox-label {
  margin: 0;
  cursor: pointer;
  font-weight: 500;
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

textarea.editable-input {
  resize: vertical;
  min-height: 100px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .popup-content {
    width: 95%;
    margin: 1rem;
    padding: 2rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
