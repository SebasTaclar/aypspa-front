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
              <th>Tipo Garantía</th>
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
              <td class="warranty-type">{{ rent.warrantyType || 'N/A' }}</td>
              <td>{{ formatDate(rent.createdAt) }}</td>
              <td class="actions active-rent">
                <button @click="editRent(rent)" class="btn-edit" title="Editar">
                  <img src="/icons/edit.svg" alt="Editar" />
                </button>
                <button @click="viewImage(rent)" class="btn-view" title="Ver imagen">
                  <img src="/icons/eye.svg" alt="Ver" />
                </button>
                <button @click="finishRent(rent)" class="btn-finish" title="Finalizar arrendamiento">
                  <!-- Simple currency SVG icon -->
                  <svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"
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
          <h2>Arrendamientos Finalizados ({{ finishedRentsPagination.totalCount }})</h2>
          <div v-if="finishedRentsPagination.totalCount > 0" class="pagination-info">
            Página {{ finishedRentsPagination.currentPage }} de {{ finishedRentsPagination.totalPages }}
            ({{ finishedRentsPagination.totalCount }} total)
          </div>
        </div>

        <div v-if="loadingFinishedRents" class="loading-spinner">
          <Spinner />
        </div>

        <div v-else-if="filteredFinishedRents.length === 0" class="no-data">
          <div class="no-data-content">
            <div class="no-data-icon">✅</div>
            <h3>No hay arrendamientos finalizados</h3>
            <p>{{ searchQuery ? 'Sin resultados' : 'Sin arrendamientos finalizados' }}</p>
          </div>
        </div>

        <div v-else>
          <table class="rent-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Valor/Día</th>
                <th>Días Totales</th>
                <th>Precio Total</th>
                <th>Cliente</th>
                <th>RUT</th>
                <th>Fecha Entrega</th>
                <th>Forma de Pago</th>
                <th>Valor Garantía</th>
                <th>Tipo Garantía</th>
                <th>Estado de Pago</th>
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
                <td class="total-days">{{ formatDays(rent.totalDays) }}</td>
                <td class="total-price">${{ formatCurrency(rent.totalPrice) }}</td>
                <td class="client-name">{{ rent.clientName }}</td>
                <td>{{ rent.clientRut }}</td>
                <td>{{ formatDate(rent.deliveryDate) }}</td>
                <td>
                  <span :class="['payment-badge', getPaymentClass(rent.paymentMethod)]">
                    {{ getPaymentText(rent.paymentMethod) }}
                  </span>
                </td>
                <td class="warranty">${{ formatCurrency(rent.warrantyValue) }}</td>
                <td class="warranty-type">{{ rent.warrantyType || 'N/A' }}</td>
                <td>
                  <span :class="['payment-status-badge', getPaymentStatusClass(rent.isPaid)]">
                    {{ getPaymentStatusText(rent.isPaid) }}
                  </span>
                </td>
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

          <!-- Pagination Controls -->
          <div v-if="finishedRentsPagination.totalPages > 1" class="pagination-controls">
            <button @click="goToPreviousPage"
              :disabled="finishedRentsPagination.currentPage === 1 || loadingFinishedRents" class="btn-pagination">
              ← Anterior
            </button>

            <div class="pagination-pages">
              <button v-for="page in getVisiblePages()" :key="page" @click="goToPage(page)"
                :class="['btn-page', { active: page === finishedRentsPagination.currentPage }]"
                :disabled="loadingFinishedRents">
                {{ page }}
              </button>
            </div>

            <button @click="goToNextPage"
              :disabled="finishedRentsPagination.currentPage === finishedRentsPagination.totalPages || loadingFinishedRents"
              class="btn-pagination">
              Siguiente →
            </button>
          </div>
        </div>
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

    <!-- Rent Report Popup -->
    <RentReportPopup :is-open="showReportModal" :rent="rentToReport" @close="closeReportModal" />

    <!-- Membership Expired Popup -->
    <MembershipExpiredPopup v-if="showMembershipExpiredPopup" @close="closeMembershipExpiredPopup" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'RentView' })
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { Rent } from '@/types/RentType'
import type { UserResponse } from '@/types/UserType'
import { getBaseUrl } from '@/utils/apiConfig'
import { PhotoService } from '@/utils/photoService'
import Spinner from '@/components/Spinner.vue'
import UpsertRentPopup from '@/components/UpsertRentPopup.vue'
import ClientDocumentPopup from '@/components/ClientDocumentPopup.vue'
import FinishRentPopup from '@/components/FinishRentPopup.vue'
import RentReportPopup from '@/components/RentReportPopup.vue'
import MembershipExpiredPopup from '@/components/MembershipExpiredPopup.vue'

interface FinishRentData {
  totalDays: number
  totalPrice: number
  observations: string
  isPaid: boolean
  deliveryDate: string
  paymentMethod: string
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

// Report modal state
const showReportModal = ref(false)
const rentToReport = ref<Rent | null>(null)

// Membership expired modal state
const showMembershipExpiredPopup = ref(false)

// Pagination state for finished rents
const finishedRentsPagination = ref({
  currentPage: 1,
  pageSize: 25,
  totalPages: 0,
  totalCount: 0
})
const loadingFinishedRents = ref(false)

// API function to fetch finished rents with pagination
const fetchFinishedRents = async (page: number = 1, pageSize: number = 25) => {
  try {
    loadingFinishedRents.value = true
    const token = sessionStorage.getItem('token')

    const queryParams = new URLSearchParams({
      type: 'finished',
      page: page.toString(),
      pageSize: pageSize.toString(),
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    })

    // Add search query if exists
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.trim()
      // The backend will search in multiple fields automatically
      queryParams.append('clientName', query)
      queryParams.append('productName', query)
      queryParams.append('code', query)
    }

    const response = await axios.get(`${getBaseUrl()}/api/v1/rents?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data?.success && response.data?.data) {
      if (searchQuery.value.trim()) {
        // If searching, replace only finished rents with search results
        const activeRents = rents.value.filter(rent => !rent.isFinished)
        let finishedRents = response.data.data

        // Sort finished rents by finishDate (or updatedAt) descending - most recent first
        finishedRents = finishedRents.sort((a: unknown, b: unknown) => {
          const rentA = a as Rent
          const rentB = b as Rent
          const dateA = new Date(rentA.finishDate || rentA.updatedAt || rentA.createdAt)
          const dateB = new Date(rentB.finishDate || rentB.updatedAt || rentB.createdAt)
          return dateB.getTime() - dateA.getTime() // Descending order
        })

        rents.value = [...activeRents, ...finishedRents]
      } else {
        // If not searching, replace only finished rents with all finished rents
        const activeRents = rents.value.filter(rent => !rent.isFinished)
        let finishedRents = response.data.data

        // Sort finished rents by finishDate (or updatedAt) descending - most recent first
        finishedRents = finishedRents.sort((a: unknown, b: unknown) => {
          const rentA = a as Rent
          const rentB = b as Rent
          const dateA = new Date(rentA.finishDate || rentA.updatedAt || rentA.createdAt)
          const dateB = new Date(rentB.finishDate || rentB.updatedAt || rentB.createdAt)
          return dateB.getTime() - dateA.getTime() // Descending order
        })

        rents.value = [...activeRents, ...finishedRents]
      }

      // Update pagination info
      if (response.data.pagination) {
        finishedRentsPagination.value = response.data.pagination
      }
    } else {
      console.error('Invalid API response format:', response.data)
    }
  } catch (error) {
    console.error('Error fetching finished rents:', error)
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message)
    }
  } finally {
    loadingFinishedRents.value = false
  }
}

// API function to check user membership status
const checkUserMembership = async () => {
  try {
    const token = sessionStorage.getItem('token')

    const response = await axios.get<UserResponse>(`${getBaseUrl()}/api/v1/users?current=true`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data?.success && response.data?.data) {
      const userData = response.data.data

      // Show popup if membership is not paid
      if (userData.membershipPaid === false) {
        showMembershipExpiredPopup.value = true
      }
    }
  } catch (error) {
    console.error('Error checking user membership:', error)
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message)
    }
  }
}

// Close membership expired popup
const closeMembershipExpiredPopup = () => {
  showMembershipExpiredPopup.value = false
}

// API function to fetch active rents (without pagination)
const fetchActiveRents = async () => {
  try {
    const token = sessionStorage.getItem('token')

    const queryParams = new URLSearchParams({
      type: 'active'
    })

    // Add search query if exists
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.trim()
      queryParams.append('clientName', query)
      queryParams.append('productName', query)
      queryParams.append('code', query)
    }

    const response = await axios.get(`${getBaseUrl()}/api/v1/rents?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data?.success && response.data?.data) {
      if (searchQuery.value.trim()) {
        // If searching, replace only active rents with search results
        const finishedRents = rents.value.filter(rent => rent.isFinished)
        const activeRents = response.data.data
        rents.value = [...activeRents, ...finishedRents]
      } else {
        // If not searching, replace only active rents with all active rents
        const finishedRents = rents.value.filter(rent => rent.isFinished)
        const activeRents = response.data.data
        rents.value = [...activeRents, ...finishedRents]
      }
    } else {
      console.error('Invalid API response format:', response.data)
    }
  } catch (error) {
    console.error('Error fetching active rents:', error)
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message)
    }
  }
}

onMounted(async () => {
  // Check user membership status first
  await checkUserMembership()

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

  // Load rents based on the current view
  loading.value = true
  try {
    if (activeView.value === 'active') {
      await fetchActiveRents()
    } else {
      await fetchFinishedRents()
    }
  } finally {
    loading.value = false
  }
})

// Watch for route changes to handle browser navigation
watch(() => route.query.view, (newView) => {
  if (newView && (newView === 'active' || newView === 'finished')) {
    activeView.value = newView as 'active' | 'finished'
    localStorage.setItem('rentView', newView as 'active' | 'finished')
  }
})

// Watch for search query changes (with debounce)
let searchTimeout: number
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    await handleSearch()
  }, 500) // 500ms debounce
})

const filteredActiveRents = computed(() => {
  const activeRents = rents.value.filter(rent => !rent.isFinished)

  // If there's a search query, the backend already filtered the results
  // so we don't need to apply additional filtering
  if (searchQuery.value.trim()) {
    return activeRents
  }

  // If no search query, return all active rents
  return activeRents
})

const filteredFinishedRents = computed(() => {
  const finishedRents = rents.value.filter(rent => rent.isFinished)

  // If there's a search query, the backend already filtered the results
  // so we don't need to apply additional filtering
  if (searchQuery.value.trim()) {
    return finishedRents
  }

  // If no search query, return all finished rents sorted by date
  return finishedRents.sort((a, b) => {
    // Sort by finishDate (or updatedAt/createdAt) descending - most recent first
    const dateA = new Date(a.finishDate || a.updatedAt || a.createdAt)
    const dateB = new Date(b.finishDate || b.updatedAt || b.createdAt)
    return dateB.getTime() - dateA.getTime()
  })
})

const setActiveView = async (view: 'active' | 'finished') => {
  // Check user membership status when switching views
  await checkUserMembership()

  activeView.value = view
  // Update URL without page reload
  router.push({ query: { ...route.query, view } })
  // Also save to localStorage as backup
  localStorage.setItem('rentView', view)

  // Load data for the selected view
  if (view === 'active') {
    await fetchActiveRents()
  } else {
    // Reset pagination when switching to finished view
    finishedRentsPagination.value.currentPage = 1
    await fetchFinishedRents(1)
  }
}

const formatCurrency = (value?: number) => {
  if (!value) return '0'
  return new Intl.NumberFormat('es-CL').format(value)
}

const formatDays = (days?: number) => {
  if (!days) return '0.00'
  return days.toFixed(2)
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

const getPaymentClass = (paymentMethod?: string | null) => {
  if (!paymentMethod || paymentMethod === undefined || paymentMethod === null) return 'other'

  const safePaymentMethod = String(paymentMethod).toLowerCase()
  switch (safePaymentMethod) {
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

const getPaymentText = (paymentMethod?: string | null) => {
  if (!paymentMethod || paymentMethod === undefined || paymentMethod === null) return 'N/A'

  const safePaymentMethod = String(paymentMethod).toLowerCase()
  switch (safePaymentMethod) {
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

const getPaymentStatusClass = (isPaid?: boolean) => {
  return isPaid ? 'paid' : 'unpaid'
}

const getPaymentStatusText = (isPaid?: boolean) => {
  return isPaid ? 'Pagado' : 'Pendiente'
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

const handleRentSaved = async (savedRent: Rent) => {
  if (upsertMode.value === 'create') {
    // Add new rent to the beginning of the array
    rents.value.unshift(savedRent)
  } else {
    // Update existing rent - force reactivity by replacing the entire array
    const index = rents.value.findIndex(r => r.id === savedRent.id)
    if (index > -1) {
      // Update the specific rent and create a new array to trigger reactivity
      const updatedRents = [...rents.value]
      updatedRents[index] = savedRent
      rents.value = updatedRents
    }
  }

  // Update filtered rents if needed
  if (activeView.value === 'active') {
    await fetchActiveRents()
  } else {
    await fetchFinishedRents(finishedRentsPagination.value.currentPage)
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
  rentToReport.value = rent
  showReportModal.value = true
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

const closeReportModal = () => {
  showReportModal.value = false
  rentToReport.value = null
}

// Pagination functions for finished rents
const goToPage = async (page: number) => {
  if (page >= 1 && page <= finishedRentsPagination.value.totalPages) {
    await fetchFinishedRents(page)
  }
}

const goToPreviousPage = async () => {
  if (finishedRentsPagination.value.currentPage > 1) {
    await goToPage(finishedRentsPagination.value.currentPage - 1)
  }
}

const goToNextPage = async () => {
  if (finishedRentsPagination.value.currentPage < finishedRentsPagination.value.totalPages) {
    await goToPage(finishedRentsPagination.value.currentPage + 1)
  }
}

// Search functionality that respects current view
const handleSearch = async () => {
  if (activeView.value === 'active') {
    await fetchActiveRents()
  } else {
    // Reset to first page when searching
    finishedRentsPagination.value.currentPage = 1
    await fetchFinishedRents(1)
  }
}

// Get visible page numbers for pagination
const getVisiblePages = () => {
  const current = finishedRentsPagination.value.currentPage
  const total = finishedRentsPagination.value.totalPages
  const pages: number[] = []

  // Always show first page
  if (total > 0) pages.push(1)

  // Add pages around current page
  const start = Math.max(2, current - 2)
  const end = Math.min(total - 1, current + 2)

  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) pages.push(i)
  }

  // Always show last page
  if (total > 1 && !pages.includes(total)) pages.push(total)

  return pages.sort((a, b) => a - b)
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
      deliveryDate: finishData.deliveryDate,
      paymentMethod: finishData.paymentMethod,
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

    // Switch to finished rents view and refresh to show the newly finished rent
    activeView.value = 'finished'
    router.push({ query: { ...route.query, view: 'finished' } })
    localStorage.setItem('rentView', 'finished')

    // Reset pagination to first page and fetch finished rents
    finishedRentsPagination.value.currentPage = 1
    await fetchFinishedRents(1)

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
  padding: 80px 5px 40px;
  /* Maximizar espacio horizontal disponible - reducido aún más */
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
  padding: 0 0.5rem;
  max-width: 2000px;
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
  max-width: 2000px;
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
  max-width: 2000px;
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
  padding: 1rem;
  border: 1px solid var(--border-primary);
  box-shadow: 0 8px 32px var(--shadow-primary);
  overflow-x: auto;
  /* Agregar scroll horizontal siempre */
  width: 100%;
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
  min-width: 1570px;
  /* Ajustar ancho mínimo para acomodar la columna de acciones más grande */
  table-layout: fixed;
  /* Usar layout fijo para controlar anchos de columnas */
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

/* Regla last-child eliminada - usando reglas específicas por tabla */

/* Estilos específicos para anchos de columnas */
.rent-table th:nth-child(1),
/* Código */
.rent-table td:nth-child(1) {
  width: 80px;
  min-width: 80px;
}

.rent-table th:nth-child(2),
/* Producto */
.rent-table td:nth-child(2) {
  width: 180px;
  min-width: 180px;
}

.rent-table th:nth-child(3),
/* Cantidad */
.rent-table td:nth-child(3) {
  width: 80px;
  min-width: 80px;
  text-align: center;
}

.rent-table th:nth-child(4),
/* Valor/Día */
.rent-table td:nth-child(4) {
  width: 100px;
  min-width: 100px;
}

.rent-table th:nth-child(5),
/* Cliente o Días Totales */
.rent-table td:nth-child(5) {
  width: 90px;
  min-width: 90px;
}

.rent-table th:nth-child(6),
/* RUT o Precio Total */
.rent-table td:nth-child(6) {
  width: 110px;
  min-width: 110px;
}

.rent-table th:nth-child(7),
/* Forma de Pago o Cliente */
.rent-table td:nth-child(7) {
  width: 120px;
  min-width: 120px;
}

.rent-table th:nth-child(8),
/* Valor Garantía o RUT */
.rent-table td:nth-child(8) {
  width: 90px;
  min-width: 90px;
}

.rent-table th:nth-child(9),
/* Tipo Garantía o Fecha Entrega */
.rent-table td:nth-child(9) {
  width: 85px;
  min-width: 85px;
}

.rent-table th:nth-child(10),
/* Fecha Creación o Forma de Pago */
.rent-table td:nth-child(10) {
  width: 100px;
  min-width: 100px;
}

/* Regla general para last-child eliminada - usando reglas específicas por tabla */

/* Reglas específicas para celdas de datos por posición */
/* Active rents - columna 11 */
/* Active rents - columna 11 */
.rent-table td:nth-child(11) {
  width: auto !important;
  min-width: auto !important;
  max-width: none !important;
  padding: 16px 8px !important;
  box-sizing: border-box;
  text-align: center;
}

/* Finished rents - columna 15 */
.rent-table td:nth-child(15) {
  width: auto !important;
  min-width: auto !important;
  max-width: none !important;
  padding: 16px 8px !important;
  box-sizing: border-box;
  text-align: center;
}

/* FINISHED RENTS TABLE - Otras columnas específicas */
.rent-table th:nth-child(12),
.rent-table td:nth-child(12) {
  width: 80px;
  min-width: 80px;
}

.rent-table th:nth-child(13),
.rent-table td:nth-child(13) {
  width: 85px;
  min-width: 85px;
}

.rent-table th:nth-child(14),
.rent-table td:nth-child(14) {
  width: 100px;
  min-width: 100px;
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
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
  line-height: 1.3;
  word-wrap: break-word;
  max-width: 180px;
}

.quantity-badge {
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  padding: 4px 8px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--text-primary);
  display: inline-block;
  min-width: 24px;
  text-align: center;
}

.price,
.warranty,
.warranty-type,
.total-days,
.total-price {
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

.payment-status-badge {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.payment-status-badge.paid {
  background: rgba(34, 197, 94, 0.2);
  color: rgba(34, 197, 94, 1);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.payment-status-badge.unpaid {
  background: rgba(239, 68, 68, 0.2);
  color: rgba(239, 68, 68, 1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.pagination-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.btn-pagination {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: var(--backdrop-blur);
}

.btn-pagination:hover:not(:disabled) {
  background: var(--bg-tertiary);
  border-color: var(--border-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--shadow-secondary);
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.pagination-pages {
  display: flex;
  gap: 0.5rem;
}

.btn-page {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: var(--backdrop-blur);
  min-width: 40px;
}

.btn-page:hover:not(:disabled) {
  background: var(--bg-tertiary);
  border-color: var(--border-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--shadow-secondary);
}

.btn-page.active {
  background: var(--primary-gradient);
  color: white;
  border-color: var(--primary-color-alpha-60);
  box-shadow: 0 4px 15px var(--primary-color-alpha-30);
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.total-days,
.total-price {
  font-weight: 600;
  color: var(--text-primary);
}

.actions {
  display: grid;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 8px;
  min-height: 60px;
  width: 100%;
  max-width: 200px;
  grid-template-columns: repeat(2, 45px);
  grid-template-rows: repeat(2, 45px);
  box-sizing: border-box;
}

/* Configuración específica para arrendamientos activos (5 botones en 2 filas: 3+2) */
.actions.active-rent {
  grid-template-columns: repeat(3, 40px);
  grid-template-rows: repeat(2, 40px);
  min-height: 60px;
  max-width: 200px;
  padding: 8px;
  gap: 8px !important;
  justify-content: center;
}

.btn-edit,
.btn-delete,
.btn-view,
.btn-finish,
.btn-print {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: var(--backdrop-blur);
  width: 45px;
  height: 45px;
  min-width: 45px;
}

/* Botones para arrendamientos activos (2 filas) - más grandes con el espacio extra */
.actions.active-rent .btn-edit,
.actions.active-rent .btn-delete,
.actions.active-rent .btn-view,
.actions.active-rent .btn-finish,
.actions.active-rent .btn-print {
  width: 40px;
  height: 40px;
  padding: 8px;
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

.btn-print {
  font-size: 20px;
}

/* Tamaño para arrendamientos activos */
.actions.active-rent .btn-print {
  font-size: 18px;
}

.actions.active-rent .btn-finish svg {
  width: 22px;
  height: 22px;
}

.btn-print:hover {
  background: rgba(156, 163, 175, 0.8);
  border-color: rgba(156, 163, 175, 1);
  transform: translateY(-2px);
}

.btn-edit img,
.btn-delete img,
.btn-view img {
  width: 20px;
  height: 20px;
  transition: filter 0.3s ease;
}

/* Iconos para arrendamientos activos - mantener buen tamaño */
.actions.active-rent .btn-edit img,
.actions.active-rent .btn-delete img,
.actions.active-rent .btn-view img {
  width: 18px;
  height: 18px;
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

/* Para pantallas grandes, utilizar más espacio */
@media (min-width: 1200px) {
  .rent-container {
    padding: 80px 2px 40px;
    /* Minimizar padding lateral al máximo en pantallas grandes */
  }

  .rent-table-container {
    padding: 1.5rem;
    /* Mantener padding interno apropiado */
  }

  .rent-table {
    min-width: 1670px;
    /* Ancho moderado para pantallas grandes */
  }

  /* Ajustar anchos para pantallas grandes */
  .rent-table th:nth-child(2),
  /* Producto */
  .rent-table td:nth-child(2) {
    width: 220px;
    min-width: 220px;
  }

  .rent-table th:nth-child(3),
  /* Cantidad */
  .rent-table td:nth-child(3) {
    width: 90px;
    min-width: 90px;
  }

  .rent-table th:nth-child(4),
  /* Valor/Día */
  .rent-table td:nth-child(4) {
    width: 110px;
    min-width: 110px;
  }

  .rent-table th:nth-child(6),
  /* RUT o Precio Total */
  .rent-table td:nth-child(6) {
    width: 130px;
    min-width: 130px;
  }

  .rent-table th:nth-child(7),
  /* Forma de Pago o Cliente */
  .rent-table td:nth-child(7) {
    width: 130px;
    min-width: 130px;
  }

  .rent-table th:nth-child(8),
  /* Valor Garantía o RUT */
  .rent-table td:nth-child(8) {
    width: 110px;
    min-width: 110px;
  }

  .rent-table th:nth-child(9),
  /* Tipo Garantía o Fecha Entrega */
  .rent-table td:nth-child(9) {
    width: 95px;
    min-width: 95px;
  }

  .rent-table th:nth-child(10),
  /* Forma de Pago en tabla finalizados */
  .rent-table td:nth-child(10) {
    width: 130px;
    min-width: 130px;
  }

  /* Regla last-child del media query eliminada - usando reglas específicas */

  /* Reglas simples para acciones en media query */
  .rent-table th:nth-child(11),
  .rent-table td:nth-child(11) {
    width: 160px;
    min-width: 160px;
    text-align: center;
  }

  .rent-table th:nth-child(15),
  .rent-table td:nth-child(15) {
    width: 160px;
    min-width: 160px;
    text-align: center;
  }

  /* Ajustar también las acciones para pantallas grandes */
  .actions {
    max-width: 160px;
    padding: 8px;
    gap: 4px;
  }

  .actions.active-rent {
    max-width: 160px;
    padding: 8px;
    gap: 6px;
  }
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
    min-width: 1500px;
    /* Ancho moderado en responsive también */
  }

  .btn-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .btn-icon {
    font-size: 2.5rem;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-pages {
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-pagination,
  .btn-page {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}

/* Reglas simples para acciones como las otras columnas */
.rent-table th:nth-child(11),
.rent-table td:nth-child(11) {
  width: 140px;
  min-width: 140px;
  text-align: center;
}

.rent-table th:nth-child(15),
.rent-table td:nth-child(15) {
  width: 140px;
  min-width: 140px;
  text-align: center;
}
</style>
