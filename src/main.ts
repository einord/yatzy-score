import { createApp } from 'vue';
import App from './app.vue';
import './registerServiceWorker';

import DiceValue from '@/components/dice-value.vue';
import Checkbox from '@/components/checkbox.vue';

createApp(App)
    // Global components
    .component('dice', DiceValue)
    .component('checkbox', Checkbox)
    .mount('#app');
