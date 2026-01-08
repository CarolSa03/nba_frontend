import { createApp } from 'vue'
import './style.css'
import { useDark } from '@vueuse/core'
import App from './App.vue'

const app = createApp(App)
document.documentElement.classList.add('dark')
useDark({ selector: 'html' })

app.mount('#app')
