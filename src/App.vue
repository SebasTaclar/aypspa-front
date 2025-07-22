<template>
  <header>
    <nav class="navbar">
      <RouterLink class="link-navbar home" to="/">AYPSPA</RouterLink>
      <RouterLink v-if="isAdminRole" class="link-navbar" to="/clients">Clientes</RouterLink>
      <RouterLink v-if="isAdminRole" class="link-navbar" to="/products">Productos</RouterLink>
      <RouterLink v-if="isAdminRole" class="link-navbar" to="/rents">Arrendamientos</RouterLink>
      <RouterLink class="link-navbar" to="/privacy">Privacidad</RouterLink>
      <RouterLink class="link-navbar" to="/contact">Contacto</RouterLink>

      <div class="nav-controls">
        <ThemeToggle />
        <RouterLink v-if="!isLoggedIn" class="link-navbar access" to="/login">Acceder</RouterLink>
        <span v-if="isLoggedIn" class="link-navbar access"> Hola, {{ username }} </span>
        <RouterLink v-if="isLoggedIn" @click="logout" class="link-navbar" to="/">Cerrar sesión</RouterLink>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { getTokenName, isTokenValid, userHasAdminRole } from '@/utils/auth'
import { onMounted, ref, watch } from 'vue'
import router from './router'
import ThemeToggle from '@/components/ThemeToggle.vue'

const isLoggedIn = ref(false)
const username = ref('')
const isAdminRole = ref(false)

const checkAuthStatus = () => {
  isLoggedIn.value = isTokenValid()
  if (isLoggedIn.value) {
    username.value = getTokenName() || ''
    isAdminRole.value = userHasAdminRole()
  }
}

const logout = () => {
  sessionStorage.removeItem('token')
  isLoggedIn.value = false
  username.value = ''
  isAdminRole.value = false
  router.push('/')
}

onMounted(() => {
  checkAuthStatus()
})

const route = useRoute()
watch(route, () => {
  checkAuthStatus()
})
</script>

<style scoped>
.navbar {
  background-color: #333;
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 60px;
  padding: 0 20px;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

.link-navbar {
  text-decoration: none;
  padding: 10px;
  font-weight: 400;
  font-size: 1.2rem;
  color: #f0f0f0;
  transition: color 0.3s ease-in-out;
}

.link-navbar:hover {
  color: var(--primary-color);
  background-color: rgba(192, 192, 192, 0.3);
  border-radius: 50px;
}

.home {
  font-size: 1.5rem;
  color: var(--primary-color);
  font-weight: 1000;
}

.access {
  margin-left: 0;
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    height: auto;
    padding: 10px;
  }

  .nav-controls {
    gap: 10px;
  }

  .link-navbar {
    font-size: 1rem;
    padding: 8px;
  }

  .home {
    font-size: 1.3rem;
  }
}
</style>
