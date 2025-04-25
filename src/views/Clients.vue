<template>
  <main>
    <div class="container">
      <!-- Button to create a new client -->
      <button class="btn btn-primary" @click="openCreatePopup">Crear cliente</button>

      <!-- Search box and search button -->
      <div class="search-container">
        <input id="searchQuery" type="text" placeholder="Buscar cliente..." class="search-box" v-model="searchQuery" />
      </div>

      <!-- Table for displaying client data -->
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
            <td>
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

      <UpsertClientPopup v-if="isUpsertPopupVisible" :clientData="selectedClient" :mode="popupMode"
        @close="closeUpsertPopup" @save="handleSaveClient" />

      <ClientDocumentPopup :visible="isDocumentPopupVisible" :imageSrc="documentUrl" @close="closeDocumentPopup" />

      <!-- Pagination Controls -->
      <div class="pagination">
        <button class="btn btn-secondary" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button class="btn btn-secondary" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
          Siguiente
        </button>
      </div>
    </div>

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
  padding-top: 60px;
}

.container {
  margin-left: 20px;
  margin-right: 20px;
}

.btn {
  margin: 10px 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Bricolage Grotesque', sans-serif;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.search-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.search-box {
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: 'Bricolage Grotesque', sans-serif;
}

.client-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.client-table th,
.client-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.client-table th {
  background-color: #f4f4f4;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 0 5px;
}

.btn-icon:hover {
  background-color: #c41616;
  border-radius: 5px;
  /* Optional: Add rounded corners */
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
}
</style>
