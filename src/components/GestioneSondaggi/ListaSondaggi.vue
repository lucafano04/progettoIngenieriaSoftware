<script setup lang="ts">
    import { Sondaggi } from '../../../types';
    import { Button } from 'primevue';
    import { useRouter } from 'vue-router';

    const props = defineProps<{
        sondaggi: Sondaggi.Minimal[];
    }>()
    const router = useRouter();

    const onClickSondaggio = (sondaggio: Sondaggi.Minimal, event: Event) => {
        event.stopPropagation();
        if(sondaggio.isAperto){
            router.push(`/sondaggi/${sondaggio.self.split('/').pop()}`);
        }
    }
</script>
<template>
    <div v-for="sondaggio in props.sondaggi" :key="sondaggio.self" :class="{'tw-p-2 tw-border dark:tw-border-black tw-rounded-lg tw-shadow-md tw-text-black dark:tw-text-white': true, 'tw-bg-yellow-100 dark:tw-bg-yellow-800': sondaggio.isAperto || sondaggio.statoApprovazione === 'In attesa', 'tw-bg-green-300 dark:tw-bg-green-900': !sondaggio.isAperto && sondaggio.statoApprovazione === 'Approvato', 'tw-bg-red-200 dark:tw-bg-red-800': !sondaggio.isAperto && sondaggio.statoApprovazione === 'Rifiutato'}" @click="onClickSondaggio(sondaggio, $event)">
        <div class="tw-grid tw-grid-cols-3">
            <div class="tw-flex tw-flex-col">
                <b class="tw-text-lg">{{ sondaggio.titolo }}</b>
                <p class="tw-text-sm">{{ new Date(sondaggio.dataInizio).toLocaleDateString() }}</p>
            </div>
            <div class="tw-flex tw-items-center">
                <p>Stato sessione: </p>
                <p :class="{'dark:tw-text-green-300 tw-text-green-800': !sondaggio.isAperto, 'tw-text-red-700 dark:tw-text-red-200': sondaggio.isAperto, 'tw-ml-2': true}">{{ sondaggio.isAperto ? 'Non' : '' }} Completata </p>
            </div>
            <div :class="{'tw-flex tw-items-center':true, 'tw-justify-end':sondaggio.isAperto, 'tw-justify-start': !sondaggio.isAperto}">
                <Button label="Modifica" icon="pi pi-pencil" :class="{'tw-mx-2 tw-text-black dark:tw-text-white':true, 'tw-hidden': !sondaggio.isAperto}" variant="text" @click="onClickSondaggio(sondaggio, $event)" />
                <p :class="{'tw-hidden': sondaggio.isAperto, 'tw-mx-2': !sondaggio.isAperto}">Verifica dati: </p>
                <p :class="{'tw-hidden': sondaggio.isAperto,'dark:tw-text-green-300 tw-text-green-800': sondaggio.statoApprovazione === 'Approvato', 'tw-text-red-800 dark:tw-text-red-200': sondaggio.statoApprovazione === 'Rifiutato', 'tw-text-yellow-800 dark:tw-text-yellow-200': sondaggio.statoApprovazione === 'In attesa'}">{{ sondaggio.statoApprovazione }}</p>
            </div>
        </div>
    </div>
</template>