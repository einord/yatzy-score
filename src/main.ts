import { createApp } from 'vue';
import App from './app.vue';
import './registerServiceWorker';

import DiceValue from '@/components/dice-value.vue';

createApp(App)
    // Global components
    .component('dice', DiceValue)
    .mount('#app');
