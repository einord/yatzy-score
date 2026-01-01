import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import DiceValue from './components/dice-value.vue';
import Checkbox from './components/checkbox.vue';
import { useRegisterSW } from 'virtual:pwa-register/vue'


const app = createApp(App)
    .component('dice', DiceValue)
    .component('checkbox', Checkbox);

app.mount('#app');

// Register the service worker for PWA support.
useRegisterSW({ immediate: true });
