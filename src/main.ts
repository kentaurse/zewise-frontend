import './styles/global.css'

// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import VueLazyLoad from 'vue-lazyload'

const app = createApp(App)

app.use(router)
app.use(VueLazyLoad, {
  preLoad: 1.3,
  attempt: 1
})

app.mount('#app')
