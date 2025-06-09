import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/common/assets/styles/index.scss'
import 'virtual:uno.css'

import { router } from '@/router'
import { pinia } from '@/pinia'
import { createApp } from 'vue'

// import 'normalize.css'
import 'nprogress/nprogress.css'

import App from './App.vue'
import { installPlugins } from './plugins'

const app = createApp(App)
installPlugins(app)
app.use(pinia).use(router).mount('#app')
