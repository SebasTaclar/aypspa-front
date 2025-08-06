<template>
  <div class="client-container">
    <div class="header">
      <h1>Comunicate Con Nosotros</h1>
    </div>

    <!-- Sección de Contacto -->
    <div v-if="showContactSection" class="contact-section">
      <div class="contact-content">
        <div class="contact-form-container">
          <h2>Contáctanos</h2>
          <form @submit.prevent="handleContactSubmit" class="contact-form">
            <div class="form-group">
              <label for="name">Nombre</label>
              <input type="text" id="name" v-model="contactForm.name" required placeholder="Tu nombre / Empresa">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="contactForm.email" required placeholder="tucorreo@ejemplo.com">
            </div>
            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input type="tel" id="phone" v-model="contactForm.phone" required placeholder="Ingrese su # de Teléfono">
            </div>
            <div class="form-group">
              <label for="message">Mensaje</label>
              <textarea id="message" v-model="contactForm.message" required placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>
            <button type="submit" class="btn-submit">Enviar Mensaje</button>
          </form>
        </div>

        <div class="contact-info">
          <div class="contact-details">
            <h3>Información de Contacto</h3>
            <div class="info-item">
              <span class="icon">📍</span>
              <p>Av Septiembre 04, Frutillar Alto</p>
            </div>
            <div class="info-item">
              <span class="icon">📞</span>
              <p>+56 987 531 754</p>
            </div>
            <div class="info-item">
              <span class="icon">✉️</span>
              <p>yonatan.8587@gmail.com</p>
            </div>
          </div>

          <!-- Mapa de Google -->
          <div class="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3005.154595993112!2d-73.05477!3d-41.131151!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96178dacdd6cf6e7%3A0x7e444233f5e00047!2sAYP%20ANDAMIOS%20Y%20CONSTRUCCION!5e0!3m2!1ses!2sco!4v1752808331472!5m2!1ses!2sco" 
              width="100%" 
              height="300" 
              style="border:0;" 
              allowfullscreen 
              loading="lazy">
            </iframe>
          </div>
        </div>
      </div>

      <!-- Botón flotante de WhatsApp -->
      <a href="https://wa.me/+56987531754?text=Estoy%20interesado%20en%3A%20" target="_blank" class="whatsapp-float">
        <div class="whatsapp-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
        <span class="whatsapp-text">¡Contáctanos!</span>
      </a>
    </div>
<!-- ---------------------------------------------------------- -->
    <!-- Contenido original de clientes -->
    <div v-if="!showContactSection">

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
const showContactSection = ref(true);

const goToContact = () => {
  showContactSection.value = true;
  // Hacer scroll suave hacia la sección de contacto
  const contactSection = document.querySelector('.contact-section');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// Formulario de contacto
const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const handleContactSubmit = () => {
  // Aquí puedes implementar la lógica para enviar el formulario
  console.log('Formulario enviado:', contactForm.value);
  // Resetear el formulario
  contactForm.value = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };
  alert('Mensaje enviado correctamente');
};

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
  padding: 80px 20px 40px;
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
  padding-left: 13rem;
  align-items: center;
  margin: 0  auto ;
  position: relative;
  z-index: 1;
  max-width: 1600px;
  width: 100%;
  text-align: center;
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

/* Estilos para la sección de contacto */
.contact-section {
  position: relative;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 20px;
  margin: 2rem auto;
  max-width: 1200px;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.contact-form-container {
  background: var(--bg-tertiary);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--border-primary);
}

.contact-form-container h2 {
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-primary);
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.btn-submit {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--primary-color-alpha-30);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-details {
  background: var(--bg-tertiary);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid var(--border-primary);
}

.contact-details h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.info-item .icon {
  font-size: 1.5rem;
  min-width: 24px;
  text-align: center;
}

.map-container {
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid var(--border-primary);
  height: 300px;
}

.map-container iframe {
  width: 100%;
  height: 100%;
}

/* Estilos para el botón flotante de WhatsApp */
.whatsapp-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  background-color: #25D366;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.whatsapp-float:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.4);
}

.whatsapp-icon {
  font-size: 24px;
  margin-right: 8px;
}

.whatsapp-text {
  font-size: 16px;
  font-weight: bold;
}

.header-buttons {
  display: flex;
  gap: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .client-container {
    padding: 70px 10px 20px;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    justify-content: center;
    padding-left: 0;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin: 0 auto;
    padding: 0;
  }

  .contact-section {
    margin: 1rem auto;
    padding: 1.5rem;
  }

  .header-buttons {
    flex-direction: column;
    width: 100%;
  }

  .header-buttons button {
    width: 100%;
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

  .whatsapp-text {
    display: none;
  }

  .whatsapp-float {
    padding: 15px;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    justify-content: center;
    margin-right: 0;
  }

  .whatsapp-icon {
    margin-right: 0;
    font-size: 28px;
  }
}
</style>
