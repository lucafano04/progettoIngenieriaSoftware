<script setup lang="ts">
    import { Ref, ref } from 'vue';
    import { InputText, Button, FloatLabel, useToast } from 'primevue';
    import { postSession } from '../../utils/utenti';
    import { useRouter } from 'vue-router';
    import { Utenti } from '../../../types';
    
    const props = defineProps({
        user: { type: Object as () => Ref<Utenti.User | null>, required: true }
    });
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const toast = useToast();
    const router = useRouter();

    async function login(){
        loading.value = true;
        try{
            const result = await postSession(email.value, password.value);
            if(result){
                toast.add({severity: 'success', summary: 'Successo', detail: 'Login effettuato con successo', life: 3000});
                router.push('/');
                props.user.value = result
            }else{
                toast.add({severity: 'error', summary: 'Errore', detail: 'Credenziali errate', life: 5000});
            }
        }catch(err){
            if(err instanceof Error)
                toast.add({severity: 'error', summary: 'Errore', detail: err.message, life: 5000});
            else
                toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
        }finally{
            loading.value = false;
        }
    }
</script>
<template>
    <div class="tw-p-2">
        <div class="tw-flex tw-justify-center tw-items-center tw-h-screen">
            <div class="tw-bg-gray-700 dark:tw-bg-gray-300 tw-p-8 tw-rounded-lg tw-shadow-lg tw-w-96"> <!-- TODO: Cambiare le classi tw-bg-gray-700 dark:tw-bg-gray-300 quando la palette è pronta -->
                <h1 class="tw-text-2xl tw-font-bold tw-text-center tw-mb-4 dark:tw-text-black tw-text-white">Login</h1>
                <FloatLabel variant="on" class="tw-mb-4">
                    <InputText v-model="email" class="tw-w-full" itemid="username" :disabled="loading" />
                    <label for="username">Nome Utente</label>
                </FloatLabel>
                <FloatLabel variant="on" class="tw-mb-4">
                    <InputText v-model="password" class="tw-w-full" itemid="password" type="password" :disabled="loading" />
                    <label for="password">Password</label>
                </FloatLabel>
                <Button label="Login" class="tw-w-full tw-mb-4" @click="login" :loading="loading" type="submit"/>
            </div>
        </div>
    </div>
</template>