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
        <button type="submit" class="btn btn-primary">Guardar</button>
        <button type="button" class="btn btn-secondary" @click="handleOverlayClick">
          Cancelar
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import type { Client } from '@/types/ClientType'
import { getBaseUrl } from '@/utils/apiConfig'
import { getPresignedUrl } from '@/utils/fileUtils'
import axios from 'axios'
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'UpsertClientPopup',
  props: {
    clientData: {
      type: Object as PropType<Client | null>,
      required: true,
    },
    mode: {
      type: String as PropType<'edit' | 'create'>,
      required: true,
    },
  },
  emits: ['close', 'save'],
  data() {
    return {
      selectedFile: null as File | null, // Store the selected file
    }
  },
  computed: {
    client() {
      return {
        ...this.clientData,
        id: this.clientData?.id || `client-${Date.now()}`,
        creationDate:
          this.clientData?.creationDate ||
          new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
      }
    },
  },
  methods: {
    closePopup() {
      this.$emit('close')
    },
    async saveClient() {
      try {
        if (this.selectedFile) {
          const fileName = await this.uploadFile(this.selectedFile)
          this.client.photoFileName = fileName
        }

        if (this.mode === 'edit') {
          await this.handleEditClient()
        } else if (this.mode === 'create') {
          await this.handleCreateClient()
        }
      } catch (error) {
        console.error('Error saving client:', error)
      }
    },
    async handleEditClient() {
      try {
        console.log('Updating client:', this.client)
        const token = sessionStorage.getItem('token')
        const url = `${getBaseUrl()}/api/v1/clients`
        await axios.put(url, this.client, {
          params: {
            id: this.client.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.$emit('save')
      } catch (error) {
        console.error('Error updating client:', error)
        throw error
      }
    },
    async handleCreateClient() {
      try {
        console.log('Creating client:', this.client)
        const token = sessionStorage.getItem('token')
        const url = `${getBaseUrl()}/api/v1/clients`
        await axios.post(url, this.client, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.$emit('save')
      } catch (error) {
        console.error('Error creating client:', error)
        throw error
      }
    },
    handleOverlayClick() {
      const hasChanges = JSON.stringify(this.client) !== JSON.stringify(this.clientData)
      console.log('Current client:', JSON.stringify(this.client, null, 2))
      console.log('Original client data:', JSON.stringify(this.clientData, null, 2))
      if (hasChanges) {
        const confirmClose = confirm(
          '¿Estás seguro de que deseas cerrar el formulario? Los cambios no guardados se perderán.',
        )
        if (confirmClose) {
          this.closePopup()
        }
      } else {
        this.closePopup()
      }
    },
    handleFileSelection(event: Event) {
      const target = event.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        this.selectedFile = target.files[0]
        console.log('File selected:', this.selectedFile)
      }
    },

    async uploadFile(file: File) {
      try {
        const fileExtension = file.name.split('.').pop()
        const fileName = `clients/${this.client.id}.${fileExtension}`
        const preSignedUrl = await getPresignedUrl(fileName, file.type, 'save');

        await axios.put(preSignedUrl, file);
        console.log('File uploaded successfully!');

        return fileName;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error uploading file:', error.response?.data || error.message)
        } else {
          console.error('Error uploading file:', error)
        }
        throw error
      }
    },
  },
})
</script>

<style scoped>
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
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Bricolage Grotesque', sans-serif;
}

button {
  margin-right: 10px;
  font-family: 'Bricolage Grotesque', sans-serif;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button.btn-primary {
  background-color: green;
  color: white;
}

button.btn-secondary {
  background-color: gray;
  color: white;
}
</style>
