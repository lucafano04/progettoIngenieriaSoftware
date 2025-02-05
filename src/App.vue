<script setup lang="ts">
    import { Menubar, SplitButton, useToast, Toast, ConfirmDialog } from 'primevue';
    import { MenuItem } from 'primevue/menuitem';
    import { Ref, ref, watch } from 'vue';
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
    const dropDownItems = ref<MenuItem[]>([
        {
            label: 'Cambio Lingua',
            icon: 'pi pi-fw pi-flag'
        }
    ]);
    const toast = useToast();

    async function logoutToast(){
        try{
            const result = await logout();
            if(result){
                toast.add({severity: 'success', summary: 'Logout', detail: 'Logout effettuato con successo', life: 5000});
                user.value = null;
                history.push('/');
                dropDownItems.value = dropDownItems.value.filter((item) => ['Home', 'Cambio Lingua'].includes(item.label as string));
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
    if(user.value !== null)
        addElements(user.value);
    
    watch(()=>user.value, (newValue) => {
        if(newValue !== null && !dropDownItems.value.find((item) => item.label === 'Logout'))
            addElements(newValue);
    });
    function addElements(user: Utenti.User){
        dropDownItems.value.push({
            divider: true
        });
        if(user.ruolo === "Sondaggista"){
            dropDownItems.value.push({
                label: 'Sondaggi',
                icon: 'pi pi-fw pi-chart-bar',
                to: '/sondaggi',
                command: () => history.push('/sondaggi')
            });
        }
        dropDownItems.value.push({
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command: logoutToast
        });
    }
</script>

<template>
    <div class="tw-p-2 tw-flex tw-flex-col tw-h-dvh">
        <Toast />
        <ConfirmDialog />
        <Menubar :model="menuItems" breakpoint="600px">
            <template #start>
                <div class="tw-flex tw-items-center tw-justify-center">
                    <RouterLink to="/">
                        <img src="./assets/iconaNome.png" alt="icona" class="tw-mr-2 tw-h-10" />
                    </RouterLink>
                    </div>
            </template>
            <template #end>
                <SplitButton :model="dropDownItems" class="tw-mr-2" text severity="contrast" size="small">
                    <span v-if="user.value !== null" class="tw-flex tw-items-center tw-font-bold">
                        <Avatar :image="user.value.imageUrl.toString()" class="tw-mr-2" shape="circle" size="normal" />
                        <span>Ciao: {{ user.value.nome }}!</span>
                    </span>
                    <span v-else class="tw-flex tw-items-center tw-font-bold tw-mr-5">
                        <RouterLink to="/login">
                            <Avatar icon="pi pi-user" class="tw-mr-2" shape="circle" size="normal" />
                            <span>Login</span>
                        </RouterLink>
                    </span>
                </SplitButton>
            </template>
        </Menubar>
        <div class="tw-m-5 tw-container tw-mx-auto tw-grow">
            <RouterView />
        </div>
    </div>
</template>