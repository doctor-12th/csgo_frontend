import './style.css'
import 'uno.css'

import { router } from '@/router'
import { pinia } from '@/pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { installPlugins } from './plugins'

const app = createApp(App)
installPlugins(app)
app.use(createPinia).use(router).mount('#app')
