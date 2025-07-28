import { ref, computed } from 'vue'

const token = ref<string | null>(sessionStorage.getItem('token'))
const user = ref<any>(null)

// Try to get user from sessionStorage on startup
try {
  const userData = sessionStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
} catch (error) {
  console.error('Error parsing user data from sessionStorage:', error)
}

export const useAuth = () => {
  const isAuthenticated = computed(() => !!token.value)

  const setAuth = (authToken: string, userData: any) => {
    token.value = authToken
    user.value = userData
    sessionStorage.setItem('token', authToken)
    sessionStorage.setItem('user', JSON.stringify(userData))
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    localStorage.removeItem('rememberUser')
  }

  const logout = () => {
    clearAuth()
    window.location.href = '/login'
  }

  return {
    token: computed(() => token.value),
    user: computed(() => user.value),
    isAuthenticated,
    setAuth,
    clearAuth,
    logout,
  }
}
