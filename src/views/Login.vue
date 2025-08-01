<template>
  <main class="login-main">
    <div class="login-container">
      <div class="login-header">
        <h1>Acceder</h1>
        <h2>Ingrese Usuario/Email y contraseña</h2>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required @invalid="setCustomValidityMessage"
            @input="clearCustomValidityMessage" class="form-input" />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" required @invalid="setCustomValidityMessage"
            @input="clearCustomValidityMessage" class="form-input" />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Accediendo...' : 'Acceder' }}
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
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  background: var(--bg-gradient-primary);
  position: relative;
  transition: all 0.3s ease;
}

.login-main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: var(--bg-gradient-accent);
  pointer-events: none;
}

.login-container {
  background: var(--bg-secondary);
  backdrop-filter: var(--backdrop-blur);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid var(--border-primary);
  box-shadow: 0 8px 32px var(--shadow-primary);
  text-align: center;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.login-header {
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px var(--shadow-primary);
  font-family: var(--font-primary);
}

.login-header h2 {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 400;
  opacity: 0.9;
  font-family: var(--font-primary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: var(--font-primary);
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  font-family: var(--font-primary);
  backdrop-filter: var(--backdrop-blur);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color-alpha-60);
  background: var(--bg-secondary);
  box-shadow: 0 0 20px var(--primary-color-alpha-30);
  transform: translateY(-1px);
}

.form-input:invalid {
  border-color: rgba(239, 68, 68, 0.6);
}

.btn-primary {
  width: 100%;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--primary-color-alpha-30);
  backdrop-filter: blur(10px);
  font-family: var(--font-primary);
  margin-top: 1rem;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--primary-color-alpha-40);
  background: var(--primary-gradient-hover);
}

.btn-primary:disabled {
  background: var(--bg-tertiary);
  color: var(--text-disabled);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-main {
    padding: 1rem;
  }

  .login-container {
    padding: 2rem;
    max-width: 350px;
  }

  .login-header h1 {
    font-size: 2rem;
  }

  .login-header h2 {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem;
    max-width: 300px;
  }

  .login-header h1 {
    font-size: 1.8rem;
  }
}
</style>
