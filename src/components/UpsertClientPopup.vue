<template>
  <div class="popup-overlay" @click.self="handleOverlayClick">
    <div class="popup-content">
      <h2>{{ mode === 'edit' ? 'Editar Cliente' : 'Crear Cliente' }}</h2>
      <form @submit.prevent="saveClient">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input id="nombre" v-model="client.name" type="text" required />
        </div>
        <div class="form-group">
          <label for="nombreEmpresa">Nombre Empresa</label>
          <input id="nombreEmpresa" v-model="client.companyName" type="text" />
        </div>
        <div class="form-group">
          <label for="documentoEmpresa"># Documento Empresa</label>
          <input id="documentoEmpresa" v-model="client.companyDocument" type="text" />
        </div>
        <div class="form-group">
          <label for="rut">RUT</label>
          <input id="rut" v-model="client.rut" type="text" required />
        </div>
        <div class="form-group">
          <label for="numeroCelular">Número Celular</label>
          <input id="numeroCelular" v-model="client.phoneNumber" type="text" required />
        </div>
        <div class="form-group">
          <label for="direccion">Dirección</label>
          <input id="direccion" v-model="client.address" type="text" required />
        </div>
        <div class="form-group">
          <label for="clienteFrecuente">Cliente Frecuente</label>
          <select id="clienteFrecuente" v-model="client.frequentClient">
            <option value="Si">Si</option>
            <option value="No">No</option>
          </select>
        </div>
        <div class="form-group">
          <label for="photo">Foto</label>
          <input id="photo" type="file" @change="handleFileSelection" />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </button>
        <button type="button" class="btn btn-secondary" @click="handleOverlayClick">
          Cancelar
        </button>
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
import { ref, computed } from 'vue';
import { getBaseUrl } from '@/utils/apiConfig';
import axios from 'axios';
import Spinner from '@/components/Spinner.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { PhotoService } from '@/utils/photoService';
import type { Client } from '@/types/ClientType';

const { clientData, mode } = defineProps<{
  clientData: Client | null;
  mode: 'edit' | 'create';
}>();

const emit = defineEmits(['close', 'save']);

const selectedFile = ref<File | null>(null);
const loading = ref(false);
const showConfirmation = ref(false);

// Store original client data for change detection
const originalClientData = ref<Client | null>(null);

// Initialize original data when component loads
if (mode === 'create') {
  originalClientData.value = null;
} else {
  originalClientData.value = clientData ? { ...clientData } : null;
}

// Use reactive refs for client data instead of computed
const client = ref({
  id: mode === 'create' ? undefined : (clientData?.id ?? undefined),
  name: mode === 'create' ? '' : (clientData?.name || ''),
  companyName: mode === 'create' ? '' : (clientData?.companyName || ''),
  companyDocument: mode === 'create' ? '' : (clientData?.companyDocument || ''),
  rut: mode === 'create' ? '' : (clientData?.rut || ''),
  phoneNumber: mode === 'create' ? '' : (clientData?.phoneNumber || ''),
  address: mode === 'create' ? '' : (clientData?.address || ''),
  frequentClient: mode === 'create' ? 'No' : (clientData?.frequentClient || 'No'),
  photoFileName: mode === 'create' ? '' : (clientData?.photoFileName || ''),
  creationDate: mode === 'create'
    ? new Date().toISOString()
    : (clientData?.creationDate || new Date().toISOString())
});

const hasChanges = computed(() => {
  if (mode === 'create') {
    // For create mode, check if any field has been filled (excluding id and creationDate)
    const currentClient = client.value;
    return !!(
      currentClient.name.trim() ||
      currentClient.companyName.trim() ||
      currentClient.companyDocument.trim() ||
      currentClient.rut.trim() ||
      currentClient.phoneNumber.trim() ||
      currentClient.address.trim() ||
      currentClient.frequentClient !== 'No' ||
      selectedFile.value
    );
  } else {
    // For edit mode, compare with original data
    if (!originalClientData.value) return false;

    const current = client.value;
    const original = originalClientData.value;

    return !!(
      current.name !== original.name ||
      current.companyName !== original.companyName ||
      current.companyDocument !== original.companyDocument ||
      current.rut !== original.rut ||
      current.phoneNumber !== original.phoneNumber ||
      current.address !== original.address ||
      current.frequentClient !== original.frequentClient ||
      selectedFile.value
    );
  }
});

const closePopup = () => {
  emit('close');
};

const saveClient = async () => {
  loading.value = true;
  try {
    if (mode === 'edit') {
      await handleEditClient();
    } else if (mode === 'create') {
      await handleCreateClient();
    }

  } catch (error) {
    console.error('Error saving client:', error);
  } finally {
    loading.value = false;
  }
};

const handleEditClient = async () => {
  loading.value = true;
  try {
    console.log('Updating client:', client.value);
    const token = sessionStorage.getItem('token');
    const url = `${getBaseUrl()}/api/v1/clients/${client.value.id}`;
    await axios.put(url, client.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handlePhotoUpload(client.value.id);
    emit('save');
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  } finally {
    loading.value = false;
  }
};

const handleCreateClient = async () => {
  console.log('Creating client:', client.value);
  loading.value = true;
  try {
    const token = sessionStorage.getItem('token');
    const url = `${getBaseUrl()}/api/v1/clients`;

    // First, create the client to get the ID
    const response = await axios.post(url, client.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handlePhotoUpload(response.data.data.id);
    emit('save');
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  } finally {
    loading.value = false;
  }
};

const handlePhotoUpload = async (clientId?: string) => {
  if (selectedFile.value) {
    try {
      const fileName = await uploadFile(selectedFile.value, clientId);
      client.value.photoFileName = fileName;
      console.log('Photo uploaded successfully:', fileName);
    } catch (error) {
      console.error('Error uploading photo:', error);
      // Don't throw the error to prevent client creation/update from failing
      alert('Client saved successfully, but photo upload failed. Please try uploading the photo again.');
    }
  }
};

const handleOverlayClick = async () => {
  if (hasChanges.value) {
    showConfirmation.value = true
  } else {
    closePopup();
  }
};

const confirmClose = () => {
  showConfirmation.value = false
  closePopup()
}

const cancelClose = () => {
  showConfirmation.value = false
}

const handleFileSelection = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};

const uploadFile = async (file: File, clientId?: string) => {
  try {
    // Use the provided clientId or fall back to the current client.value.id
    const idToUse = clientId || client.value.id;

    if (!idToUse) {
      throw new Error('No client ID available for photo upload');
    }

    console.log('Uploading file for client ID:', idToUse);
    const result = await PhotoService.uploadClientPhoto(idToUse, file, client.value);

    if (result.success && result.photoFileName) {
      return result.photoFileName;
    } else {
      throw new Error(result.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.popup-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.popup-content h2 {
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: white;
  font-size: 0.95rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

input,
select {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-family: 'Bricolage Grotesque', sans-serif;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color-alpha-60);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 20px var(--primary-color-alpha-30);
}

select {
  cursor: pointer;
}

select option {
  background: rgba(30, 30, 30, 0.95);
  color: white;
  padding: 10px;
}

button {
  font-family: 'Bricolage Grotesque', sans-serif;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-right: 1rem;
  margin-top: 1rem;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

button.btn-primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 15px var(--primary-color-alpha-30);
}

button.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--primary-color-alpha-40);
  background: var(--primary-gradient-hover);
}

button.btn-secondary {
  background: rgba(108, 117, 125, 0.8);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

button.btn-secondary:hover {
  transform: translateY(-2px);
  background: rgba(108, 117, 125, 1);
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
}

.form-group:last-of-type {
  margin-bottom: 2rem;
}

/* File input styling */
input[type="file"] {
  padding: 10px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
}

input[type="file"]:hover {
  border-color: var(--primary-color-alpha-60);
  background: rgba(255, 255, 255, 0.2);
}

input[type="file"]::-webkit-file-upload-button {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 10px;
  font-weight: 600;
}

input[type="file"]::-webkit-file-upload-button:hover {
  background: var(--primary-gradient-hover);
}

/* Scrollbar styling for modal content */
.popup-content::-webkit-scrollbar {
  width: 8px;
}

.popup-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.popup-content::-webkit-scrollbar-thumb {
  background: var(--primary-color-alpha-60);
  border-radius: 4px;
}

.popup-content::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color-alpha-80);
}

@media (max-width: 768px) {
  .popup-content {
    width: 95vw;
    padding: 1.5rem;
    margin: 1rem;
  }

  .popup-content h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  button {
    width: 100%;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>
