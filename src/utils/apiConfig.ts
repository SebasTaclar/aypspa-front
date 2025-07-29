import axios from 'axios'

export const getBaseUrl = (): string => {
  const localBaseUrl = 'http://localhost:7071'
  const remoteBaseUrl = 'https://aypspa-back.azurewebsites.net'
  const isLocal = window.location.hostname === 'localhost'
  return isLocal ? localBaseUrl : remoteBaseUrl
}

// Function to clear authentication data
const clearAuthData = () => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
  localStorage.removeItem('rememberUser')
}

// Function to redirect to login
const redirectToLogin = () => {
  // Clear authentication data
  clearAuthData()

  // Show alert to user
  alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')

  // Redirect to login page
  window.location.href = '/login'
}

// Configure Axios interceptors
export const setupAxiosInterceptors = () => {
  // Response interceptor to handle 401 errors globally
  axios.interceptors.response.use(
    (response) => {
      // Return successful responses as-is
      return response
    },
    (error) => {
      // Check if the error is 401 Unauthorized
      if (error.response?.status === 401) {
        console.log('Session expired - redirecting to login')
        redirectToLogin()
        // Return a rejected promise to prevent further processing
        return Promise.reject(new Error('Session expired'))
      }

      // For other errors, return the original error
      return Promise.reject(error)
    },
  )

  // Request interceptor to add Authorization header automatically
  axios.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )
}
