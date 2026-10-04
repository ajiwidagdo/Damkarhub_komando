import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/tokens.css'
import './styles/fire-toggle.css'
import App from './App.vue'
import router from './router'
import { useTheme } from './composables/useTheme'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Terapkan tema tersimpan sebelum mount (hindari flash)
useTheme().initTheme()

app.mount('#app')
