<script lang="ts" setup>
    import { onMounted, ref } from 'vue';
    import Mappa from './Mappa.vue';
    import { Circoscrizioni, Dati, Quartieri } from '../../../types';
    import { getInfoGenerali } from '../../utils/misc';
    import { Skeleton } from 'primevue';
    import { getQuartiere } from '../../utils/quartieri';
    import { useToast, Dialog, Select, FloatLabel } from 'primevue';
    import { getCircoscrizione } from '../../utils/circoscrizioni';
    import InfoZona from './InfoZona.vue'
    const toast = useToast();

    const quartCirc = ref<boolean>(false);
    const zonaSel = ref<string>('');
    const datiZona = ref<Circoscrizioni.Circoscrizione | Quartieri.Quartiere | null>(null);

    const infoGenerali = ref<Dati.DatiGenericiCitta | null>(null);

    const optionsOpen = ref<boolean>(false);
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
        
        try{
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
        }catch(e: any){
            if(e instanceof Error)
                toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
            else
                toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
        }
    }
    function openSettings(){optionsOpen.value = true;}

</script>
<template>
    <Dialog modal :close-on-escape=true v-model:visible="optionsOpen" :show-header=true header="Opzioni Visualizzazione" :draggable="false">
        <FloatLabel variant="on">
            <Select v-model:model-value="quartCirc" :options="[{name: 'Quartieri', value: false}, {name: 'Circoscrizioni', value: true}]" optionLabel="name" optionValue="value" inputId="quartCirc" class="tw-w-full"/>
            <label for="quartCirc">Visualizza:</label>
        </FloatLabel>
    </Dialog> 
    <div class="tw-flex tw-flex-col lg:tw-flex-row tw-justify-evenly tw-items-center tw-w-full tw-p-5">
        <div v-if="zonaSel === ''" class="tw-rounded tw-p-5 tw-w-full lg:tw-w-6/12">
            <div class="tw-grid tw-gap-4 tw-w-9/12 tw-mx-auto">
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
        <InfoZona :labQuartCirc="labQuartCirc" :datiZona="datiZona" :zona-sel="zonaSel" class="lg:tw-hidden" />
        <Mappa :quartCirc="quartCirc" :zonaSel="zonaSel" @setZonaSel="updateZona" @openSettings="openSettings" :class="{ 'tw-w-full':true,'lg:tw-w-6/12':true}" />
        <InfoZona :labQuartCirc="labQuartCirc" :datiZona="datiZona" :zona-sel="zonaSel" class="tw-hidden lg:tw-grid lg:tw-w-6/12" />
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