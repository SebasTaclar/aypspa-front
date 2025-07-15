<template>
  <main>
    <div class="container">
      <!-- Header with title and create button -->
      <div class="header">
        <h1>Gestión de Clientes</h1>
        <button class="btn btn-primary" @click="openCreatePopup">Crear cliente</button>
      </div>

      <!-- Search box -->
      <div class="search-container">
        <input id="searchQuery" type="text" placeholder="Buscar cliente..." class="search-box" v-model="searchQuery" />
      </div>

      <Spinner v-if="loading" />

      <div v-else class="clients-content">
        <!-- Table for displaying client data -->
        <div class="clients-table-container">
          <table class="client-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Nombre Empresa</th>
                <th># Documento Empresa</th>
                <th>Rut</th>
                <th>Numero Celular</th>
                <th>Direccion</th>
                <th>Fecha creacion</th>
                <th>Cliente Frecuente</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in filteredClients" :key="client.id">
                <td>{{ client.name }}</td>
                <td>{{ client.companyName }}</td>
                <td>{{ client.companyDocument }}</td>
                <td>{{ client.rut }}</td>
                <td>{{ client.phoneNumber }}</td>
                <td>{{ client.address }}</td>
                <td>{{ client.creationDate }}</td>
                <td>{{ client.frequentClient }}</td>
                <td class="actions">
                  <button class="btn-icon edit-btn" @click="openEditPopup(client)">
                    <img class="icon edit" src="../../public/icons/edit.svg" alt="Edit" />
                  </button>
                  <button class="btn-icon delete-btn" @click="deleteClient(client)">
                    <img class="icon delete" src="../../public/icons/trash.svg" alt="Delete" />
                  </button>
                  <button class="btn-icon view-btn" @click="fetchDocument(client.id)">
                    <img class="icon view" src="../../public/icons/eye.svg" alt="OpenDocument" />
                  </button>
                </td>
              </tr>
              <tr v-if="filteredClients.length === 0">
                <td colspan="9" style="text-align: center">No se encontraron clientes</td>
              </tr>
            </tbody>
          </table>
        </div>

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

    <Spinner v-if="loading" />

  </main>
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

const deleteClient = async (client: Client) => {
  const confirmDeletion = window.confirm(`¿Estás seguro de que deseas eliminar al cliente "${client.name}"?`);
  if (!confirmDeletion) {
    return;
  }
  loading.value = true;
  try {
    const token = sessionStorage.getItem('token');
    const url = `${getBaseUrl()}/api/v1/clients`;
    await axios.delete(url, {
      params: {
        id: client.id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    clients.value = clients.value.filter((c) => c.id !== client.id);
    alert('Cliente eliminado exitosamente.');
  } catch (error) {
    console.error('Error deleting client:', error);
    alert('Hubo un error al eliminar el cliente.');
  } finally {
    loading.value = false;
  }
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

onMounted(fetchClients);
</script>

<style scoped>
main {
  /* Remove padding-top as we'll handle it in container */
}

.container {
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

h1 {
  color: #333;
  margin: 0;
}

.btn {
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.search-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.search-box {
  padding: 12px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-box:focus {
  outline: none;
  border-color: #007bff;
}

.clients-content {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.clients-table-container {
  overflow-x: auto;
}

.client-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.client-table th,
.client-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.client-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.client-table tr:hover {
  background-color: #f8f9fa;
}

.actions {
  display: flex;
  gap: 2px;
}

.btn-icon {
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

.edit-btn:hover {
  background-color: #e3f2fd;
}

.delete-btn:hover {
  background-color: #ffebee;
}

.view-btn:hover {
  background-color: #e8f5e8;
}

.edit-btn {
  color: #3d812c;
}

.delete-btn {
  color: #dc3545;
}

.view-btn {
  color: #28a745;
}

.icon {
  width: 20px;
  height: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px 0;
}

.btn-pagination {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.btn-pagination:disabled {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.pagination-info {
  background-color: #f8f9fa;
  color: #495057;
  padding: 10px 20px;
  border-radius: 20px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  border: 2px solid #e9ecef;
  min-width: 80px;
  text-align: center;
}
</style>
