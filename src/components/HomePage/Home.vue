<script lang="ts" setup>
    import { onMounted, Ref, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import Mappa from '../common/Mappa.vue';
    import Tabella from './Tabella.vue';
    import { Circoscrizioni, Dati, Quartieri, Utenti } from '../../../types';
    import { getInfoGenerali } from '../../utils/misc';
    import { Skeleton } from 'primevue';
    import { getQuartiere, getQuartieri, getQuartieriNoCoordinate } from '../../utils/quartieri';
    import { useToast, Dialog, Select, FloatLabel } from 'primevue';
    import { getCircoscrizione, getCircoscrizioni, getCircoscrizioniNoCoordinate } from '../../utils/circoscrizioni';
    import InfoZona from './InfoZona.vue';
    import Analisi from '../AnalisiPage';

    const toast = useToast();

    const quartCirc = ref<boolean>(false);
    const zonaSel = ref<string>('');
    const mappaTabella = ref<'mappa' | 'tabella'>('mappa');
    
    const route = useRoute();
    const router = useRouter(); // Router per la navigazione

    const props = defineProps({
        user: { type: Object as () => Ref<Utenti.User | null>, required: true }
    })
    const user = props.user;
    const labQuartCirc = ref<string>('Quartieri');
    // Dati completi zona selezionata sia per modalità analisi che per visualizzazione normale
    const datiZona = ref<Circoscrizioni.Circoscrizione | Quartieri.Quartiere | null>(null);
    // Dati generali della città
    const infoGenerali = ref<Dati.DatiGenericiCitta | null>(null);
    // Variabile per aprire il dialog delle opzioni
    const optionsOpen = ref<boolean>(false);
    // Quartieri e circoscrizioni minimi per la visualizzazione
    const quartieri = ref<Quartieri.Minimal[]>([]);
    // Circoscrizioni minimi per la visualizzazione
    const circoscrizioni = ref<Circoscrizioni.Minimal[]>([]);
    // Usati solo nel caso di utente analista (e quindi vogliamo visualizzare i dati completi tramite la tabella)
    const fullQuartieri = ref<Quartieri.QuartiereNoC[]>([]);
    const fullCircoscrizioni = ref<Circoscrizioni.CircoscrizioneNoC[]>([]);

    if(route.hash === '#tabella')
        mappaTabella.value = 'tabella';
    if(route.path.includes('analisi')){
        const splitted = route.path.split('/');
        const idElm = splitted.pop();
        const type = splitted.pop();
        if(type === 'quartieri'){
            quartCirc.value = false;
        }else if(type === 'circoscrizioni'){
            quartCirc.value = true;
        }
        if((type === 'quartieri' || type === 'circoscrizioni') && idElm && idElm.length === 24)
            updateZona(`/api/v1/${type}/${idElm}`);
    }

    watch(() => mappaTabella.value, (newVal) => {
        location.replace(`#${newVal}`);
    });

    onMounted(async () => {
        try{
            await Promise.all([getInfoGenerali(), getQuartieri(false), getCircoscrizioni(false)]).then(([info, quart, circ]) => {
                infoGenerali.value = info;
                quartieri.value = quart;
                circoscrizioni.value = circ;
            }).catch(e => {
                if(e instanceof Error)
                    toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
                else
                    toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
            });
            if(user.value?.ruolo === 'Analista'){
                await Promise.all([getQuartieriNoCoordinate(true), getCircoscrizioniNoCoordinate(true)]).then(([quart, circ]) => {
                    fullQuartieri.value = quart as Quartieri.QuartiereNoC[]
                    fullCircoscrizioni.value = circ as Circoscrizioni.CircoscrizioneNoC[];
                }).catch(e => {
                    if(e instanceof Error)
                        toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
                    else
                        toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
                });
            }
        }catch(e: any){
            if(e instanceof Error)
                toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
            else
                toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
        }
    });
    async function updateZona(quartiere: string) {
        if(user.value?.ruolo === 'Analista'){
            // Redirect to the corresponding analisi page
            if(quartiere!=='')
                router.push(`/analisi/${quartiere.split('/').slice(3,5).join('/')}`);
            else
                router.push('/');
        }
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
        <FloatLabel v-if="user?.ruolo==='Analista'" variant="on" class="tw-mt-8">
            <Select v-model:model-value="mappaTabella" :options="[{name: 'Mappa', value: 'mappa'}, {name: 'Tabella', value: 'tabella'}]" optionLabel="name" optionValue="value" inputId="mappaTabella" class="tw-w-full"/>
            <label for="mappaTabella">Visualizzazione:</label>
        </FloatLabel>
    </Dialog> 
    <div class="tw-flex tw-flex-col lg:tw-flex-row tw-justify-evenly tw-items-center tw-w-full tw-p-5 tw-gap-4">
        <div v-if="zonaSel === ''&&user?.ruolo !=='Analista'" :class="{'tw-rounded tw-p-5 tw-w-full':true, 'lg:tw-w-1/2':mappaTabella === 'mappa', 'lg:tw-w-1/3':mappaTabella === 'tabella'}">
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
                <div v-if="infoGenerali" class="tw-flex tw-justify-center tw-col-span-4"><b>{{ (infoGenerali.soddisfazioneMedia).toFixed(2) }}</b></div>
                <div v-else class="tw-flex tw-justify-center tw-col-span-4"> <Skeleton width="100px" /></div>
                <div class="tw-col-span-2">%</div>
            </div>
        </div>
        <InfoZona :labQuartCirc="labQuartCirc" :datiZona="datiZona" :zona-sel="zonaSel" class="lg:tw-hidden" v-if="user?.ruolo !== 'Analista'" />
        <Mappa :quartCirc="quartCirc" :zonaSel="zonaSel" @setZonaSel="updateZona" @openSettings="openSettings" :class="{ 'tw-w-full':true,'lg:tw-w-6/12':true}" v-if="mappaTabella === 'mappa'" :quartieri="quartieri" :circoscrizioni="circoscrizioni" />
        <Tabella v-else :class="{ 'tw-w-full':true,'lg:tw-w-2/3':true}" :quartieri="fullQuartieri" :circoscrizioni="fullCircoscrizioni"  @openSettings="openSettings" :quartCirc="quartCirc" @setZonaSel="updateZona" />
        <InfoZona :labQuartCirc="labQuartCirc" :datiZona="datiZona" :zona-sel="zonaSel" class="tw-hidden lg:tw-grid lg:tw-w-6/12" v-if="user?.ruolo !== 'Analista'"/>
        <Analisi v-if="user?.ruolo === 'Analista'" :quartCirc="quartCirc" :zonaSel="zonaSel" :datiZonaSel="datiZona" :infoGenerali="infoGenerali" class="tw-w-1/1 lg:tw-w-1/2" />
    </div>
</template>