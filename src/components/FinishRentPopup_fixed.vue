<template>
 <div v-if="isOpen" class="modal-overlay" @click="closeModal">
  <div class="modal-content" @click.stop>
   <div class="modal-header">
    <h2>Finalizar y Cobrar Arrendamiento</h2>
    <button class="close-btn" @click="closeModal">&times;</button>
   </div>

   <div class="modal-body">
    <form @submit.prevent="handleSubmit">
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
        <input type="text" :value="rent ? formatCurrency(rent.totalValuePerDay) : ''" readonly class="readonly-input" />
       </div>
       <div class="form-group">
        <label>Valor Garantía:</label>
        <input type="text" :value="rent ? formatCurrency(rent.warrantyValue) : ''" readonly class="readonly-input" />
       </div>
      </div>
     </div>

     <!-- Editable Fields -->
     <div class="form-section">
      <h3>Finalización del Arrendamiento</h3>
      <div class="form-grid">
       <div class="form-group">
        <label for="totalDays">Total de Días:</label>
        <input id="totalDays" type="number" v-model.number="finishData.totalDays" min="1" required
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
    </form>
   </div>

   <div class="modal-footer">
    <button type="button" class="btn-cancel" @click="closeModal">
     Cancelar
    </button>
    <button type="submit" class="btn-confirm" @click="handleSubmit">
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
 totalDays: 1,
 totalPrice: 0,
 observations: '',
 isPaid: false
})

// Calculate days between delivery date and current date
const calculatedDays = computed(() => {
 if (!props.rent) return 1

 const deliveryDate = new Date(props.rent.deliveryDate)
 const currentDate = new Date()
 const diffTime = Math.abs(currentDate.getTime() - deliveryDate.getTime())
 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

 return Math.max(1, diffDays)
})

// Calculate suggested price based on daily rate and total days
const suggestedPrice = computed(() => {
 if (!props.rent) return 0
 return props.rent.totalValuePerDay * finishData.value.totalDays
})

// Watch for changes in calculated days to update the form
watch(calculatedDays, (newDays) => {
 finishData.value.totalDays = newDays
})

// Watch for changes in total days to update suggested price
watch(() => finishData.value.totalDays, (newDays) => {
 if (props.rent) {
  finishData.value.totalPrice = props.rent.totalValuePerDay * newDays
 }
})

// Watch for rent changes to reset form
watch(() => props.rent, (newRent) => {
 if (newRent) {
  const days = calculatedDays.value
  finishData.value = {
   totalDays: days,
   totalPrice: newRent.totalValuePerDay * days,
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

 // Validate required fields
 if (finishData.value.totalDays < 1) {
  alert('El total de días debe ser mayor a 0')
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
.modal-overlay {
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

.modal-content {
 background: var(--color-background);
 border-radius: 8px;
 box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
 width: 90%;
 max-width: 800px;
 max-height: 90vh;
 overflow-y: auto;
 color: var(--color-text);
}

.modal-header {
 display: flex;
 justify-content: space-between;
 align-items: center;
 padding: 1.5rem;
 border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
 margin: 0;
 color: var(--color-heading);
}

.close-btn {
 background: none;
 border: none;
 font-size: 1.5rem;
 cursor: pointer;
 color: var(--color-text);
 padding: 0;
 width: 30px;
 height: 30px;
 display: flex;
 align-items: center;
 justify-content: center;
}

.close-btn:hover {
 color: var(--color-text-hover);
}

.modal-body {
 padding: 1.5rem;
}

.form-section {
 margin-bottom: 2rem;
}

.form-section h3 {
 margin: 0 0 1rem 0;
 color: var(--color-heading);
 border-bottom: 2px solid var(--vt-c-brand);
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
 color: var(--color-text);
}

.readonly-input {
 padding: 0.75rem;
 border: 1px solid var(--color-border);
 border-radius: 4px;
 background-color: var(--color-background-mute);
 color: var(--color-text-muted);
 cursor: not-allowed;
}

.editable-input {
 padding: 0.75rem;
 border: 2px solid var(--color-border);
 border-radius: 4px;
 background-color: var(--color-background);
 color: var(--color-text);
 transition: border-color 0.3s ease;
}

.editable-input:focus {
 outline: none;
 border-color: var(--vt-c-brand);
}

.form-hint {
 margin-top: 0.25rem;
 color: var(--color-text-muted);
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
 accent-color: var(--vt-c-brand);
}

.checkbox-label {
 margin: 0;
 cursor: pointer;
 font-weight: 500;
}

.modal-footer {
 display: flex;
 justify-content: flex-end;
 gap: 1rem;
 padding: 1.5rem;
 border-top: 1px solid var(--color-border);
}

.btn-cancel {
 padding: 0.75rem 1.5rem;
 border: 2px solid var(--color-border);
 border-radius: 4px;
 background-color: transparent;
 color: var(--color-text);
 cursor: pointer;
 font-weight: 500;
 transition: all 0.3s ease;
}

.btn-cancel:hover {
 background-color: var(--color-background-mute);
 border-color: var(--color-text);
}

.btn-confirm {
 padding: 0.75rem 1.5rem;
 border: 2px solid var(--vt-c-brand);
 border-radius: 4px;
 background-color: var(--vt-c-brand);
 color: white;
 cursor: pointer;
 font-weight: 500;
 transition: all 0.3s ease;
}

.btn-confirm:hover {
 background-color: var(--vt-c-brand-dark);
 border-color: var(--vt-c-brand-dark);
}

textarea.editable-input {
 resize: vertical;
 min-height: 100px;
}

@media (max-width: 768px) {
 .form-grid {
  grid-template-columns: 1fr;
 }

 .modal-content {
  width: 95%;
  margin: 1rem;
 }

 .modal-footer {
  flex-direction: column;
 }

 .btn-cancel,
 .btn-confirm {
  width: 100%;
 }
}
</style>
