<template>
  <div class="rent-container">
    <div class="header">
      <h1>Gestión de Arrendamientos</h1>
      <button @click="openCreateModal" class="btn-primary">
        Crear Arrendamiento
      </button>
    </div>

    <!-- Search box -->
    <div class="search-container">
      <input id="searchQuery" type="text" placeholder="Buscar arrendamiento..." class="search-box"
        v-model="searchQuery" />
    </div>

    <Spinner v-if="loading" />

    <div v-else class="rent-content">
      <!-- Netflix/Disney Plus style buttons -->
      <div class="view-selector">
        <button @click="setActiveView('active')" :class="['view-btn', { active: activeView === 'active' }]">
          <div class="btn-content">
            <div class="btn-icon">🏗️</div>
            <div class="btn-text">
              <h3>Arrendamientos Activos</h3>
              <p>Ver todos los arrendamientos en curso</p>
            </div>
          </div>
        </button>

        <button @click="setActiveView('finished')" :class="['view-btn', { active: activeView === 'finished' }]">
          <div class="btn-content">
            <div class="btn-icon">✅</div>
            <div class="btn-text">
              <h3>Arrendamientos Finalizados</h3>
              <p>Historial de arrendamientos completados</p>
            </div>
          </div>
        </button>
      </div>

      <!-- Active Rents Table -->
      <div v-if="activeView === 'active'" class="rent-table-container">
        <div class="table-header">
          <h2>Arrendamientos Activos ({{ filteredActiveRents.length }})</h2>
        </div>

        <div v-if="filteredActiveRents.length === 0" class="no-data">
          <div class="no-data-content">
            <div class="no-data-icon">🏗️</div>
            <h3>No hay arrendamientos activos</h3>
            <p>Todos los arrendamientos han sido finalizados</p>
          </div>
        </div>

        <table v-else class="rent-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Valor/Día</th>
              <th>Cliente</th>
              <th>RUT</th>
              <th>Forma de Pago</th>
              <th>Valor Garantía</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rent in filteredActiveRents" :key="rent.id" class="rent-row">
              <td><span class="code-badge">{{ rent.code }}</span></td>
              <td class="product-name">{{ rent.productName }}</td>
              <td><span class="quantity-badge">{{ rent.quantity }}</span></td>
              <td class="price">${{ formatCurrency(rent.totalValuePerDay) }}</td>
              <td class="client-name">{{ rent.clientName }}</td>
              <td>{{ rent.clientRut }}</td>
              <td>
                <span :class="['payment-badge', getPaymentClass(rent.paymentMethod)]">
                  {{ getPaymentText(rent.paymentMethod) }}
                </span>
              </td>
              <td class="warranty">${{ formatCurrency(rent.warrantyValue) }}</td>
              <td>{{ formatDate(rent.createdAt) }}</td>
              <td class="actions">
                <button @click="editRent(rent)" class="btn-edit" title="Editar">
                  <img src="/icons/edit.svg" alt="Editar" />
                </button>
                <button @click="viewImage(rent)" class="btn-view" title="Ver imagen">
                  <img src="/icons/eye.svg" alt="Ver" />
                </button>
                <button @click="finishRent(rent)" class="btn-finish" title="Finalizar arrendamiento">
                  <!-- Simple currency SVG icon -->
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style="vertical-align: middle;">
                    <circle cx="11" cy="11" r="9" stroke="#ffc107" stroke-width="2" fill="none" />
                    <text x="11" y="15" text-anchor="middle" font-size="12" fill="#ffc107"
                      font-family="Arial, sans-serif">$</text>
                  </svg>
                </button>
                <button @click="printReport(rent)" class="btn-print" title="Imprimir comprobante">
                  📄
                </button>
                <button @click="confirmDelete(rent)" class="btn-delete" title="Eliminar">
                  <img src="/icons/trash.svg" alt="Eliminar" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Finished Rents Table -->
      <div v-if="activeView === 'finished'" class="rent-table-container">
        <div class="table-header">
          <h2>Arrendamientos Finalizados ({{ filteredFinishedRents.length }})</h2>
        </div>

        <div v-if="filteredFinishedRents.length === 0" class="no-data">
          <div class="no-data-content">
            <div class="no-data-icon">✅</div>
            <h3>No hay arrendamientos finalizados</h3>
            <p>Aún no se han completado arrendamientos</p>
          </div>
        </div>

        <table v-else class="rent-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Valor/Día</th>
              <th>Cliente</th>
              <th>RUT</th>
              <th>Fecha Entrega</th>
              <th>Forma de Pago</th>
              <th>Valor Garantía</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rent in filteredFinishedRents" :key="rent.id" class="rent-row">
              <td><span class="code-badge finished">{{ rent.code }}</span></td>
              <td class="product-name">{{ rent.productName }}</td>
              <td><span class="quantity-badge">{{ rent.quantity }}</span></td>
              <td class="price">${{ formatCurrency(rent.totalValuePerDay) }}</td>
              <td class="client-name">{{ rent.clientName }}</td>
              <td>{{ rent.clientRut }}</td>
              <td>{{ formatDate(rent.deliveryDate) }}</td>
              <td>
                <span :class="['payment-badge', getPaymentClass(rent.paymentMethod)]">
                  {{ getPaymentText(rent.paymentMethod) }}
                </span>
              </td>
              <td class="warranty">${{ formatCurrency(rent.warrantyValue) }}</td>
              <td>{{ formatDate(rent.createdAt) }}</td>
              <td class="actions">
                <button @click="editRent(rent)" class="btn-edit" title="Editar">
                  <img src="/icons/edit.svg" alt="Editar" />
                </button>
                <button @click="viewImage(rent)" class="btn-view" title="Ver imagen">
                  <img src="/icons/eye.svg" alt="Ver" />
                </button>
                <button @click="printReport(rent)" class="btn-print" title="Imprimir comprobante">
                  📄
                </button>
                <button @click="confirmDelete(rent)" class="btn-delete" title="Eliminar">
                  <img src="/icons/trash.svg" alt="Eliminar" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="popup-overlay" @click="closeDeleteModal">
      <div class="popup-content delete-modal" @click.stop>
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar el arrendamiento "{{ rentToDelete?.code }}"?</p>
        <div class="form-actions">
          <button @click="closeDeleteModal" class="btn-cancel">Cancelar</button>
          <button @click="deleteRent" class="btn-delete-confirm" :disabled="deleting">
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Upsert Rent Popup -->
    <UpsertRentPopup v-if="showUpsertModal" :rent-data="selectedRent" :mode="upsertMode" @close="closeUpsertModal"
      @save="handleRentSaved" />

    <!-- Client Document Popup -->
    <ClientDocumentPopup :visible="showClientImageModal" :image-src="clientImageSrc" :client-name="clientName"
      @close="closeClientImageModal" />

    <!-- Finish Rent Popup -->
    <FinishRentPopup :is-open="showFinishRentModal" :rent="rentToFinish" @close="closeFinishRentModal"
      @confirm="handleFinishRent" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'RentView' })
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { Rent } from '@/types/RentType'
import { getBaseUrl } from '@/utils/apiConfig'
import { PhotoService } from '@/utils/photoService'
import Spinner from '@/components/Spinner.vue'
import UpsertRentPopup from '@/components/UpsertRentPopup.vue'
import ClientDocumentPopup from '@/components/ClientDocumentPopup.vue'
import FinishRentPopup from '@/components/FinishRentPopup.vue'

interface FinishRentData {
  totalDays: number
  totalPrice: number
  observations: string
  isPaid: boolean
}

const route = useRoute()
const router = useRouter()

const rents = ref<Rent[]>([])
const loading = ref(true)
const searchQuery = ref('')
const activeView = ref<'active' | 'finished'>('active')
const showDeleteModal = ref(false)
const rentToDelete = ref<Rent | null>(null)
const deleting = ref(false)

// Upsert modal state
const showUpsertModal = ref(false)
const selectedRent = ref<Rent | null>(null)
const upsertMode = ref<'create' | 'edit'>('create')

// Client image modal state
const showClientImageModal = ref(false)
const clientImageSrc = ref('')
const clientName = ref('')

// Finish rent modal state
const showFinishRentModal = ref(false)
const rentToFinish = ref<Rent | null>(null)

// API function to fetch rents
const fetchRents = async () => {
  try {
    loading.value = true
    const token = sessionStorage.getItem('token')
    const response = await axios.get(`${getBaseUrl()}/api/v1/rents`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data?.success && response.data?.data) {
      rents.value = response.data.data
    } else {
      console.error('Invalid API response format:', response.data)
      rents.value = []
    }
  } catch (error) {
    console.error('Error fetching rents:', error)
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message)
    }
    rents.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Restore the view state from URL query parameter or localStorage
  const queryView = route.query.view as 'active' | 'finished'
  const savedView = localStorage.getItem('rentView') as 'active' | 'finished'

  if (queryView && (queryView === 'active' || queryView === 'finished')) {
    activeView.value = queryView
  } else if (savedView && (savedView === 'active' || savedView === 'finished')) {
    activeView.value = savedView
    // Update URL to match localStorage
    router.replace({ query: { ...route.query, view: savedView } })
  }

  // Load rents from API
  await fetchRents()
})

// Watch for route changes to handle browser navigation
watch(() => route.query.view, (newView) => {
  if (newView && (newView === 'active' || newView === 'finished')) {
    activeView.value = newView as 'active' | 'finished'
    localStorage.setItem('rentView', newView as 'active' | 'finished')
  }
})

const filteredActiveRents = computed(() => {
  return rents.value
    .filter(rent => !rent.isFinished)
    .filter(rent => {
      if (!searchQuery.value) return true
      const query = searchQuery.value.toLowerCase()
      return (
        rent.code.toLowerCase().includes(query) ||
        rent.productName.toLowerCase().includes(query) ||
        rent.clientName.toLowerCase().includes(query) ||
        rent.clientRut.toLowerCase().includes(query)
      )
    })
})

const filteredFinishedRents = computed(() => {
  return rents.value
    .filter(rent => rent.isFinished)
    .filter(rent => {
      if (!searchQuery.value) return true
      const query = searchQuery.value.toLowerCase()
      return (
        rent.code.toLowerCase().includes(query) ||
        rent.productName.toLowerCase().includes(query) ||
        rent.clientName.toLowerCase().includes(query) ||
        rent.clientRut.toLowerCase().includes(query)
      )
    })
})

const setActiveView = (view: 'active' | 'finished') => {
  activeView.value = view
  // Update URL without page reload
  router.push({ query: { ...route.query, view } })
  // Also save to localStorage as backup
  localStorage.setItem('rentView', view)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL').format(value)
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPaymentClass = (paymentMethod: string) => {
  switch (paymentMethod.toLowerCase()) {
    case 'debito':
      return 'debit'
    case 'credito':
      return 'credit'
    case 'efectivo':
      return 'cash'
    default:
      return 'other'
  }
}

const getPaymentText = (paymentMethod: string) => {
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

const openCreateModal = () => {
  selectedRent.value = null
  upsertMode.value = 'create'
  showUpsertModal.value = true
}

const editRent = (rent: Rent) => {
  selectedRent.value = rent
  upsertMode.value = 'edit'
  showUpsertModal.value = true
}

const closeUpsertModal = () => {
  showUpsertModal.value = false
  selectedRent.value = null
}

const handleRentSaved = (savedRent: Rent) => {
  if (upsertMode.value === 'create') {
    // Add new rent to the beginning of the array
    rents.value.unshift(savedRent)
  } else {
    // Update existing rent
    const index = rents.value.findIndex(r => r.id === savedRent.id)
    if (index > -1) {
      rents.value[index] = savedRent
    }
  }
}

const viewImage = async (rent: Rent) => {
  try {
    const token = sessionStorage.getItem('token')

    // Fetch client data by RUT to get the client info and photo filename
    const response = await axios.get(`${getBaseUrl()}/api/v1/clients`, {
      params: { rut: rent.clientRut },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    if (Array.isArray(response.data.data) && response.data.data.length > 0) {
      console.log('step 3')
      const client = response.data.data[0]

      // Set client name for the popup
      clientName.value = client.name || rent.clientName || 'Cliente'

      // Use the centralized photo service with client ID and photoFileName
      console.log('client.photoFileName:', client.photoFileName)
      const result = await PhotoService.fetchClientPhoto(client.id || client._id, client.photoFileName)

      if (result.success) {
        clientImageSrc.value = result.imageUrl || ''
      } else {
        console.error('Error fetching photo:', result.error)
        clientImageSrc.value = ''
      }

      // Always show the modal (with or without image)
      showClientImageModal.value = true
    } else {
      // Client not found - show popup with rent client name
      clientName.value = rent.clientName || 'Cliente'
      clientImageSrc.value = ''
      showClientImageModal.value = true
    }
  } catch (error) {
    console.error('Error fetching client image:', error)

    // On error, still show the popup with the client name from rent
    clientName.value = rent.clientName || 'Cliente'
    clientImageSrc.value = ''
    showClientImageModal.value = true
  }
};

const closeClientImageModal = () => {
  showClientImageModal.value = false
  clientImageSrc.value = ''
  clientName.value = ''
}

const finishRent = (rent: Rent) => {
  rentToFinish.value = rent
  showFinishRentModal.value = true
}

const printReport = (rent: Rent) => {
  // TODO: Implement print report functionality
  console.log('Print report for rent:', rent)
}

const confirmDelete = (rent: Rent) => {
  rentToDelete.value = rent
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  rentToDelete.value = null
}

const deleteRent = async () => {
  if (!rentToDelete.value) return

  deleting.value = true
  try {
    const token = sessionStorage.getItem('token')
    await axios.delete(`${getBaseUrl()}/api/v1/rents/${rentToDelete.value.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    await updateProductRentStatus(rentToDelete.value.code, false)

    // Remove from local array after successful deletion
    const index = rents.value.findIndex(r => r.id === rentToDelete.value!.id)
    if (index > -1) {
      rents.value.splice(index, 1)
    }
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting rent:', error)
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message)
    }
    // You might want to show a user-friendly error message here
  } finally {
    deleting.value = false
  }
}

const closeFinishRentModal = () => {
  showFinishRentModal.value = false
  rentToFinish.value = null
}

// Update product rental status
const updateProductRentStatus = async (productCode: string, isRented: boolean) => {
  try {
    const token = sessionStorage.getItem('token')

    // First, get the product by code to get its ID
    const getResponse = await axios.get(`${getBaseUrl()}/api/v1/products`, {
      params: { code: productCode },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (Array.isArray(getResponse.data) && getResponse.data.length > 0) {
      const product = getResponse.data[0]

      // Update the product's rented status
      const updatePayload = {
        ...product,
        rented: isRented
      }

      await axios.put(`${getBaseUrl()}/api/v1/products/${product._id}`, updatePayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log(`Product ${productCode} rental status updated to: ${isRented}`)
    } else {
      console.warn(`Product with code ${productCode} not found for status update`)
    }
  } catch (error) {
    console.error('Error updating product rental status:', error)
    // Don't throw here - let rent operations continue even if product update fails
  }
}

const handleFinishRent = async (finishData: FinishRentData) => {
  if (!rentToFinish.value) return

  try {
    const token = sessionStorage.getItem('token')

    // Update the rent with finish data
    const updatedRent = {
      ...rentToFinish.value,
      isFinished: true,
      totalDays: finishData.totalDays,
      totalPrice: finishData.totalPrice,
      observations: finishData.observations,
      isPaid: finishData.isPaid,
      finishDate: new Date().toISOString()
    }

    // Make API call to update the rent
    await axios.put(`${getBaseUrl()}/api/v1/rents/${rentToFinish.value.id}`, updatedRent, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    // Update product status to not rented when finishing the rent
    await updateProductRentStatus(rentToFinish.value.code, false)

    // Update local array
    const index = rents.value.findIndex(r => r.id === rentToFinish.value!.id)
    if (index > -1) {
      rents.value[index] = updatedRent
    }

    closeFinishRentModal()
  } catch (error) {
    console.error('Error finishing rent:', error)
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message)
    }
    // You might want to show a user-friendly error message here
    alert('Error al finalizar el arrendamiento. Por favor, intente nuevamente.')
  }
}
</script>

<style scoped>
.rent-container {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 80px 40px 40px;
  min-height: 100vh;
  background: var(--bg-gradient-primary);
  position: relative;
  transition: all 0.3s ease;
}

.rent-container::before {
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 2rem;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
}

.header h1 {
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px var(--shadow-primary);
  transition: color 0.3s ease;
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

.search-container {
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
}

.search-box {
  width: 100%;
  padding: 16px 20px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1.1rem;
  backdrop-filter: var(--backdrop-blur);
  transition: all 0.3s ease;
}

.search-box::placeholder {
  color: var(--text-muted);
}

.search-box:focus {
  outline: none;
  border-color: var(--primary-color-alpha-60);
  background: var(--bg-tertiary);
  box-shadow: 0 0 20px var(--primary-color-alpha-30);
}

.rent-content {
  position: relative;
  z-index: 1;
  max-width: 1600px;
  margin: 0 auto;
}

.view-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.view-btn {
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 15px;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: var(--backdrop-blur);
  color: var(--text-primary);
  text-align: left;
  min-height: 80px;
  display: flex;
  align-items: center;
}

.view-btn:hover {
  transform: translateY(-2px);
  background: var(--bg-tertiary);
  border-color: var(--border-secondary);
  box-shadow: 0 10px 25px var(--shadow-primary);
}

.view-btn.active {
  background: var(--bg-tertiary);
  border-color: var(--primary-color-alpha-60);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px var(--shadow-primary);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.btn-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.btn-text h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-text p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.8;
  line-height: 1.3;
}

.rent-table-container {
  background: var(--bg-secondary);
  backdrop-filter: var(--backdrop-blur);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid var(--border-primary);
  box-shadow: 0 8px 32px var(--shadow-primary);
}

.table-header {
  margin-bottom: 1.5rem;
}

.table-header h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px var(--shadow-primary);
}

.rent-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.rent-table th {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--border-primary);
  position: sticky;
  top: 0;
  backdrop-filter: var(--backdrop-blur);
}

.rent-table th:first-child {
  border-radius: 0;
}

.rent-table th:last-child {
  border-radius: 0;
}

.rent-row {
  transition: all 0.3s ease;
}

.rent-row:hover {
  background: var(--bg-secondary);
}

.rent-row:hover td {
  background: var(--bg-secondary);
}

.rent-table td {
  padding: 16px 12px;
  border-bottom: 1px solid var(--border-secondary);
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.code-badge {
  background: var(--bg-gradient-primary);
  color: var(--text-primary);
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
}

.code-badge.finished {
  background: var(--bg-secondary);
}

.product-name {
  font-weight: 600;
  color: var(--text-primary);
}

.quantity-badge {
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  padding: 4px 8px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--text-primary);
}

.price,
.warranty {
  font-weight: 600;
  color: var(--text-primary);
}

.client-name {
  font-weight: 500;
  color: var(--text-secondary);
}

.payment-badge {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.payment-badge.debit {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.payment-badge.credit {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.payment-badge.cash {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.payment-badge.other {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-edit,
.btn-delete,
.btn-view,
.btn-finish,
.btn-print {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: var(--backdrop-blur);
}

.btn-edit:hover {
  background: rgba(34, 197, 94, 0.8);
  border-color: rgba(34, 197, 94, 1);
  transform: translateY(-2px);
}

.btn-view:hover {
  background: rgba(59, 130, 246, 0.8);
  border-color: rgba(59, 130, 246, 1);
  transform: translateY(-2px);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.8);
  border-color: rgba(239, 68, 68, 1);
  transform: translateY(-2px);
}

.btn-finish:hover {
  background: rgba(34, 197, 94, 0.8);
  border-color: rgba(34, 197, 94, 1);
  transform: translateY(-2px);
}

.btn-print:hover {
  background: rgba(156, 163, 175, 0.8);
  border-color: rgba(156, 163, 175, 1);
  transform: translateY(-2px);
}

.btn-edit img,
.btn-delete img,
.btn-view img {
  width: 16px;
  height: 16px;
  transition: filter 0.3s ease;
}

/* Dark theme - make icons white */
:root[data-theme='dark'] .btn-edit img,
:root[data-theme='dark'] .btn-view img,
:root[data-theme='dark'] .btn-delete img,
:root:not([data-theme]) .btn-edit img,
:root:not([data-theme]) .btn-view img,
:root:not([data-theme]) .btn-delete img {
  filter: brightness(0) invert(1);
}

/* Light theme - make icons dark */
:root[data-theme='light'] .btn-edit img,
:root[data-theme='light'] .btn-view img,
:root[data-theme='light'] .btn-delete img {
  filter: brightness(0) invert(0.2);
}

.no-data {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-primary);
}

.no-data-content {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 3rem;
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--border-primary);
}

.no-data-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(2px 2px 4px var(--shadow-primary));
}

.no-data h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.no-data p {
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
  color: var(--text-secondary);
}

/* Modal Styles */
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
}

.popup-content {
  background: var(--bg-secondary);
  backdrop-filter: var(--backdrop-blur);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid var(--border-primary);
  box-shadow: 0 8px 32px var(--shadow-primary);
  max-width: 500px;
  width: 90%;
}

.delete-modal h3 {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.delete-modal p {
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-cancel,
.btn-delete-confirm {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-cancel {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.btn-cancel:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--shadow-secondary);
}

.btn-delete-confirm {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));
  color: white;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-delete-confirm:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(239, 68, 68, 1), rgba(220, 38, 38, 1));
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.btn-delete-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .rent-container {
    padding: 80px 10px 20px;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header h1 {
    font-size: 2rem;
  }

  .view-selector {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .view-btn {
    min-height: 70px;
    padding: 0.8rem 1.2rem;
  }

  .btn-icon {
    font-size: 1.5rem;
  }

  .btn-text h3 {
    font-size: 1rem;
  }

  .btn-text p {
    font-size: 0.8rem;
  }

  .rent-table-container {
    margin: 0;
    padding: 1rem;
    overflow-x: auto;
  }

  .rent-table {
    min-width: 1000px;
  }

  .btn-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .btn-icon {
    font-size: 2.5rem;
  }
}
</style>
