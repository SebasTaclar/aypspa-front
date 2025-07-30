<template>
  <header>
    <nav class="navbar">
      <!-- Logo/Brand -->
      <RouterLink class="navbar-brand" to="/">AYPSPA</RouterLink>

      <!-- Desktop Navigation -->
      <div class="navbar-nav desktop-nav">
        <RouterLink v-if="isAdminRole" class="nav-link" to="/clients">Clientes</RouterLink>
        <RouterLink v-if="isAdminRole" class="nav-link" to="/products">Productos</RouterLink>
        <RouterLink v-if="isAdminRole" class="nav-link" to="/rents">Arrendamientos</RouterLink>
        <RouterLink class="nav-link" to="/privacy">Privacidad</RouterLink>
        <RouterLink class="nav-link" to="/contact">Contacto</RouterLink>
      </div>

      <!-- Desktop Controls -->
      <div class="nav-controls desktop-controls">
        <ThemeToggle />
        <RouterLink v-if="!isLoggedIn" class="nav-link access-btn" to="/login">Acceder</RouterLink>
        <span v-if="isLoggedIn" class="nav-link user-greeting">Hola, {{ username }}</span>
        <RouterLink v-if="isLoggedIn" @click="logout" class="nav-link logout-btn" to="/">Cerrar sesión</RouterLink>
      </div>

      <!-- Mobile Hamburger Button -->
      <button class="mobile-toggle" @click="toggleMobileMenu" :class="{ active: mobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" :class="{ active: mobileMenuOpen }" @click="closeMobileMenu"></div>

    <!-- Mobile Menu -->
    <nav class="mobile-menu" :class="{ active: mobileMenuOpen }">
      <div class="mobile-menu-content">
        <div class="mobile-menu-header">
          <span class="mobile-brand">AYPSPA</span>
          <button class="mobile-close" @click="closeMobileMenu">&times;</button>
        </div>

        <div class="mobile-nav-links">
          <RouterLink v-if="isAdminRole" class="mobile-nav-link" to="/clients" @click="closeMobileMenu">
            <span class="mobile-nav-icon">👥</span>
            Clientes
          </RouterLink>
          <RouterLink v-if="isAdminRole" class="mobile-nav-link" to="/products" @click="closeMobileMenu">
            <span class="mobile-nav-icon">📦</span>
            Productos
          </RouterLink>
          <RouterLink v-if="isAdminRole" class="mobile-nav-link" to="/rents" @click="closeMobileMenu">
            <span class="mobile-nav-icon">📋</span>
            Arrendamientos
          </RouterLink>
          <RouterLink class="mobile-nav-link" to="/privacy" @click="closeMobileMenu">
            <span class="mobile-nav-icon">🔒</span>
            Privacidad
          </RouterLink>
          <RouterLink class="mobile-nav-link" to="/contact" @click="closeMobileMenu">
            <span class="mobile-nav-icon">📞</span>
            Contacto
          </RouterLink>
        </div>

        <div class="mobile-menu-footer">
          <div class="mobile-theme-toggle">
            <ThemeToggle />
          </div>

          <div v-if="isLoggedIn" class="mobile-user-info">
            <span class="mobile-user-greeting">Hola, {{ username }}</span>
            <RouterLink @click="logout" class="mobile-logout-btn" to="/">Cerrar sesión</RouterLink>
          </div>

          <RouterLink v-if="!isLoggedIn" class="mobile-access-btn" to="/login" @click="closeMobileMenu">
            Acceder
          </RouterLink>
        </div>
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
const mobileMenuOpen = ref(false)

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
  mobileMenuOpen.value = false
  router.push('/')
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

onMounted(() => {
  checkAuthStatus()
})

const route = useRoute()
watch(route, () => {
  checkAuthStatus()
  closeMobileMenu() // Close mobile menu on route change
})
</script>

<style scoped>
/* ========== DESKTOP NAVBAR ========== */
.navbar {
  background: var(--bg-secondary);
  backdrop-filter: var(--backdrop-blur);
  border-bottom: 1px solid var(--border-primary);
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 70px;
  padding: 0 2rem;
  box-shadow: 0 2px 10px var(--shadow-primary);
  transition: all 0.3s ease;
}

.navbar-brand {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--primary-color);
  text-decoration: none;
  text-shadow: 2px 2px 4px var(--shadow-primary);
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.05);
  text-shadow: 2px 2px 8px var(--primary-color-alpha-60);
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: 2rem;
}

.nav-link {
  text-decoration: none;
  padding: 0.75rem 1rem;
  font-weight: 500;
  font-size: 1rem;
  color: var(--text-primary);
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--primary-gradient);
  transition: left 0.3s ease;
  z-index: -1;
}

.nav-link:hover::before {
  left: 0;
}

.nav-link:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px var(--primary-color-alpha-30);
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.access-btn {
  background: var(--primary-gradient);
  color: white !important;
  border-radius: 25px;
  padding: 0.75rem 1.5rem !important;
  font-weight: 600;
  box-shadow: 0 4px 15px var(--primary-color-alpha-30);
}

.access-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--primary-color-alpha-40);
}

.user-greeting {
  font-weight: 600;
  color: var(--primary-color);
  background: var(--bg-tertiary);
  border-radius: 20px;
  padding: 0.5rem 1rem !important;
}

.logout-btn {
  background: rgba(239, 68, 68, 0.8);
  color: white !important;
  border-radius: 20px;
  padding: 0.5rem 1rem !important;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 1) !important;
}

/* ========== MOBILE HAMBURGER ========== */
.mobile-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
}

.mobile-toggle span {
  width: 25px;
  height: 3px;
  background: var(--text-primary);
  margin: 3px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.mobile-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* ========== MOBILE MENU OVERLAY ========== */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* ========== MOBILE MENU ========== */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 320px;
  max-width: 85vw;
  height: 100%;
  background: var(--bg-secondary);
  backdrop-filter: var(--backdrop-blur);
  border-left: 1px solid var(--border-primary);
  z-index: 1000;
  transition: right 0.3s ease;
  overflow-y: auto;
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-content {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-primary);
  margin-bottom: 2rem;
}

.mobile-brand {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-color);
}

.mobile-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.mobile-close:hover {
  background: var(--bg-tertiary);
  transform: rotate(90deg);
}

.mobile-nav-links {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 1.1rem;
}

.mobile-nav-link:hover {
  background: var(--bg-tertiary);
  transform: translateX(5px);
}

.mobile-nav-link.router-link-active {
  background: var(--primary-gradient);
  color: white;
}

.mobile-nav-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.mobile-menu-footer {
  border-top: 1px solid var(--border-primary);
  padding-top: 1rem;
  margin-top: 1rem;
}

.mobile-theme-toggle {
  margin-bottom: 1rem;
  text-align: center;
}

.mobile-user-info {
  text-align: center;
  margin-bottom: 1rem;
}

.mobile-user-greeting {
  display: block;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.mobile-logout-btn {
  display: inline-block;
  background: rgba(239, 68, 68, 0.8);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.mobile-logout-btn:hover {
  background: rgba(239, 68, 68, 1);
  transform: translateY(-2px);
}

.mobile-access-btn {
  display: block;
  background: var(--primary-gradient);
  color: white;
  text-decoration: none;
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.mobile-access-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--primary-color-alpha-40);
}

/* ========== RESPONSIVE BREAKPOINTS ========== */
@media (max-width: 1024px) {
  .navbar {
    padding: 0 1.5rem;
  }

  .navbar-nav {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.95rem;
    padding: 0.6rem 0.8rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 1rem;
    height: 60px;
  }

  .navbar-brand {
    font-size: 1.5rem;
  }

  .desktop-nav,
  .desktop-controls {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0 1rem;
  }

  .navbar-brand {
    font-size: 1.3rem;
  }

  .mobile-menu {
    width: 280px;
  }

  .mobile-nav-link {
    font-size: 1rem;
    padding: 0.8rem;
  }
}
</style>
