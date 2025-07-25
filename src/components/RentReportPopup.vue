<template>
  <div v-if="isOpen" class="popup-overlay" @click.self="closeModal">
    <div class="popup-content report-modal" @click.stop>
      <div class="modal-header">
        <h2>{{ reportTitle }}</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <div class="report-preview" ref="reportContent">
          <div class="report-header">
            <img src="/images/logoayp.jpeg" alt="Logo AYP" class="logo">
            <div class="invoice-number">
              <h5>No. {{ rentId }}</h5>
            </div>
          </div>
          <hr />

          <div class="company-info">
            <div class="report-title">
              <h2>{{ isFinished ? "COMPROBANTE DE DEVOLUCIÓN Y COBRO AYPSPA" : "COMPROBANTE DE ARRIENDO AYPSPA" }}</h2>
              <p>ARRIENDO DE MÁQUINAS Y ANDAMIOS</p>
            </div>

            <div class="contact-info">
              <p>Casa Matriz: Av septiembre 04</p>
              <p>Teléfonos: 652421931 - +56 987531754 - +56 993013623</p>
              <p>Correo: pamenicoruiz@gmail.com</p>
              <p>Página web: http://www.aypspa.net</p>
            </div>
          </div>

          <hr />

          <div class="client-info">
            <p><strong>Facturar a:</strong> {{ rent?.clientName }}</p>
            <p><strong>Número de RUT:</strong> {{ rent?.clientRut }}</p>
            <p><strong>Fecha de Retiro:</strong> {{ formatDate(rent?.createdAt) }}</p>
            <p v-if="isFinished"><strong>Fecha de Entrega:</strong> {{ formatDate(rent?.deliveryDate) }}</p>
            <p><strong>Tipo de garantía:</strong> {{ getPaymentText(rent?.paymentMethod) }}</p>
            <p><strong>Total Garantía:</strong> ${{ formatCurrency(rent?.warrantyValue) }}</p>
            <p v-if="isFinished"><strong>Estado de Pago:</strong> {{ rent?.isPaid ? 'Pagado' : 'Pendiente' }}</p>
          </div>

          <div class="items-table">
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Cant.</th>
                  <th>Descripción</th>
                  <th>Precio/día</th>
                  <th v-if="isFinished">Días</th>
                  <th v-if="isFinished">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ rent?.code }}</td>
                  <td>{{ rent?.quantity }}</td>
                  <td>{{ rent?.productName }}</td>
                  <td>${{ formatCurrency(rent?.totalValuePerDay) }}</td>
                  <td v-if="isFinished">{{ formatDays(rent?.totalDays) }}</td>
                  <td v-if="isFinished">${{ formatCurrency(rent?.totalPrice || 0) }}</td>
                </tr>
              </tbody>
              <tfoot v-if="isFinished">
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Total Factura</th>
                  <th>${{ formatCurrency(rent?.totalPrice || 0) }}</th>
                </tr>
              </tfoot>
            </table>

            <div v-if="isFinished && rent?.observations" class="observations">
              <p><strong>Observaciones:</strong></p>
              <p>{{ rent?.observations }}</p>
            </div>
          </div>

          <div class="terms-section">
            <h4>Condiciones y formas de pago</h4>
            <div class="terms-content">
              <p><strong>Términos y Condiciones</strong></p>
              <p>1.- Garantía: Cheque - Orden de Compra - Transferencia</p>
              <p>2.- Entregado el producto se hace responsable el arrendador de daños o robos del producto.</p>
            </div>

            <div class="signature-section">
              <div class="signature-line">
                <p>___________________________</p>
                <div class="client-signature">
                  <p><strong>{{ rent?.clientName }}</strong></p>
                  <p>{{ rent?.clientRut }}</p>
                </div>
              </div>
            </div>

            <div class="thank-you">
              <h3>¡Gracias por la preferencia!</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn-secondary">Cerrar</button>
        <button @click="downloadPDF" class="btn-primary" :disabled="generating">
          {{ generating ? 'Generando...' : 'Descargar PDF' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Rent } from '@/types/RentType'

interface Props {
  isOpen: boolean
  rent: Rent | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const reportContent = ref<HTMLElement>()
const generating = ref(false)

const isFinished = computed(() => props.rent?.isFinished === true)

const rentId = computed(() => {
  return `${props.rent?.id || 'error'}`
})

const reportTitle = computed(() => {
  return isFinished.value
    ? "Comprobante de Devolución y Cobro"
    : "Comprobante de Arriendo"
})

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatCurrency = (value?: number) => {
  if (!value) return '0'
  return new Intl.NumberFormat('es-CL').format(value)
}

const formatDays = (days?: number) => {
  if (!days) return '0.00'
  return days.toFixed(2)
}

const getPaymentText = (paymentMethod?: string) => {
  if (!paymentMethod) return 'N/A'
  switch (paymentMethod.toLowerCase()) {
    case 'debito':
      return 'Débito'
    case 'credito':
      return 'Crédito'
    case 'efectivo':
      return 'Efectivo'
    case '0':
      return 'Pendiente'
    default:
      return paymentMethod
  }
}

const generateFileName = () => {
  if (!props.rent) return 'comprobante.pdf'

  const clientName = props.rent.clientName.replace(/[^a-zA-Z0-9]/g, '_')
  const identifier = rentId.value
  const type = isFinished.value ? 'devolucion' : 'arriendo'

  return `${type}_${clientName}_${identifier}.pdf`
}

const downloadPDF = async () => {
  if (!reportContent.value) return

  generating.value = true

  try {
    // Importar html2pdf dinámicamente
    const html2pdf = (await import('html2pdf.js')).default

    const options = {
      margin: [0.25, 0.25, 0.25, 0.25],
      filename: generateFileName(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 1.4,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: true
      }
    }

    await html2pdf().set(options).from(reportContent.value).save()
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error al generar el PDF. Por favor, intente nuevamente.')
  } finally {
    generating.value = false
  }
}

const closeModal = () => {
  emit('close')
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
  border: 1px solid var(--border-primary);
  box-shadow: 0 20px 60px var(--shadow-primary);
  max-width: 800px;
  width: 95%;
  max-height: 95vh;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
  display: flex;
  flex-direction: column;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-primary);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-primary);
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.report-preview {
  background: white;
  color: black;
  padding: 0.8rem;
  font-family: 'Montserrat', sans-serif;
  line-height: 1.3;
  font-size: 0.9rem;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.4rem;
}

.logo {
  max-width: 140px;
  height: auto;
}

.invoice-number {
  text-align: right;
}

.invoice-number h5 {
  margin: 0 0 0.2rem 0;
  font-weight: 600;
  font-size: 1rem;
}

.company-info {
  margin: 0.4rem 0;
}

.report-title h2 {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 0.3rem 0;
  color: black;
}

.report-title p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  font-size: 0.85rem;
}

.contact-info p {
  margin: 0.12rem 0;
  font-size: 0.75rem;
}

.client-info {
  margin: 0.6rem 0;
}

.client-info p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
}

.items-table {
  margin: 0.8rem 0;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.6rem;
  font-size: 0.8rem;
}

.invoice-table th,
.invoice-table td {
  border: 1px solid #ddd;
  padding: 0.35rem;
  text-align: left;
}

.invoice-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  font-size: 0.75rem;
}

.invoice-table tfoot th {
  background-color: #e9ecef;
  font-weight: bold;
}

.observations {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 3px;
}

.observations p {
  margin: 0.15rem 0;
  font-size: 0.75rem;
}

.terms-section {
  margin-top: 0.8rem;
}

.terms-section h4 {
  margin: 0 0 0.6rem 0;
  font-weight: 600;
  color: black;
  font-size: 0.95rem;
}

.terms-content p {
  margin: 0.2rem 0;
  font-size: 0.75rem;
  line-height: 1.2;
}

.signature-section {
  margin: 2rem 0;
  text-align: center;
}

.signature-line {
  display: inline-block;
  text-align: center;
}

.signature-line p {
  margin: 1.5rem 0 0.6rem 0;
  font-size: 0.85rem;
}

.client-signature p {
  margin: 0.12rem 0;
  font-weight: 500;
  font-size: 0.8rem;
}

.thank-you {
  text-align: center;
  margin-top: 1rem;
}

.thank-you h3 {
  margin: 0;
  color: black;
  font-weight: 600;
  font-size: 0.95rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
}

.btn-primary,
.btn-secondary {
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

hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 0.5rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .popup-content {
    width: 95%;
    margin: 1rem;
  }

  .modal-header,
  .modal-footer {
    padding: 1rem;
  }

  .report-preview {
    padding: 0.6rem;
    font-size: 0.8rem;
    line-height: 1.2;
  }

  .report-header {
    flex-direction: column;
    gap: 0.3rem;
  }

  .invoice-number {
    text-align: left;
  }

  .logo {
    max-width: 110px;
  }

  .invoice-table {
    font-size: 0.7rem;
  }

  .invoice-table th,
  .invoice-table td {
    padding: 0.25rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
