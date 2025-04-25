<template>
  <main class="login-main">
    <div class="login-container">
      <h1>Acceder</h1>
      <h2>Ingrese Usuario/Email y contraseña</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required @invalid="setCustomValidityMessage"
            @input="clearCustomValidityMessage" />
        </div>
        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" required @invalid="setCustomValidityMessage"
            @input="clearCustomValidityMessage" />
        </div>
        <button type="submit" :disabled="loading">
          Acceder
        </button>
      </form>
    </div>

    <Spinner v-if="loading" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { isTokenValid } from '@/utils/auth';
import { getBaseUrl } from '@/utils/apiConfig';
import Spinner from '@/components/Spinner.vue';

defineOptions({
  name: 'LoginView',
});

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    const url = `${getBaseUrl()}/api/v1/login`;
    const response = await axios.get(url, {
      params: {
        username: email.value,
        password: password.value,
      },
    });
    console.log('Login response:', response.data);
    if (response.data) {
      console.log('Token:', response.data);
      sessionStorage.setItem('token', response.data);
      if (!isTokenValid()) {
        sessionStorage.removeItem('token');
        alert('token invalid');
      } else {
        router.push('/');
      }
    } else {
      alert('Login fallo: credenciales invalidas');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('There was a problem with the axios operation:', error);
      alert('Login failed: ' + error.message);
    } else {
      console.error('An unexpected error occurred:', error);
      alert('Login failed: An unexpected error occurred');
    }
  } finally {
    loading.value = false;
  }
};

const setCustomValidityMessage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.validity.valid) {
    target.setCustomValidity('Este campo es obligatorio.');
  }
};

const clearCustomValidityMessage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.setCustomValidity('');
};
</script>

<style scoped>
.login-main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.login-container {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

h1 {
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 2rem;
  font-size: 1rem;
  color: #666;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Bricolage Grotesque', sans-serif;
}

button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: rgb(51, 47, 47);
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: red;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
