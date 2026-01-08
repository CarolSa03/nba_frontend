import { createApp } from 'vue'
import './style.css'
import { useDark, usePreferredDark } from '@vueuse/core'
import App from './App.vue'

const app = createApp(App)
usePreferredDark()
useDark({ value: true, selector: 'html' })
app.mount('#app')
