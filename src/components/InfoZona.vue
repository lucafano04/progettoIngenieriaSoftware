<script setup lang="ts">
    import { Circoscrizioni, Quartieri } from '../../types';
    import areeVerdi from '../assets/tree.svg?raw';
    import scuole from '../assets/school.svg?raw';
    import ristoranti from '../assets/restaurant.svg?raw';
    defineProps<{
        labQuartCirc: string;
        datiZona: Circoscrizioni.Circoscrizione | Quartieri.Quartiere | null;
    }>()
    
</script>

<template>
    <div v-if="datiZona" class="tw-rounded tw-p-5 tw-grid tw-grid-cols-7 tw-gap-4">
        <h1 class="tw-text-2xl tw-font-bold tw-text-center tw-col-span-7 tw-text-bold">{{ labQuartCirc }}:
            {{ datiZona.nome }}</h1>
        <div class="tw-flex tw-justify-center"> <span class="pi pi-users tw-text-3xl tw-mr-2"></span></div>
        <div class="tw-flex tw-justify-center"> Popolazione </div>
        <div class="tw-flex tw-justify-center"><b>{{ datiZona.popolazione }} </b></div>
        <div>abit.</div>
        <div class="tw-flex tw-justify-center tw-align-center"><div class="svg-image" v-html="areeVerdi"></div></div>
        <div class="tw-flex tw-justify-center">Aree Verdi</div>
        <div class="tw-flex tw-justify-center"> {{ datiZona.servizi.areeVerdi }} </div>
        <div class="tw-flex tw-justify-center"> <span class="pi pi-map tw-text-3xl tw-mr-2"></span></div>
        <div class="tw-flex tw-justify-center">Superficie</div>
        <div class="tw-flex tw-justify-center"><b>{{ datiZona.superficie }} </b></div>
        <div>km²</div>
        <div class="tw-flex tw-justify-center"> <div class="svg-image" v-html="scuole"></div></div>
        <div class="tw-flex tw-justify-center">Scuole</div>
        <div class="tw-flex tw-justify-center"><b>{{ datiZona.servizi.scuole }} </b></div>
        <div class="tw-flex tw-justify-center"><span class="pi pi-history tw-text-3xl tw-mr-2"></span></div>
        <div class="tw-flex tw-justify-center">Età media</div>
        <div class="tw-flex tw-justify-center"><b>{{ datiZona.etaMedia}}</b></div>
        <div>anni</div>
        <div class="tw-flex tw-justify-center"><div class="svg-image" v-html="ristoranti"></div></div>
        <div class="tw-flex tw-justify-center">Ristoranti</div>
        <div class="tw-flex tw-justify-center"><b>{{ datiZona.servizi.serviziRistorazione }} </b></div>
        <div class="tw-flex tw-justify-center"><span class="pi pi-face-smile tw-text-3xl tw-mr-2"></span></div>
        <div class="tw-flex tw-justify-center">Soddisfazione Media</div>
        <div class="tw-flex tw-justify-center"><b>{{ (datiZona.soddisfazioneMedia/5*100).toFixed(2) }}</b></div>
        <div>%</div>
        <div class="tw-flex tw-justify-center"><span class="pi pi-ticket tw-text-3xl tw-mr-2"></span></div>
        <div class="tw-flex tw-justify-center">Luoghi di svago</div>
        <div class="tw-flex tw-justify-center"><b>{{ datiZona.servizi.localiNotturni }} </b></div>
    </div>
</template>
