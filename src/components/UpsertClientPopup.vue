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
          <input id="nombreEmpresa" v-model="client.companyName" type="text" required />
        </div>
        <div class="form-group">
          <label for="documentoEmpresa"># Documento Empresa</label>
          <input id="documentoEmpresa" v-model="client.companyDocument" type="text" required />
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
        <button type="submit" class="btn btn-primary" :disabled="loading">Guardar</button>
        <button type="button" class="btn btn-secondary" @click="handleOverlayClick">
          Cancelar
        </button>
      </form>
    </div>
  </div>

  <Spinner v-if="loading" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getBaseUrl } from '@/utils/apiConfig';
import { getPresignedUrl } from '@/utils/fileUtils';
import axios from 'axios';
import Spinner from '@/components/Spinner.vue';
import type { Client } from '@/types/ClientType';

const { clientData, mode } = defineProps<{
  clientData: Client | null;
  mode: 'edit' | 'create';
}>();

const emit = defineEmits(['close', 'save']);

const selectedFile = ref<File | null>(null);
const loading = ref(false);

const client = computed(() => ({
  ...clientData,
  id: clientData?.id || `${Date.now()}`,
  creationDate:
    clientData?.creationDate ||
    new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
}));

const closePopup = () => {
  emit('close');
};

const saveClient = async () => {
  loading.value = true;
  try {
    if (selectedFile.value) {
      const fileName = await uploadFile(selectedFile.value);
      client.value.photoFileName = fileName;
    }

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
    const url = `${getBaseUrl()}/api/v1/clients`;
    await axios.put(url, client.value, {
      params: {
        id: client.value.id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    emit('save');
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  } finally {
    loading.value = false;
  }
};

const handleCreateClient = async () => {
  loading.value = true;
  try {
    console.log('Creating client:', client.value);
    const token = sessionStorage.getItem('token');
    const url = `${getBaseUrl()}/api/v1/clients`;
    await axios.post(url, client.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    emit('save');
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  } finally {
    loading.value = false;
  }
};

const handleOverlayClick = async () => {
  const hasChanges = JSON.stringify(client.value) !== JSON.stringify(clientData);
  if (hasChanges) {
    const confirmClose = confirm(
      '¿Estás seguro de que deseas cerrar el formulario? Los cambios no guardados se perderán.',
    );
    if (confirmClose) {
      closePopup();
    }
  } else {
    closePopup();
  }
};

const handleFileSelection = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};

const uploadFile = async (file: File) => {
  try {
    const fileExtension = 'png' //file.name.split('.').pop();
    const fileName = `clients/${client.value.id}.${fileExtension}`;
    const preSignedUrl = await getPresignedUrl(fileName, file.type, 'save');

    await axios.put(preSignedUrl, file);
    console.log('File uploaded successfully!');

    return fileName;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error uploading file:', error.response?.data || error.message);
    } else {
      console.error('Error uploading file:', error);
    }
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
