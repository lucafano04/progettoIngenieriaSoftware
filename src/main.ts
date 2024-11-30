import { createApp, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import Aura from '@primevue/themes/aura'

import { MegaMenu,Panel } from 'primevue';

import App from './App.vue'

import 'primeicons/primeicons.css'; // Icone
import './index.css'


import { getSession } from './utils/utenti';
import { Utenti } from '../types';
import { Home, Login } from './components';


const user = ref<Utenti.User | null>(null);

const app = createApp(App,{user});

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/login', component: Login , props: { user } }
    ]
});


app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.tw-dark',
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            },
        }
    }
});
app.use(router)
app.use(ToastService)

app.component('MegaMenu', MegaMenu)
app.component('Panel', Panel)

app.mount('#app')

getSession().then((data) => {
    user.value = data;
});