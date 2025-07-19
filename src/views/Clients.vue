<template>
  <div class="client-container">
    <div class="header">
      <h1>Gestión de Clientes</h1>
      <button @click="openCreatePopup" class="btn-primary">
        Crear Cliente
      </button>
    </div>

    <!-- Search box -->
    <div class="search-container">
      <input id="searchQuery" type="text" placeholder="Buscar cliente..." class="search-box" v-model="searchQuery" />
    </div>

    <Spinner v-if="loading" />

    <div v-else class="client-content">
      <!-- Client Table -->
      <div class="client-table-container">
        <div class="table-header">
          <h2>Clientes Registrados ({{ filteredClients.length }})</h2>
        </div>

        <div v-if="filteredClients.length === 0" class="no-data">
          <div class="no-data-content">
            <div class="no-data-icon">👥</div>
            <h3>No hay clientes registrados</h3>
            <p>Comienza agregando tu primer cliente</p>
          </div>
        </div>

        <table v-else class="client-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Empresa</th>
              <th># Documento</th>
              <th>RUT</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Fecha Creación</th>
              <th>Cliente Frecuente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in filteredClients" :key="client.id" class="client-row">
              <td class="client-name">{{ client.name }}</td>
              <td>{{ client.companyName || 'N/A' }}</td>
              <td>{{ client.companyDocument || 'N/A' }}</td>
              <td>{{ client.rut }}</td>
              <td>{{ client.phoneNumber }}</td>
              <td>{{ client.address }}</td>
              <td>{{ formatDate(client.creationDate) }}</td>
              <td>
                <span :class="['frequent-badge', client.frequentClient ? 'frequent-yes' : 'frequent-no']">
                  {{ client.frequentClient ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="actions">
                <button @click="openEditPopup(client)" class="btn-edit" title="Editar">
                  <img src="/icons/edit.svg" alt="Editar" />
                </button>
                <button @click="fetchDocument(client.id)" class="btn-view" title="Ver documento">
                  <img src="/icons/eye.svg" alt="Ver" />
                </button>
                <button @click="confirmDelete(client)" class="btn-delete" title="Eliminar">
                  <img src="/icons/trash.svg" alt="Eliminar" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="pagination">
          <button class="btn-pagination" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
            ← Anterior
          </button>
          <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
          <button class="btn-pagination" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
            Siguiente →
          </button>
        </div>
      </div>
    </div>

    <UpsertClientPopup v-if="isUpsertPopupVisible" :clientData="selectedClient" :mode="popupMode"
      @close="closeUpsertPopup" @save="handleSaveClient" />

    <ClientDocumentPopup :visible="isDocumentPopupVisible" :imageSrc="documentUrl" @close="closeDocumentPopup" />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="popup-overlay" @click="closeDeleteModal">
      <div class="popup-content delete-modal" @click.stop>
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar el cliente "{{ clientToDelete?.name }}"?</p>
        <div class="form-actions">
          <button @click="closeDeleteModal" class="btn-cancel">Cancelar</button>
          <button @click="deleteClient" class="btn-delete-confirm" :disabled="deleting">
            {{ deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import UpsertClientPopup from '@/components/UpsertClientPopup.vue';
import ClientDocumentPopup from '@/components/ClientDocumentPopup.vue';
import type { Client } from '@/types/ClientType';
import { getBaseUrl } from '@/utils/apiConfig';
import { getPresignedUrl } from '@/utils/fileUtils';
import Spinner from '@/components/Spinner.vue';

defineOptions({
  name: 'ClientView',
});

const clients = ref<Client[]>([]);
const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const isUpsertPopupVisible = ref(false);
const selectedClient = ref<Client | null>(null);
const popupMode = ref<'edit' | 'create'>('edit');
const isDocumentPopupVisible = ref(false);
const documentUrl = ref('');
const loading = ref(false);
const showDeleteModal = ref(false);
const clientToDelete = ref<Client | null>(null);
const deleting = ref(false);

const fetchClients = async () => {
  loading.value = true;
  try {
    const token = sessionStorage.getItem('token');
    const url = `${getBaseUrl()}/api/v1/clients`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    clients.value = response.data;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Error fetching clients:', error);
  } finally {
    loading.value = false;
  }
};

const filteredClients = computed(() => {
  if (!searchQuery.value) {
    return clients.value;
  }
  return clients.value.filter((client) =>
    Object.values(client).some((value) =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

const changePage = (page: number) => {
  currentPage.value = page;
  fetchClients();
};

const openEditPopup = (client: Client) => {
  selectedClient.value = client;
  isUpsertPopupVisible.value = true;
  popupMode.value = 'edit';
};

const openCreatePopup = () => {
  selectedClient.value = {
    id: '',
    name: '',
    companyName: '',
    companyDocument: '',
    rut: '',
    phoneNumber: '',
    address: '',
    creationDate: '',
    frequentClient: false,
    photoFileName: '',
  };
  popupMode.value = 'create';
  isUpsertPopupVisible.value = true;
};

const handleSaveClient = async () => {
  await fetchClients();
  isUpsertPopupVisible.value = false;
};

const closeUpsertPopup = () => {
  isUpsertPopupVisible.value = false;
};

const fetchDocument = async (clientId: string) => {
  loading.value = true;
  try {
    const fileName = `clients/${clientId}.png`;
    const preSignedUrl = await getPresignedUrl(fileName, '', 'retrieve');

    documentUrl.value = preSignedUrl;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching document:', error.response?.data || error.message);
    } else {
      console.error('Error fetching document:', error);
    }
    alert('Hubo un error al cargar el documento.');
  } finally {
    loading.value = false;
    isDocumentPopupVisible.value = true;
  }
};

const closeDocumentPopup = () => {
  isDocumentPopupVisible.value = false;
  documentUrl.value = '';
};

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

const confirmDelete = (client: Client) => {
  clientToDelete.value = client
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  clientToDelete.value = null
  deleting.value = false
}

const deleteClient = async () => {
  if (!clientToDelete.value) return

  deleting.value = true
  try {
    const token = sessionStorage.getItem('token');
    const url = `${getBaseUrl()}/api/v1/clients/${clientToDelete.value.id}`;
    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Remove client from local array
    clients.value = clients.value.filter(c => c.id !== clientToDelete.value!.id);
    closeDeleteModal();
  } catch (error) {
    console.error('Error deleting client:', error);
    alert('Error al eliminar el cliente');
  } finally {
    deleting.value = false
  }
}

onMounted(fetchClients);
</script>

<style scoped>
.client-container {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 80px 40px 40px;
  min-height: 100vh;
  background: linear-gradient(135deg, #333 0%, #666 100%);
  position: relative;
}

.client-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 99, 71, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
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

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #ff6347 0%, #ff4500 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 99, 71, 0.3);
  backdrop-filter: blur(10px);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 99, 71, 0.4);
  background: linear-gradient(135deg, #ff4500 0%, #ff6347 100%);
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
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.search-box::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-box:focus {
  outline: none;
  border-color: rgba(255, 99, 71, 0.6);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 20px rgba(255, 99, 71, 0.3);
}

.client-content {
  position: relative;
  z-index: 1;
  max-width: 1600px;
  margin: 0 auto;
}

.client-table-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.table-header {
  margin-bottom: 1.5rem;
}

.table-header h2 {
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.no-data h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
}

.no-data p {
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
}

.client-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.client-table th {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  position: sticky;
  top: 0;
  backdrop-filter: blur(10px);
}

.client-table td {
  padding: 16px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.client-row:hover td {
  background: rgba(255, 255, 255, 0.15);
}

.client-name {
  font-weight: 600;
  color: #fff;
}

.frequent-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.frequent-yes {
  background: rgba(40, 167, 69, 0.8);
  color: white;
}

.frequent-no {
  background: rgba(108, 117, 125, 0.8);
  color: white;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-edit,
.btn-view,
.btn-delete {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.btn-edit:hover {
  background: rgba(40, 167, 69, 0.8);
  border-color: rgba(40, 167, 69, 1);
  transform: translateY(-2px);
}

.btn-view:hover {
  background: rgba(23, 162, 184, 0.8);
  border-color: rgba(23, 162, 184, 1);
  transform: translateY(-2px);
}

.btn-delete:hover {
  background: rgba(220, 53, 69, 0.8);
  border-color: rgba(220, 53, 69, 1);
  transform: translateY(-2px);
}

.btn-edit img,
.btn-view img,
.btn-delete img {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 2rem;
  padding: 1rem 0;
}

.btn-pagination {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 120px;
  backdrop-filter: blur(10px);
}

.btn-pagination:hover:not(:disabled) {
  background: rgba(255, 99, 71, 0.8);
  border-color: rgba(255, 99, 71, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 99, 71, 0.3);
}

.btn-pagination:disabled {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.pagination-info {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 12px 20px;
  border-radius: 20px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
  min-width: 80px;
  text-align: center;
  backdrop-filter: blur(10px);
}

/* Delete Modal Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.popup-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
}

.delete-modal h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.delete-modal p {
  color: rgba(255, 255, 255, 0.9);
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
  background: rgba(220, 53, 69, 0.8);
  color: white;
}

.btn-delete-confirm:hover:not(:disabled) {
  background: rgba(220, 53, 69, 1);
  transform: translateY(-2px);
}

.btn-delete-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .client-container {
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

  .client-table-container {
    margin: 0;
    padding: 1rem;
    overflow-x: auto;
  }

  .client-table {
    min-width: 1000px;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-info {
    order: -1;
  }
}
</style>
