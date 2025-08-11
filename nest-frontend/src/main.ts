import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
// intro English language pack for Element Plus
import en from 'element-plus/es/locale/lang/en'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:svg-icons-register'
import pinia from './store/index'
import router from './router'
import registerGlobComp from './components'
import directives from '@/directives/index'

import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import '@/assets/fonts/font.scss'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.use(ElementPlus, {
  locale: en,
})

app.use(registerGlobComp)
app.use(pinia)
app.use(router)
app.use(directives)

app.mount('#app')