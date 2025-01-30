<script lang="ts" setup>
    import {onMounted, ref} from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import Mappa from '../common/Mappa.vue';
    import { useToast, Tabs, Tab, TabPanel, TabList, TabPanels, Skeleton } from 'primevue';
    import { getQuartieri } from '../../utils/quartieri';
    import { getCircoscrizioni } from '../../utils/circoscrizioni';
    import { Circoscrizioni, Dati, Quartieri } from '../../../types';
    import { getInfoGenerali } from '../../utils/misc';

    import ristoranti from '../../assets/restaurant.svg?raw';
    import scuole from '../../assets/school.svg?raw';
    import areeVerdi from '../../assets/tree.svg?raw';
    import polizia from '../../assets/polizia.svg?raw';
    import incidenti from '../../assets/accidents.svg?raw';
    

    const toast = useToast(); // Toast per la visualizzazione di eventuali errori
    const router = useRouter(); // Router per la navigazione
    const route = useRoute(); // Route per ottenere i parametri dell'URL
    const quartieri = ref<Quartieri.Quartiere[]>([]); // Lista dei quartieri
    const circoscrizioni = ref<Circoscrizioni.Circoscrizione[]>([]); // Lista delle circoscrizioni
    const datiGenericiCittà = ref<Dati.DatiGenericiCitta | null>(null); // Dati generici della città
    const quartCirc = ref<boolean>(false); // true = circoscrizioni, false = quartieri
    const zonaSel = ref<string>(''); // Endpoint API zona selezionata
    const datiZonaSel = ref<Circoscrizioni.Circoscrizione | Quartieri.Quartiere | null>(null); // Dati zona selezionata
    
    const { tipo, id } = route.params;  // Ottengo i parametri dell'URL
    if(tipo && id) { // Se i parametri sono presenti 
        zonaSel.value = `/api/v1/${tipo}/${id}`; // Imposto la zona selezionata 
        quartCirc.value = tipo === 'circoscrizioni'; // Imposto il tipo di zona selezionata
        updateDatiZona();
    }else{
        router.push('/#tabella'); // Se non ci sono parametri, reindirizzo alla tabella
    }

    // Caricamento dati iniziali
    onMounted(()=>{
        // Caricamento dati iniziali (quartieri, circoscrizioni, dati generici città)
        Promise.all([getQuartieri(true), getCircoscrizioni(true), getInfoGenerali()]).then(([quartieriR, circoscrizioniR,datiCitta]) => {
            quartieri.value = quartieriR as Quartieri.Quartiere[];
            circoscrizioni.value = circoscrizioniR as Circoscrizioni.Circoscrizione[];
            datiGenericiCittà.value = datiCitta;
            // Aggiornamento dati zona selezionata sulla base dei dati appena caricati
            updateDatiZona();
        }).catch(e => {
            // Gestione errori
            if(e instanceof Error)
                toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
            else
                toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
        });
    });
    /**
     * Listener dalla mappa per l'aggiornamento della zona selezionata
     * @param {string} nuovaZona nuova zona selezionata
     */
    function updateZona(nuovaZona: string): void {
        if(nuovaZona === '')
            router.back();
        zonaSel.value = nuovaZona;
        updateDatiZona(nuovaZona, quartCirc.value);
    }
    /**
     * Aggiornamento dei dati della zona selezionata
     * @param {string} nuovaZona nuova zona selezionata (se non specificata, usa la zona selezionata attuale)
     * @param {boolean} newType tipo di zona selezionata (true = circoscrizioni, false = quartieri, se non specificato usa il tipo attuale)
     */
    function updateDatiZona(nuovaZona: string = zonaSel.value, newType: boolean = quartCirc.value): void {
        datiZonaSel.value = (newType ? circoscrizioni.value.find(c => c.self === nuovaZona) : quartieri.value.find(q => q.self === nuovaZona) ) || null;
    }
</script>

<template>
    <div class="tw-h-full tw-w-full">
        <div class="tw-flex tw-flex-col lg:tw-flex-row tw-justify-evenly tw-items-center tw-w-full tw-p-5 tw-gap-5">
            <Mappa :quartieri="quartieri" :circoscrizioni="circoscrizioni" :quartCirc="quartCirc" :zonaSel="zonaSel" @setZonaSel="updateZona" @openSettings="()=>{}" class="lg:tw-w-1/3 tw-h-full tw-w-full"/>
            <div class="tw-w-2/3 tw-border tw-border-gray-300 tw-rounded-lg tw-p-5 tw-mt-5 lg:tw-mt-0">
                <h1 class="tw-text-2xl tw-font-bold tw-mb-5">{{ 
                    (quartCirc ? 'Circoscrizione ' : 'Quartiere ') + datiZonaSel?.nome
                }}</h1>
                <Tabs :value="0">
                    <TabList>
                        <Tab :value="0">Generale</Tab>
                        <Tab :value="1" v-if="zonaSel">Demografica</Tab>
                        <Tab :value="2" v-if="zonaSel">Servizi</Tab>
                        <Tab :value="3" v-if="zonaSel">Sicurezza</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel :value="0">
                            <div class="tw-grid tw-grid-cols-12 tw-align-center tw-gap-2">
                                <div class="tw-col-span-12 tw-mb-4">
                                    <h2 class="tw-text-xl tw-font-bold tw-m-auto">Informazioni Generali</h2>
                                </div>
                                <span class="pi pi-users tw-text-3xl tw-m-auto"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Popolazione</p>
                                </div>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.popolazione }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <div class="tw-col-span-1 tw-m-auto">
                                    <p class="tw-text-sm">abit.</p>
                                </div>
                                <span class="pi pi-map tw-text-3xl tw-m-auto"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Superficie</p>
                                </div>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.superficie }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <div class="tw-col-span-1 tw-m-auto">
                                    <p class="tw-text-sm">km²</p>
                                </div>
                                <span class="pi pi-history tw-text-3xl tw-m-auto"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Età media</p>
                                </div>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.etaMedia }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <div class="tw-col-span-1 tw-m-auto">
                                    <p class="tw-text-sm">anni</p>
                                </div>
                                <span class="pi pi-face-smile tw-text-3xl tw-m-auto"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Soddisfazione media</p>
                                </div>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ (datiZonaSel.soddisfazioneMedia/5*100).toFixed(2) }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <div class="tw-col-span-1 tw-m-auto">
                                    <p class="tw-text-sm">%</p>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel :value="1">
                            <!-- Dati demografici (Popolazione, Età Media, Superficie) -->
                            <div class="tw-grid tw-grid-cols-12 tw-align-center tw-gap-2">
                                <div class="tw-col-span-12 tw-mb-4">
                                    <h2 class="tw-text-xl tw-font-bold tw-m-auto">Informazioni Demografiche</h2>
                                </div>
                                <span class="pi pi-users tw-text-3xl tw-m-auto"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Popolazione</p>
                                </div>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.popolazione }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <div class="tw-col-span-1 tw-m-auto">
                                    <p class="tw-text-sm">abit.</p>
                                </div>
                                <span class="pi pi-map tw-text-3xl tw-m-auto"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Superficie</p>
                                </div>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.superficie }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <div class="tw-col-span-1 tw-m-auto">
                                    <p class="tw-text-sm ">km²</p>
                                </div>
                                <span class="pi pi-history tw-text-3xl tw-m-auto"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Età media</p>
                                </div>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.etaMedia }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <div class="tw-col-span-1 tw-m-auto">
                                    <p class="tw-text-sm">anni</p>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel :value="2">
                            <!-- Dati Servizi (Numero Totale, Scuole, Aree Verdi, Servizi di Ristorazione, Locali notturni)-->
                            <div class="tw-grid tw-grid-cols-12 tw-align-center tw-gap-2">
                                <div class="tw-col-span-12 tw-mb-4">
                                    <h2 class="tw-text-xl tw-font-bold tw-m-auto">Informazioni sui Servizi</h2>
                                </div>
                                <span class="pi pi-equals tw-text-3xl tw-m-auto"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Numero Totale</p>
                                </div>
                                <div class="tw-col-span-3 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.servizi.areeVerdi + datiZonaSel.servizi.localiNotturni + datiZonaSel.servizi.scuole + datiZonaSel.servizi.serviziRistorazione }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <span class="svg-image tw-m-auto" v-html="scuole"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Scuole</p>
                                </div>
                                <div class="tw-col-span-3 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.servizi.scuole }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <span class="svg-image tw-m-auto" v-html="areeVerdi"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Aree Verdi</p>
                                </div>
                                <div class="tw-col-span-3 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.servizi.areeVerdi }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <span class="svg-image tw-m-auto" v-html="ristoranti"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Servizi di Ristorazione</p>
                                </div>
                                <div class="tw-col-span-3 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.servizi.serviziRistorazione }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel :value="3">
                            <!-- Dati sicurezza (numero interventi, incidenti, tasso di criminalità) -->
                            <div class="tw-grid tw-grid-cols-12 tw-align-center tw-gap-2">
                                <div class="tw-col-span-12 tw-mb-4">
                                    <h2 class="tw-text-xl tw-font-bold tw-m-auto">Informazioni sulla Sicurezza</h2>
                                </div>
                                <span class="svg-image tw-m-auto" v-html="polizia"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Numero Interventi</p>
                                </div>
                                <div class="tw-col-span-3 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.sicurezza.numeroInterventi }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <span class="svg-image tw-m-auto" v-html="incidenti"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Numero Incidenti</p>
                                </div>
                                <div class="tw-col-span-3 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.sicurezza.incidenti }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <span class="pi pi-ban tw-text-3xl tw-m-auto"></span>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-lg tw-font-bold">Tasso di Criminalità</p>
                                </div>
                                <div class="tw-col-span-3 tw-m-auto">
                                    <p v-if="datiZonaSel">
                                        {{ datiZonaSel.sicurezza.tassoCriminalita }}
                                    </p>
                                    <Skeleton v-else width="75px" height="1.5rem"/>
                                </div>
                                <div class="tw-col-span-2 tw-m-auto">
                                    <p class="tw-text-sm ">crimini ogni 1000 abitanti</p>
                                </div>  
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div> 
    </div>
</template>