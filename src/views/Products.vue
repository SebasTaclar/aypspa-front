<template>
  <div class="product-container">
    <div class="header">
      <h1>Gestión de Productos</h1>
      <button @click="openCreateModal" class="btn-primary">
        Crear Producto
      </button>
    </div>

    <!-- Search box -->
    <div class="search-container">
      <input id="searchQuery" type="text" placeholder="Buscar producto..." class="search-box" v-model="searchQuery" />
    </div>

    <Spinner v-if="loading" />

    <div v-else class="product-content">
      <!-- Product Table -->
      <div class="product-table-container">
        <div class="table-header">
          <h2>Productos Registrados ({{ filteredProducts.length }})</h2>
        </div>

        <div v-if="filteredProducts.length === 0 && products.length === 0" class="no-data">
          <div class="no-data-content">
            <div class="no-data-icon">📦</div>
            <h3>No hay productos registrados</h3>
            <p>Comienza agregando tu primer producto</p>
          </div>
        </div>

        <div v-else-if="filteredProducts.length === 0 && searchQuery" class="no-data">
          <div class="no-data-content">
            <div class="no-data-icon">🔍</div>
            <h3>No se encontraron productos</h3>
            <p>No hay productos que coincidan con la búsqueda</p>
          </div>
        </div>

        <table v-else class="product-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Precio Neto</th>
              <th>IVA</th>
              <th>Precio Total</th>
              <th>Garantía</th>
              <th>Estado</th>
              <th>Arrendado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product._id" class="product-row">
              <td><span class="code-badge">{{ product.code }}</span></td>
              <td class="product-name">{{ product.name }}</td>
              <td>{{ product.brand }}</td>
              <td class="price">${{ formatCurrency(product.priceNet) }}</td>
              <td class="price">${{ formatCurrency(product.priceIva) }}</td>
              <td class="price">${{ formatCurrency(product.priceTotal) }}</td>
              <td class="price">${{ formatCurrency(product.priceWarranty) }}</td>
              <td>
                <span class="status-badge status-active">Activo</span>
              </td>
              <td>
                <span :class="['rental-badge', product.rented ? 'rented' : 'available']">
                  {{ product.rented ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="actions">
                <button @click="editProduct(product)" class="btn-edit" title="Editar">
                  <img src="/icons/edit.svg" alt="Editar" />
                </button>
                <button @click="confirmDelete(product)" class="btn-delete" title="Eliminar">
                  <img src="/icons/trash.svg" alt="Eliminar" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <UpsertProductPopup :show="showModal" :product="selectedProduct" @close="closeModal" @submit="handleSubmit" />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="popup-overlay" @click="closeDeleteModal">
      <div class="popup-content delete-modal" @click.stop>
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar el producto "{{ productToDelete?.name }}"?</p>
        <div class="form-actions">
          <button @click="closeDeleteModal" class="btn-cancel">Cancelar</button>
          <button @click="deleteProduct" class="btn-delete-confirm" :disabled="deleting">
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ProductsView' })
import { ref, onMounted, computed } from 'vue'
import type { Product } from '@/types/ProductType'
import { getBaseUrl } from '@/utils/apiConfig'
import UpsertProductPopup from '@/components/UpsertProductPopup.vue'
import Spinner from '@/components/Spinner.vue'

const products = ref<Product[]>([])
const loading = ref(true)
const showModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const showDeleteModal = ref(false)
const productToDelete = ref<Product | null>(null)
const deleting = ref(false)
const searchQuery = ref('')

const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return products.value
  }
  return products.value.filter((product) =>
    Object.values(product).some((value) =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
})

const fetchProducts = async () => {
  try {
    loading.value = true
    const token = sessionStorage.getItem('token')
    const response = await fetch(`${getBaseUrl()}/api/v1/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Error al cargar productos')
    }

    const data = await response.json()
    products.value = data
  } catch (error) {
    console.error('Error fetching products:', error)
    alert('Error al cargar los productos')
  } finally {
    loading.value = false
  }
}

const createProduct = async (productData: Partial<Product>) => {
  try {
    const token = sessionStorage.getItem('token')
    const response = await fetch(`${getBaseUrl()}/api/v1/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })

    if (!response.ok) {
      throw new Error('Error al crear producto')
    }

    await fetchProducts()
  } catch (error) {
    console.error('Error creating product:', error)
    alert('Error al crear el producto')
  }
}

const updateProduct = async (productData: Partial<Product>) => {
  try {
    const token = sessionStorage.getItem('token')
    const response = await fetch(`${getBaseUrl()}/api/v1/products/${productData._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })

    if (!response.ok) {
      throw new Error('Error al actualizar producto')
    }

    await fetchProducts()
  } catch (error) {
    console.error('Error updating product:', error)
    alert('Error al actualizar el producto')
  }
}

const deleteProduct = async () => {
  if (!productToDelete.value) return

  try {
    deleting.value = true
    const token = sessionStorage.getItem('token')
    const response = await fetch(`${getBaseUrl()}/api/v1/products/${productToDelete.value._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Error al eliminar producto')
    }

    await fetchProducts() // Refresh the table after deleting
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Error al eliminar el producto')
  } finally {
    deleting.value = false
  }
}

const openCreateModal = () => {
  selectedProduct.value = null
  showModal.value = true
}

const editProduct = (product: Product) => {
  selectedProduct.value = product
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  productToDelete.value = null
}

const handleSubmit = async (productData: Partial<Product>) => {
  if (selectedProduct.value) {
    await updateProduct({ ...productData, _id: selectedProduct.value._id })
  } else {
    await createProduct(productData)
  }
  closeModal()
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.product-container {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 80px 40px 40px;
  min-height: 100vh;
  background: var(--bg-gradient-primary);
  position: relative;
  transition: all 0.3s ease;
}

.product-container::before {
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
  margin: 0 auto 2rem;
  position: relative;
  z-index: 1;
  max-width: 1600px;
  width: 100%;
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

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
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

.product-content {
  position: relative;
  z-index: 1;
  max-width: 1600px;
  margin: 0 auto;
}

.product-table-container {
  background: var(--bg-secondary);
  backdrop-filter: var(--backdrop-blur);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid var(--border-primary);
  box-shadow: 0 8px 32px var(--shadow-primary);
  transition: all 0.3s ease;
}

.table-header {
  margin-bottom: 1.5rem;
}

.table-header h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 2px 2px 4px var(--shadow-primary);
}

.no-data {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.no-data-content {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.product-table th {
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

.product-table td {
  padding: 16px 12px;
  border-bottom: 1px solid var(--border-secondary);
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.product-row:hover td {
  background: var(--bg-secondary);
}

.product-name {
  font-weight: 600;
  color: var(--text-primary);
}

.code-badge {
  background: var(--primary-color-alpha-80);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.price {
  font-weight: 600;
  color: #10b981;
  /* Green that works in both themes */
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background: rgba(40, 167, 69, 0.8);
  color: white;
}

.rental-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.rental-badge.rented {
  background: rgba(239, 68, 68, 0.8);
  color: white;
}

.rental-badge.available {
  background: rgba(34, 197, 94, 0.8);
  color: white;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-edit,
.btn-delete {
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

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.8);
  border-color: rgba(239, 68, 68, 1);
  transform: translateY(-2px);
}

.btn-edit img,
.btn-delete img {
  width: 16px;
  height: 16px;
  transition: filter 0.3s ease;
}

/* Dark theme - make icons white */
:root[data-theme='dark'] .btn-edit img,
:root[data-theme='dark'] .btn-delete img,
:root:not([data-theme]) .btn-edit img,
:root:not([data-theme]) .btn-delete img {
  filter: brightness(0) invert(1);
}

/* Light theme - make icons dark */
:root[data-theme='light'] .btn-edit img,
:root[data-theme='light'] .btn-delete img {
  filter: brightness(0) invert(0.2);
}

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
  background: rgba(108, 117, 125, 0.8);
  color: white;
}

.btn-cancel:hover {
  background: rgba(108, 117, 125, 1);
  transform: translateY(-2px);
}

.btn-delete-confirm {
  background: rgba(239, 68, 68, 0.8);
  color: white;
}

.btn-delete-confirm:hover:not(:disabled) {
  background: rgba(239, 68, 68, 1);
  transform: translateY(-2px);
}

.btn-delete-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .product-container {
    padding: 70px 20px 20px;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header h1 {
    font-size: 2rem;
  }

  .product-table-container {
    margin: 0;
    padding: 1rem;
    overflow-x: auto;
  }

  .product-table {
    min-width: 1200px;
  }
}
</style>
