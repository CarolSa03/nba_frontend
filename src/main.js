import { createApp } from 'vue'
import './style.css'
import { useDark, usePreferredDark } from '@vueuse/core'
import App from './App.vue'

const app = createApp(App)
const isDark = useDark()
usePreferredDark()

app.mount('#app')
