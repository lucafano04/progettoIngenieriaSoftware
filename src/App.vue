<script setup lang="ts">
    import { MegaMenu, SplitButton, useToast, Toast, Button } from 'primevue';
    import { MenuItem } from 'primevue/menuitem';
    import { Ref, ref } from 'vue';
    import { Utenti } from '../types'
    import Avatar from 'primevue/avatar';
    import { logout } from './utils/utenti';
import { useRouter } from 'vue-router';
    
    const { user } = defineProps({
        user: { type: Object as () => Ref<Utenti.User | null>, required: true }
    })
    const history = useRouter();
    const menuItems = ref<MenuItem[]>([
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            to: '/',
            command: () => history.push('/')
        }
    ]);
    const toast = useToast();

    async function logoutToast(){
        try{
            const result = await logout();
            console.log(result);
            if(result){
                toast.add({severity: 'success', summary: 'Logout', detail: 'Logout effettuato con successo!', life: 5000});
                user.value = null;
            } else {
                toast.add({severity: 'error', summary: 'Logout', detail: 'Errore durante il logout!', life: 5000});
            }
        } catch(e: any){
            if(e instanceof Error)
                toast.add({severity: 'error', summary: 'Logout', detail: e.message, life: 5000});
            else
                toast.add({severity: 'error', summary: 'Logout', detail: 'Errore sconosciuto', life: 5000});
        }
    }
</script>

<template>
    <div class="tw-p-2">
        <Toast />
        <MegaMenu :model="menuItems" breakpoint="600px">
            <template #start>
                <div class="tw-flex tw-items-center tw-justify-center">
                    <img src="./assets/iconaNome.png" alt="icona" class="tw-mr-2 tw-h-10" />
                </div>
            </template>
            <template #end>
                <div v-if="user.value !== null">
                    <SplitButton :model="[{label: 'Logout', icon: 'pi pi-sign-out', command: logoutToast}]" class="tw-mr-2" text severity="contrast" size="small">
                        <span class="tw-flex tw-items-center tw-font-bold">
                            <Avatar :image="user.value.imageUrl.toString()" class="tw-mr-2" shape="circle" size="normal" />
                            <span>Ciao: {{ user.value.nome }}!</span>
                        </span>
                    </SplitButton>
                </div>
                <div v-else>
                    <Button label="Login" icon="pi pi-sign-in" icon-pos="left" class="tw-mr-2" text size="small" severity="contrast">
                        <RouterLink to="/login">
                            <span>Login</span>
                        </RouterLink>
                    </Button>
                </div>
            </template>
        </MegaMenu>
        <div class="tw-m-5 tw-mt-1 tw-container tw-mx-auto">
            <RouterView />
        </div>
    </div>
</template>