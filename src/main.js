

import { createApp } from 'vue'
import App from './App.vue'
import MyTimer from '@/components/MyTimer.vue'

createApp(App)
    .component('MyTimer', MyTimer)
    .mount('#app')
