<template>
  <div class="products-container">
    <div class="header">
      <h1>Gestión de Productos</h1>
      <button @click="openCreateModal" class="btn-primary">
        Nuevo Producto
      </button>
    </div>

    <!-- Search box -->
    <div class="search-container">
      <input id="searchQuery" type="text" placeholder="Buscar producto..." class="search-box" v-model="searchQuery" />
    </div>

    <Spinner v-if="loading" />

    <div v-else class="products-content">
      <div v-if="filteredProducts.length === 0 && products.length === 0" class="no-products">
        <p>No hay productos registrados</p>
      </div>

      <div v-else-if="filteredProducts.length === 0 && searchQuery" class="no-products">
        <p>No se encontraron productos que coincidan con la búsqueda</p>
      </div>

      <div v-else class="products-table-container">
        <table class="products-table">
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
              <td>{{ product.code }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.brand }}</td>
              <td>${{ formatCurrency(product.priceNet) }}</td>
              <td>${{ formatCurrency(product.priceIva) }}</td>
              <td>${{ formatCurrency(product.priceTotal) }}</td>
              <td>${{ formatCurrency(product.priceWarranty) }}</td>
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

    await fetchProducts() // Refresh the table after creating
    alert('Producto creado exitosamente')
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

    await fetchProducts() // Refresh the table after updating
    alert('Producto actualizado exitosamente')
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
    alert('Producto eliminado exitosamente')
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
.products-container {
  padding: 80px 20px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.search-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.search-box {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 300px;
  transition: border-color 0.3s ease;
  font-family: 'Bricolage Grotesque', sans-serif;
}

.search-box:focus {
  outline: none;
  border-color: #007bff;
}

h1 {
  color: #333;
  margin: 0;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Bricolage Grotesque', sans-serif;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.products-content {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.no-products {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
}

.products-table-container {
  overflow-x: auto;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.products-table th,
.products-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.products-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.product-row:hover {
  background-color: #f8f9fa;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.rental-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.rental-badge.rented {
  background-color: #f8d7da;
  color: #721c24;
}

.rental-badge.available {
  background-color: #d1ecf1;
  color: #0c5460;
}

.actions {
  display: flex;
  gap: 2px;
}

.btn-edit,
.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit:hover {
  background-color: #e3f2fd;
}

.btn-delete:hover {
  background-color: #ffebee;
}

.btn-edit img,
.btn-delete img {
  width: 20px;
  height: 20px;
}

.delete-modal {
  max-width: 400px;
}

.delete-modal h3 {
  margin-bottom: 15px;
  color: #333;
}

.delete-modal p {
  margin-bottom: 25px;
  color: #666;
}

.btn-delete-confirm {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn-delete-confirm:hover {
  background-color: #c82333;
}

.btn-delete-confirm:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

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
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}
</style>
