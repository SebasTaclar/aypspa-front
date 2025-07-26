<template>
  <div class="popup-overlay" @click.self="handleOverlayClick">
    <div class="popup-content">
      <h2>{{ mode === 'edit' ? 'Editar Arrendamiento' : 'Crear Arrendamiento' }}</h2>

      <!-- Warning notifications -->
      <div v-if="showProductWarning || showClientWarning || showRentalWarning" class="warnings-container">
        <div v-if="showRentalWarning" class="warning-item warning-rental">
          <div class="warning-icon">🚫</div>
          <div class="warning-content">
            <div class="warning-title">Producto ya está arrendado</div>
            <div class="warning-details">
              El producto <strong>{{ rent.code }}</strong> - {{ rent.productName }} ya se encuentra arrendado y no está
              disponible.
              <br><small>Por favor, seleccione otro producto o espere a que termine el arrendamiento actual.</small>
            </div>
          </div>
        </div>

        <div v-if="showProductWarning" class="warning-item warning-product">
          <div class="warning-icon">
            <!-- Simple currency SVG icon -->
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="10" stroke="#ffc107" stroke-width="2" fill="none" />
              <text x="11" y="15" text-anchor="middle" font-size="12" fill="#ffc107"
                font-family="Arial, sans-serif">$</text>
            </svg>
          </div>
          <div class="warning-content">
            <div class="warning-title">Se creará un nuevo producto</div>
            <div class="warning-details">
              <strong>Código:</strong> {{ rent.code }} |
              <strong>Nombre:</strong> {{ rent.productName }} |
              <strong>Marca:</strong> {{ productBrand }}
            </div>
          </div>
        </div>

        <div v-if="showClientWarning" class="warning-item warning-client">
          <div class="warning-icon">⚠️</div>
          <div class="warning-content">
            <div class="warning-title">Se creará un nuevo cliente</div>
            <div class="warning-details">
              <strong>RUT:</strong> {{ rent.clientRut }} |
              <strong>Nombre:</strong> {{ rent.clientName }}
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="saveRent">
        <div class="form-row">
          <div class="form-group">
            <label for="code">Código</label>
            <input id="code" v-model="rent.code" type="text" required placeholder="Ej: GEN18" @blur="loadProductByCode"
              @input="onCodeInput" />
            <div v-if="loadingProduct" class="loading-indicator">Cargando producto...</div>
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

        <div class="form-group">
          <label for="brand">Marca del Producto</label>
          <input id="brand" v-model="productBrand" type="text" required placeholder="Ej: DUCAR" />
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

        <div class="form-group">
          <label for="warrantyType">Tipo de Garantía</label>
          <select id="warrantyType" v-model="rent.warrantyType" required>
            <option value="">Seleccionar tipo de garantía</option>
            <option value="cheque">Cheque</option>
            <option value="transferencia">Transferencia</option>
            <option value="efectivo">Efectivo</option>
            <option value="orden_compra">Orden de compra</option>
          </select>
        </div>

        <!-- Separator line between product and client -->
        <div class="form-separator"></div>

        <div class="form-row">
          <div class="form-group">
            <label for="clientRut">RUT del Cliente</label>
            <input id="clientRut" v-model="rent.clientRut" type="text" required placeholder="12.345.678-9"
              @blur="loadClientByRut" @input="onRutInput" />
            <div v-if="loadingClient" class="loading-indicator">Cargando cliente...</div>
          </div>
          <div class="form-group">
            <label for="clientName">Nombre del Cliente</label>
            <input id="clientName" v-model="rent.clientName" type="text" required
              placeholder="Nombre completo del cliente" />
          </div>
        </div>

        <!-- Separator line between client and delivery -->
        <div class="form-separator"></div>

        <!-- Observations Field -->
        <div class="form-group">
          <label for="observations">Observaciones</label>
          <textarea id="observations" v-model="rent.observations" rows="3"
            placeholder="Agregar observaciones adicionales (opcional)..." />
        </div>

        <!-- Payment Method - Only show for finished rents -->
        <div v-if="mode === 'edit' && rent.isFinished" class="form-group">
          <label for="paymentMethod">Forma de Pago</label>
          <select id="paymentMethod" v-model="rent.paymentMethod" :required="rent.isFinished">
            <option value="">Seleccionar forma de pago</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div class="form-group" v-if="mode === 'edit'">
          <label for="deliveryDate">Fecha de Entrega</label>
          <input id="deliveryDate" v-model="deliveryDateFormatted" type="datetime-local"
            placeholder="Fecha de entrega (opcional)" :readonly="rent.isFinished"
            :class="{ 'readonly-input': rent.isFinished, 'editable-input': !rent.isFinished }" />
        </div>

        <!-- Checkbox Controls -->
        <div v-if="mode === 'edit'" class="checkbox-container">
          <div class="checkbox-group">
            <input id="isFinished" type="checkbox" v-model="rent.isFinished" class="checkbox-input"
              :disabled="rent.isFinished" :class="{ 'checkbox-disabled': rent.isFinished }" />
            <label for="isFinished" class="checkbox-label" :class="{ 'label-disabled': rent.isFinished }">
              Arrendamiento Finalizado
            </label>
          </div>
        </div>

        <!-- Payment Status Control - Only show for finished rents -->
        <div v-if="mode === 'edit' && rent.isFinished" class="checkbox-container">
          <div class="checkbox-group">
            <input id="isPaid" type="checkbox" v-model="rent.isPaid" class="checkbox-input" />
            <label for="isPaid" class="checkbox-label">
              Estado de Pago:
              <span :class="rent.isPaid ? 'status-paid' : 'status-pending'">
                {{ rent.isPaid ? 'Pagado' : 'Pendiente' }}
              </span>
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="handleOverlayClick">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading || showRentalWarning">
            {{ showRentalWarning ? 'Producto no disponible' : (loading ? 'Guardando...' : 'Guardar') }}
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
import { ref, computed, onMounted, watch } from 'vue'
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

// Function to handle product status update when rent is deleted (called from parent)
const handleRentDeletion = async (productCode: string) => {
  await updateProductRentStatus(productCode, false)
}

// Expose the function so parent component can call it
defineExpose({
  handleRentDeletion
})

const loading = ref(false)
const showConfirmation = ref(false)
const loadingProduct = ref(false)
const loadingClient = ref(false)
const productBrand = ref('')

// Warning states
const productExists = ref(true) // Assume exists until proven otherwise
const clientExists = ref(true) // Assume exists until proven otherwise
const productIsRented = ref(false) // Track if product is already rented

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
  warrantyType: mode === 'create' ? '' : (rentData?.warrantyType || ''),
  createdAt: mode === 'create' ? new Date().toISOString() : (rentData?.createdAt || new Date().toISOString()),
  isFinished: mode === 'create' ? false : (rentData?.isFinished || false),
  isPaid: mode === 'create' ? false : (rentData?.isPaid || false),
  totalDays: mode === 'create' ? undefined : rentData?.totalDays,
  totalPrice: mode === 'create' ? undefined : rentData?.totalPrice,
  observations: mode === 'create' ? '' : (rentData?.observations || '')
})

// Watcher to validate warrantyValue
watch(() => rent.value.warrantyValue, (newValue) => {
  if (isNaN(newValue) || newValue === null || newValue === undefined) {
    rent.value.warrantyValue = 0
  }
})

// Computed property for datetime-local format
const deliveryDateFormatted = computed({
  get: () => {
    if (!rent.value.deliveryDate) return ''
    // Convert ISO string to datetime-local format (yyyy-MM-ddThh:mm)
    const date = new Date(rent.value.deliveryDate)
    if (isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
  },
  set: (value: string) => {
    if (!value) {
      rent.value.deliveryDate = ''
      return
    }
    // Convert datetime-local format back to ISO string
    rent.value.deliveryDate = new Date(value).toISOString()
  }
})

// Auto-loading functionality for product by code
const loadProductByCode = async () => {
  if (!rent.value.code.trim()) return

  loadingProduct.value = true
  try {
    const token = sessionStorage.getItem('token')
    const response = await axios.get(`${getBaseUrl()}/api/v1/products`, {
      params: { code: rent.value.code },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    // Handle direct array response from API
    if (Array.isArray(response.data) && response.data.length > 0) {
      // Find exact match (case-insensitive) for the product code
      const exactMatch = response.data.find(product =>
        product.code && product.code.toLowerCase() === rent.value.code.trim().toLowerCase()
      )

      if (exactMatch) {
        // Product exists - update flag
        productExists.value = true

        // Check if product is already rented (only in create mode)
        if (mode === 'create') {
          productIsRented.value = exactMatch.rented === true
        } else {
          // In edit mode, don't show rental warning for current product
          productIsRented.value = false
        }

        // Auto-fill product information
        rent.value.productName = exactMatch.name || ''
        rent.value.totalValuePerDay = exactMatch.priceNet || 0
        rent.value.warrantyValue = exactMatch.priceWarranty || 0
        productBrand.value = exactMatch.brand || ''
      } else {
        console.log('No exact match found for code:', rent.value.code)
        // Product doesn't exist - update flag
        productExists.value = false
        productIsRented.value = false

        // Clear fields if no exact match found
        if (mode === 'create') {
          rent.value.productName = ''
          rent.value.totalValuePerDay = 0
          rent.value.warrantyValue = 0
          productBrand.value = ''
        }
      }
    } else {
      console.log('No products found for code:', rent.value.code)
      // Product doesn't exist - update flag
      productExists.value = false
      productIsRented.value = false

      // Clear fields if no product found
      if (mode === 'create') {
        rent.value.productName = ''
        rent.value.totalValuePerDay = 0
        rent.value.warrantyValue = 0
        productBrand.value = ''
      }
    }
  } catch (error) {
    console.error('Error loading product:', error)
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message)
    }
  } finally {
    loadingProduct.value = false
  }
}

// Debounce input to avoid too many requests
let codeInputTimeout: number | null = null
const onCodeInput = () => {
  if (codeInputTimeout) {
    clearTimeout(codeInputTimeout)
  }

  // Clear fields immediately if code is empty
  if (!rent.value.code.trim()) {
    productExists.value = true // Reset warning
    productIsRented.value = false // Reset rented status
    if (mode === 'create') {
      rent.value.productName = ''
      rent.value.totalValuePerDay = 0
      rent.value.warrantyValue = 0
      productBrand.value = ''
    }
    return
  }

  codeInputTimeout = setTimeout(() => {
    if (rent.value.code.trim().length >= 2) { // Back to 2 characters for faster response
      loadProductByCode()
    }
  }, 300) // Reduced delay for faster response
}

// Auto-loading functionality for client by RUT
const loadClientByRut = async () => {
  if (!rent.value.clientRut.trim()) return

  loadingClient.value = true
  try {
    const token = sessionStorage.getItem('token')
    const response = await axios.get(`${getBaseUrl()}/api/v1/clients`, {
      params: { rut: rent.value.clientRut },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    console.log('Client search response:', response)
    if (Array.isArray(response.data.data) && response.data.data.length > 0) {
      const client = response.data.data[0]

      clientExists.value = true

      rent.value.clientName = client.name || ''
    } else {
      console.log('No client found for RUT:', rent.value.clientRut)
      // Client doesn't exist - update flag
      clientExists.value = false
      // Don't clear name field if no client found - user might be entering new client
    }
  } catch (error) {
    console.error('Error loading client:', error)
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message)
    }
  } finally {
    loadingClient.value = false
  }
}

// Debounce RUT input to avoid too many requests
let rutInputTimeout: number | null = null
const onRutInput = () => {
  if (rutInputTimeout) {
    clearTimeout(rutInputTimeout)
  }

  // Clear name field immediately if RUT is empty
  if (!rent.value.clientRut.trim()) {
    clientExists.value = true // Reset warning
    if (mode === 'create') {
      rent.value.clientName = ''
    }
    return
  }

  rutInputTimeout = setTimeout(() => {
    if (rent.value.clientRut.trim().length >= 5) { // Minimum RUT length check
      loadClientByRut()
    }
  }, 300) // Reduced delay for faster response
}

const hasChanges = computed(() => {
  if (mode === 'create') {
    // For create mode, check if any field has been filled (excluding default values)
    const currentRent = rent.value
    return !!(
      currentRent.code.trim() ||
      currentRent.productName.trim() ||
      productBrand.value.trim() ||
      currentRent.quantity !== 1 ||
      currentRent.totalValuePerDay !== 0 ||
      currentRent.clientRut.trim() ||
      currentRent.clientName.trim() ||
      currentRent.warrantyValue !== 0 ||
      currentRent.warrantyType.trim() ||
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
      current.warrantyType !== original.warrantyType ||
      current.deliveryDate !== original.deliveryDate ||
      current.isFinished !== original.isFinished ||
      current.isPaid !== original.isPaid ||
      productBrand.value.trim() // Brand changes for edit mode
    )
  }
})

// Warning computed properties
const showProductWarning = computed(() => {
  return mode === 'create' &&
    !productExists.value &&
    rent.value.code.trim().length >= 2 && // Show when we have enough to search
    rent.value.productName.trim() &&
    productBrand.value.trim() &&
    rent.value.totalValuePerDay > 0
})

const showClientWarning = computed(() => {
  return mode === 'create' &&
    !clientExists.value &&
    rent.value.clientRut.trim().length >= 5 && // Keep 5 for RUT validation
    rent.value.clientName.trim()
})

const showRentalWarning = computed(() => {
  return mode === 'create' &&
    productExists.value &&
    productIsRented.value &&
    rent.value.code.trim().length >= 2 // Show when we have enough to search
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
  // Prevent submission if trying to rent an already rented product
  if (mode === 'create' && showRentalWarning.value) {
    alert('No es posible arrendar este producto porque ya se encuentra arrendado.')
    return
  }

  // Basic validation for required fields
  if (!rent.value.code.trim()) {
    alert('El código del producto es requerido')
    return
  }

  if (!rent.value.productName.trim()) {
    alert('El nombre del producto es requerido')
    return
  }

  if (!rent.value.clientRut.trim()) {
    alert('El RUT del cliente es requerido')
    return
  }

  if (!rent.value.clientName.trim()) {
    alert('El nombre del cliente es requerido')
    return
  }

  if (rent.value.quantity <= 0) {
    alert('La cantidad debe ser mayor a 0')
    return
  }

  if (rent.value.totalValuePerDay <= 0) {
    alert('El valor por día debe ser mayor a 0')
    return
  }

  loading.value = true
  try {
    // Check if product exists and create if needed (only for create mode)
    if (mode === 'create') {
      await ensureProductExists()
      await ensureClientExists()
    }

    const rentPayload = {
      ...rent.value,
      // Ensure dates are in proper format
      createdAt: rent.value.createdAt || new Date().toISOString(),
      deliveryDate: rent.value.deliveryDate || ''
    }

    if (mode === 'edit') {
      await handleEditRent(rentPayload)
    } else {
      await handleCreateRent(rentPayload)
    }
  } catch (error) {
    console.error('Error saving rent:', error)

    let errorMessage = 'Error desconocido al guardar el arrendamiento'

    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message)

      // Extract error message from backend response
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos. Por favor revise los campos requeridos.'
      } else if (error.response?.status === 401) {
        errorMessage = 'No autorizado. Por favor inicie sesión nuevamente.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor. Por favor intente nuevamente.'
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    // You could show a toast notification here instead of just console.error
    alert(`Error: ${errorMessage}`)
  } finally {
    loading.value = false
  }
}

// Ensure product exists, create if it doesn't
const ensureProductExists = async () => {
  if (!rent.value.code.trim()) {
    throw new Error('El código del producto es requerido')
  }

  if (!rent.value.productName.trim()) {
    throw new Error('El nombre del producto es requerido')
  }

  if (!productBrand.value.trim()) {
    throw new Error('La marca del producto es requerida')
  }

  if (rent.value.totalValuePerDay <= 0) {
    throw new Error('El valor por día debe ser mayor a 0')
  }

  try {
    const token = sessionStorage.getItem('token')

    // Check if product exists
    const checkResponse = await axios.get(`${getBaseUrl()}/api/v1/products`, {
      params: { code: rent.value.code },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    // If product doesn't exist, create it
    if (!Array.isArray(checkResponse.data) || checkResponse.data.length === 0) {
      const productPayload = {
        name: rent.value.productName,
        code: rent.value.code,
        brand: productBrand.value,
        priceNet: rent.value.totalValuePerDay,
        priceIva: Math.round(rent.value.totalValuePerDay * 0.19), // Calculate 19% IVA
        priceTotal: Math.round(rent.value.totalValuePerDay * 1.19), // Total with IVA
        priceWarranty: rent.value.warrantyValue
      }

      await axios.post(`${getBaseUrl()}/api/v1/products`, productPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Product created successfully')
    }
  } catch (error) {
    console.error('Error ensuring product exists:', error)

    // If product creation fails, throw the error to stop rent creation
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al crear el producto'
      throw new Error(`Error al crear el producto: ${errorMessage}`)
    } else {
      throw new Error('Error inesperado al crear el producto')
    }
  }
}

// Ensure client exists, create if it doesn't
const ensureClientExists = async () => {
  if (!rent.value.clientRut.trim()) {
    throw new Error('El RUT del cliente es requerido')
  }

  if (!rent.value.clientName.trim()) {
    throw new Error('El nombre del cliente es requerido')
  }

  try {
    const token = sessionStorage.getItem('token')

    // Check if client exists
    const checkResponse = await axios.get(`${getBaseUrl()}/api/v1/clients`, {
      params: { rut: rent.value.clientRut },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    // If client doesn't exist, create it
    if (!Array.isArray(checkResponse.data.data) || checkResponse.data.data.length === 0) {
      const clientPayload = {
        id: `${Date.now()}`,
        name: rent.value.clientName,
        rut: rent.value.clientRut,
        companyName: '', // Empty to be filled later
        companyDocument: '', // Empty to be filled later
        phoneNumber: '', // Empty to be filled later
        address: '', // Empty to be filled later
        frequentClient: 'No',
        photoFileName: '',
        createdAt: new Date().toISOString()
      }

      await axios.post(`${getBaseUrl()}/api/v1/clients`, clientPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Client created successfully')
    }
  } catch (error) {
    console.error('Error ensuring client exists:', error)

    // If client creation fails, throw the error to stop rent creation
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al crear el cliente'
      throw new Error(`Error al crear el cliente: ${errorMessage}`)
    } else {
      throw new Error('Error inesperado al crear el cliente')
    }
  }
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
    // Don't throw here - let rent creation/deletion continue even if product update fails
  }
}

const handleCreateRent = async (rentPayload: Rent) => {
  const token = sessionStorage.getItem('token')

  // Ensure data types match backend expectations
  // For create mode, exclude paymentMethod as it's only set when finishing the rent
  const backendPayload = {
    code: rentPayload.code,
    productName: rentPayload.productName,
    quantity: Number(rentPayload.quantity) || 0,
    totalValuePerDay: Number(rentPayload.totalValuePerDay) || 0,
    warrantyValue: Number(rentPayload.warrantyValue) || 0,
    warrantyType: rentPayload.warrantyType || '',
    clientRut: rentPayload.clientRut,
    clientName: rentPayload.clientName,
    createdAt: rentPayload.createdAt || new Date().toISOString(),
    deliveryDate: rentPayload.deliveryDate || '',
    isFinished: Boolean(rentPayload.isFinished),
    isPaid: Boolean(rentPayload.isPaid),
    observations: rentPayload.observations || ''
    // Note: paymentMethod is intentionally excluded for create mode
  }

  const response = await axios.post(`${getBaseUrl()}/api/v1/rents`, backendPayload, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (response.data?.success) {
    await updateProductRentStatus(backendPayload.code, true)

    emit('save', response.data.data)
    emit('close')
  } else {
    const errorMessage = response.data?.message || 'Failed to create rent'
    console.error('Rent creation failed:', response.data)
    throw new Error(errorMessage)
  }
}

const handleEditRent = async (rentPayload: Rent) => {
  const token = sessionStorage.getItem('token')

  // Ensure data types match backend expectations
  const backendPayload = {
    ...rentPayload,
    quantity: Number(rentPayload.quantity) || 0, // Ensure it's a number
    totalValuePerDay: Number(rentPayload.totalValuePerDay) || 0, // Ensure it's a number
    warrantyValue: Number(rentPayload.warrantyValue) || 0, // Ensure it's a number
    warrantyType: rentPayload.warrantyType || '', // Ensure warrantyType is included
    createdAt: rentPayload.createdAt || new Date().toISOString(),
    deliveryDate: rentPayload.deliveryDate || '',
    isFinished: Boolean(rentPayload.isFinished) // Ensure it's a boolean
  }

  // Only include paymentMethod if the rent is finished
  if (rentPayload.isFinished && rentPayload.paymentMethod) {
    backendPayload.paymentMethod = rentPayload.paymentMethod
  }

  const response = await axios.put(`${getBaseUrl()}/api/v1/rents/${rentPayload.id}`, backendPayload, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (response.data?.success) {
    console.log('Rent updated successfully:', response.data.data)

    // If rent is marked as finished, make product available again
    if (backendPayload.isFinished) {
      await updateProductRentStatus(backendPayload.code, false)
    }

    emit('save', response.data.data)
    emit('close')
  } else {
    const errorMessage = response.data?.message || 'Failed to update rent'
    console.error('Rent update failed:', response.data)
    throw new Error(errorMessage)
  }
}

// Initialize component - load product brand for edit mode
onMounted(() => {
  if (mode === 'edit' && rentData?.code) {
    loadProductByCode()
  }
})
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

/* Warning notifications */
.warnings-container {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warning-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border-left: 4px solid;
  backdrop-filter: var(--backdrop-blur);
  animation: slideInWarning 0.4s ease-out;
}

@keyframes slideInWarning {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.warning-product {
  background: rgba(255, 193, 7, 0.1);
  border-left-color: #ffc107;
  color: var(--text-primary);
}

.warning-client {
  background: rgba(255, 193, 7, 0.1);
  border-left-color: #ffc107;
  color: var(--text-primary);
}

.warning-rental {
  background: rgba(220, 53, 69, 0.1);
  border-left-color: #dc3545;
  color: var(--text-primary);
  border-left-width: 6px;
}

.warning-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.warning-details {
  font-size: 0.875rem;
  opacity: 0.9;
  color: var(--text-secondary);
  line-height: 1.4;
}

.warning-details strong {
  color: var(--text-primary);
  font-weight: 600;
}

/* Dark theme warning adjustments */
:root[data-theme='dark'] .warning-product,
:root:not([data-theme]) .warning-product {
  background: rgba(255, 193, 7, 0.15);
}

:root[data-theme='dark'] .warning-client,
:root:not([data-theme]) .warning-client {
  background: rgba(255, 193, 7, 0.15);
}

:root[data-theme='dark'] .warning-rental,
:root:not([data-theme]) .warning-rental {
  background: rgba(220, 53, 69, 0.2);
}

/* Light theme warning adjustments */
:root[data-theme='light'] .warning-product {
  background: rgba(255, 193, 7, 0.08);
}

:root[data-theme='light'] .warning-client {
  background: rgba(255, 193, 7, 0.08);
}

:root[data-theme='light'] .warning-rental {
  background: rgba(220, 53, 69, 0.08);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-separator {
  height: 2px;
  background: linear-gradient(to right, transparent, var(--primary-color-alpha-40), var(--primary-color-alpha-60), var(--primary-color-alpha-40), transparent);
  margin: 2rem 0;
  border-radius: 1px;
  position: relative;
}

.form-separator::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--border-secondary), transparent);
  opacity: 0.8;
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
.form-group select,
.form-group textarea {
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

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color-alpha-60);
  background: var(--bg-secondary);
  box-shadow: 0 0 20px var(--primary-color-alpha-30);
  transform: translateY(-1px);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  font-family: var(--font-family);
  line-height: 1.5;
}

.readonly-input {
  background-color: var(--bg-tertiary) !important;
  color: var(--text-secondary) !important;
  cursor: not-allowed !important;
  opacity: 0.7;
}

.readonly-input:focus {
  border-color: var(--border-primary) !important;
  background: var(--bg-tertiary) !important;
  box-shadow: none !important;
  transform: none !important;
}

.editable-input:focus {
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

/* Checkbox container - aligned to left like FinishRentPopup */
.checkbox-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-start;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: auto;
}

.checkbox-input {
  width: 18px;
  height: 18px;
}

.checkbox-input.checkbox-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkbox-label {
  margin: 0;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-label.label-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  color: var(--text-secondary);
}

/* Payment status colors */
.status-paid {
  color: #28a745;
  font-weight: 600;
}

.status-pending {
  color: #dc3545;
  font-weight: 600;
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

/* Loading indicator for product auto-load */
.loading-indicator {
  font-size: 0.8rem;
  color: var(--primary-color);
  margin-top: 0.25rem;
  padding: 0.25rem 0;
  font-style: italic;
  opacity: 0.8;
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

  .warnings-container {
    margin-bottom: 1.5rem;
    gap: 0.75rem;
  }

  .warning-item {
    padding: 0.875rem 1rem;
    gap: 0.75rem;
  }

  .warning-icon {
    font-size: 1.25rem;
  }

  .warning-title {
    font-size: 0.9rem;
  }

  .warning-details {
    font-size: 0.8rem;
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
