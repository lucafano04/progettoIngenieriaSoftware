import { createApp, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import Aura from '@primevue/themes/aura'

import { Divider, MegaMenu,Panel } from 'primevue';

import App from './App.vue'

import 'primeicons/primeicons.css'; // Icone
import './index.css'


import { getSession } from './utils/utenti';
import { Utenti } from '../types';
import { Home, Login, ModificaSondaggio, Sondaggi } from './components';


const user = ref<Utenti.User | null>(null);
const mounted = ref(false);
const app = createApp(App,{user});

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/login', component: Login , props: { user } },
        { path: '/sondaggi', component: Sondaggi, props: { user } },
        { path: '/sondaggi/:id', component: ModificaSondaggio, props: { user } },
    ]
});

const notAuthRoutes = ['/login', '/'];


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
            ripple: true,
        }
    }
});
app.use(router)
app.use(ToastService)
app.use(ConfirmationService)

app.component('MegaMenu', MegaMenu)
app.component('Panel', Panel)
app.component('Divider', Divider)

app.mount('#app');

asyncFun();
async function asyncFun(){
    const old = mounted.value;
    user.value = await getSession();
    mounted.value = true;

    if(!old)
        router.push(router.currentRoute.value.path);
};
router.afterEach((to, from) => {
    if(user.value === null && !notAuthRoutes.includes(to.path) && mounted.value){
        router.push('/login');
    }else {
        if(user.value !== null){
            console.log(user.value.ruolo);
            switch (to.path) {
                case '/sondaggi':
                    if(user.value.ruolo !== 'Amministratore' && user.value.ruolo !== 'Sondaggista')
                        router.push('/');
                    break;
                case '/login':
                    router.push('/');
                    break;
                default:
                    break;
            }
        }
    }
});