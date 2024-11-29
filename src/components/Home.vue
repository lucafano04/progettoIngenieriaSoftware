<script lang="ts" setup>
    import { onMounted, ref } from 'vue';
    import Mappa from './Mappa.vue';
    import { Circoscrizioni, Dati, Quartieri } from '../../types';
    import { getInfoGenerali } from '../utils/misc';
    import { Skeleton } from 'primevue';
    import { getQuartiere } from '../utils/quartieri';
    import { useToast } from 'primevue';
    import { getCircoscrizione } from '../utils/circoscrizioni';
import InfoZona from './InfoZona.vue'
    const toast = useToast();

    const quartCirc = ref<boolean>(false);
    const zonaSel = ref<string>('');
    const datiZona = ref<Circoscrizioni.Circoscrizione | Quartieri.Quartiere | null>(null);

    const infoGenerali = ref<Dati.DatiGenericiCitta | null>(null);
    onMounted(async () => {
        try{
            infoGenerali.value = await getInfoGenerali();
        }catch(e: any){
            if(e instanceof Error)
                toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
            else
                toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
        }
    });
    const labQuartCirc = ref<string>('Quartieri');
    async function updateZona(quartiere: string) {
        zonaSel.value = quartiere;
        const arr = quartiere.split('/');
        const idQuart = arr.pop();
        const tipo = arr.pop();
        
        if(tipo === 'quartieri'){
            labQuartCirc.value = 'Quartiere';
            if(idQuart !== undefined)
                datiZona.value = await getQuartiere(idQuart);
            else
                toast.add({severity: 'error', summary: 'Errore', detail: 'Errore durante il recupero dei dati della zona', life: 5000});
        }else if (tipo === 'circoscrizioni'){
            labQuartCirc.value = 'Circoscrizione';
            if(idQuart !== undefined)
                datiZona.value = await getCircoscrizione(idQuart);
            else
                toast.add({severity: 'error', summary: 'Errore', detail: 'Errore durante il recupero dei dati della zona', life: 5000});
        }
    }
</script>
<template>
    <div class="tw-grid tw-cols-1 lg:tw-grid-cols-12 tw-mt-6 tw-gap-4">
        <div v-if="zonaSel === ''" class="tw-rounded tw-p-5 tw-width-full lg:tw-col-span-5 tw-col-span-1">
            <div class="tw-grid tw-grid-cols-12 tw-gap-4">
                <h1 class="tw-text-2xl tw-font-bold tw-text-center tw-col-span-12 tw-text-bold">Trento</h1>
                <div class="tw-flex tw-justify-center tw-col-span-2"> <span class="pi pi-users tw-text-3xl tw-mr-2"></span></div>
                <div class="tw-flex tw-justify-center tw-col-span-4"> Popolazione </div>
                <div v-if="infoGenerali" class="tw-flex tw-justify-center tw-col-span-4"><b>{{ infoGenerali.popolazione }} </b></div>
                <div v-else class="tw-flex tw-justify-center tw-col-span-4"> <Skeleton width="100px" /> </div>
                <div class="tw-col-span-2">abit.</div>
                <div class="tw-flex tw-justify-center tw-col-span-2"> <span class="pi pi-map tw-text-3xl tw-mr-2"></span></div>
                <div class="tw-flex tw-justify-center tw-col-span-4"> Superficie </div>
                <div v-if="infoGenerali" class="tw-flex tw-justify-center tw-col-span-4"><b>{{ infoGenerali.superficie }} </b></div>
                <div v-else class="tw-flex tw-justify-center tw-col-span-4"> <Skeleton width="100px" /> </div>
                <div class="tw-col-span-2">km²</div>
                <div class="tw-flex tw-justify-center tw-col-span-2"> <span class="pi pi-history tw-text-3xl tw-mr-2"></span></div>
                <div class="tw-flex tw-justify-center tw-col-span-4">Età media</div>
                <div v-if="infoGenerali" class="tw-flex tw-justify-center tw-col-span-4"><b>{{ infoGenerali.etaMedia}}</b></div>
                <div v-else class="tw-flex tw-justify-center tw-col-span-4"> <Skeleton width="100px" /> </div>
                <div class="tw-col-span-2">anni</div>
                <div class="tw-flex tw-justify-center tw-col-span-2"> <span class="pi pi-face-smile tw-text-3xl tw-mr-2"></span></div>
                <div class="tw-flex tw-justify-center tw-col-span-4">Soddisfazione Media</div>
                <div v-if="infoGenerali" class="tw-flex tw-justify-center tw-col-span-4"><b>{{ (infoGenerali.soddisfazioneMedia/5*100).toFixed(2) }}</b></div>
                <div v-else class="tw-flex tw-justify-center tw-col-span-4"> <Skeleton width="100px" /></div>
                <div class="tw-col-span-2">%</div>
            </div>
        </div>
        <InfoZona :labQuartCirc="labQuartCirc" :zonaSel="zonaSel" :datiZona="datiZona" class="lg:tw-hidden" />
        <Mappa :quartCirc="quartCirc" :zonaSel="zonaSel" @setZonaSel="updateZona" class="lg:tw-col-span-7"/>
        <InfoZona :labQuartCirc="labQuartCirc" :zonaSel="zonaSel" :datiZona="datiZona" class="tw-hidden lg:tw-grid lg:tw-col-span-5 " />
    </div>
</template>
<style>
    .dark > ** > svg, path {
        fill: white;
    }
    .svg-image > svg {
        width: 30px;
        height: 30px;
    }
</style>