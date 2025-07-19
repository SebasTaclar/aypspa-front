<template>
  <header>
    <div class="wrapper">
      <nav class="navbar">
        <RouterLink class="link-navbar home" to="/">AYPSPA</RouterLink>
        <RouterLink class="link-navbar" to="/clients">Clientes</RouterLink>
        <RouterLink v-if="isAdminRole" class="link-navbar" to="/products">Productos</RouterLink>
        <RouterLink v-if="isAdminRole" class="link-navbar" to="/rents">Arrendamientos</RouterLink>
        <RouterLink class="link-navbar" to="/clients">Privacidad</RouterLink>
        <RouterLink class="link-navbar" to="/clients">Contacto</RouterLink>
        <RouterLink v-if="!isLoggedIn" class="link-navbar access" to="/login">Acceder</RouterLink>
        <span v-if="isLoggedIn" class="link-navbar access"> Hola, {{ username }} </span>
        <RouterLink v-if="isLoggedIn" @click="logout" class="link-navbar" to="/">Cerrar sesión</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { getTokenName, isTokenValid, userHasAdminRole } from '@/utils/auth'
import { onMounted, ref, watch } from 'vue'
import router from './router'

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
  justify-content: start;
  gap: 20px;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 60px;
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
  color: #ff6347;
  background-color: rgba(192, 192, 192, 0.3);
  border-radius: 50px;
}

.home {
  font-size: 1.5rem;
  color: red;
  font-weight: 1000;
}

.access {
  margin-left: auto;
}
</style>
