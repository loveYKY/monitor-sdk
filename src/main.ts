import { createApp } from 'vue'

import './style.css'
import App from './App.vue'
import router from './router'
import errorCapture from './utils/errorCapture'
createApp(App).use(router).use(errorCapture).mount('#app')
