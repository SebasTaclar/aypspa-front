import './assets/main.css'
import './assets/styles/global.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupAxiosInterceptors } from './utils/apiConfig'

// Setup Axios interceptors for global error handling
setupAxiosInterceptors()

const app = createApp(App)

app.use(router)

app.mount('#app')
