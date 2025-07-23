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
                <span :class="['frequent-badge', client.frequentClient === 'Si' ? 'frequent-yes' : 'frequent-no']">
                  {{ client.frequentClient === 'Si' ? 'Sí' : 'No' }}
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

    <ClientDocumentPopup :visible="isDocumentPopupVisible" :image-src="documentUrl" :client-name="selectedClientName"
      @close="closeDocumentPopup" />

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
import { PhotoService } from '@/utils/photoService';
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
const selectedClientName = ref('');
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

    // Fix: The API returns { success: true, data: [...] }, not just the array
    if (response.data && response.data.data) {
      clients.value = response.data.data;
    } else {
      // Fallback if the response structure is different
      clients.value = Array.isArray(response.data) ? response.data : [];
    }

    // Fix: totalPages might not be in the response, set a default
    totalPages.value = response.data.totalPages || 1;
  } catch (error) {
    console.error('Error fetching clients:', error);
    clients.value = []; // Reset on error
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
    frequentClient: 'No',
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
    // Find the client to get their name
    const client = clients.value.find(c => c.id === clientId);
    selectedClientName.value = client?.name || 'Cliente';

    // Use the centralized photo service
    const result = await PhotoService.fetchClientPhoto(clientId, client?.photoFileName);

    if (result.success) {
      documentUrl.value = result.imageUrl || '';
    } else {
      console.error('Error fetching photo:', result.error);
      documentUrl.value = '';
    }

    // Always show the popup (with or without image)
    isDocumentPopupVisible.value = true;
  } catch (error) {
    console.error('Error fetching document:', error);

    // On error, still show the popup with the client name
    const client = clients.value.find(c => c.id === clientId);
    selectedClientName.value = client?.name || 'Cliente';
    documentUrl.value = '';
    isDocumentPopupVisible.value = true;
  } finally {
    loading.value = false;
  }
};

const closeDocumentPopup = () => {
  isDocumentPopupVisible.value = false;
  documentUrl.value = '';
  selectedClientName.value = '';
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
    const url = `${getBaseUrl()}/api/v1/clients`;
    await axios.delete(url, {
      params: {
        id: clientToDelete.value.id
      },
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
  background: var(--bg-gradient-primary);
  position: relative;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.client-container::before {
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

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-shadow: 0 2px 4px var(--shadow-primary);
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

.client-content {
  position: relative;
  z-index: 1;
  max-width: 1600px;
  margin: 0 auto;
}

.client-table-container {
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

.client-table td {
  padding: 16px 12px;
  border-bottom: 1px solid var(--border-secondary);
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.client-row:hover td {
  background: var(--bg-secondary);
}

.client-name {
  font-weight: 600;
  color: var(--text-primary);
}

.frequent-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.frequent-yes {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9));
  color: white;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.frequent-no {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-edit,
.btn-view,
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

.btn-edit img,
.btn-view img,
.btn-delete img {
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 2rem;
  padding: 1rem 0;
}

.btn-pagination {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 120px;
  backdrop-filter: var(--backdrop-blur);
}

.btn-pagination:hover:not(:disabled) {
  background: var(--primary-color-alpha-80);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--primary-color-alpha-30);
}

.btn-pagination:disabled {
  background: var(--bg-tertiary);
  color: var(--text-disabled);
  border-color: var(--border-secondary);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.pagination-info {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: 12px 20px;
  border-radius: 20px;
  font-weight: 600;
  border: 2px solid var(--border-primary);
  min-width: 80px;
  text-align: center;
  backdrop-filter: var(--backdrop-blur);
}

/* Delete Modal Styles */
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
