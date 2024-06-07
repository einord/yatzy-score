import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import DiceValue from './components/dice-value.vue';
import Checkbox from './components/checkbox.vue';


createApp(App)
    // Global components
    .component('dice', DiceValue)
    .component('checkbox', Checkbox)
    .mount('#app');
