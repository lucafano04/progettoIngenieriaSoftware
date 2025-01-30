<script lang="ts" setup>
    import { DataTable, Column, Button, Skeleton } from 'primevue';
    import { Circoscrizioni, Quartieri } from '../../../types';
    import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';


    const props = defineProps({
        quartCirc: { type: Boolean, required: true },
        quartieri: { type: Array as () => Quartieri.QuartiereNoC[], required: true },
        circoscrizioni: { type: Array as ()=> Circoscrizioni.CircoscrizioneNoC[], required: true }
    });
    const emit = defineEmits(["openSettings"]);

    const cols = [
        {field: 'nome', header: 'Nome', sortable: true},
        {field: 'popolazione', header: 'Popolazione', sortable: true},
        {field: 'superficie', header: 'Superficie', sortable: true},
        {field: 'etaMedia', header: 'Età media', sortable: true},
        {field: 'soddisfazioneMedia', header: 'Soddisfazione media', sortable: true, body: (row: any) => {
            return (row.soddisfazioneMedia/5*100).toFixed(2) + '%';
        }}
    ];
    
    let { quartieri, circoscrizioni } = props;
    const selData = ref<Quartieri.QuartiereNoC[] | Circoscrizioni.CircoscrizioneNoC[]>([]);
    
    if(props.quartCirc) {
        selData.value = circoscrizioni;
    } else {
        selData.value = quartieri;
    }
    watch(() => props.quartCirc, (newVal) => {
        console.log(newVal);
        selData.value = [];
        if (newVal) {
            selData.value = circoscrizioni;
        } else {
            selData.value = quartieri;
        }
    });

    watch(() => props.quartieri, (newVal) => {
        quartieri = newVal;
        if(!props.quartCirc)
            selData.value = newVal;
    });
    watch(() => props.circoscrizioni, (newVal) => {
        circoscrizioni = newVal;
        if(props.quartCirc)
            selData.value = newVal;
    });
</script>
<template>
    <div class="tw-rounded" style="height: max(500px, 85vh)">
        <DataTable :value="selData" scrollable scrollHeight="75vh" stripedRows dataKey="self">
            <template #header>
                <div class="tw-flex tw-justify-between tw-items-center tw-p-2">
                    <span class="tw-font-bold">Elenco {{ props.quartCirc ? 'circoscrizioni' : 'quartieri' }}</span>
                    <Button icon="pi pi-cog" class="tw-p-button-rounded tw-p-button-text" severity="contrast" @click="emit('openSettings')"/>
                </div>
            </template>
            <Column key="nome" field="nome" header="Nome" sortable>
                <template #body="{data}">
                    <RouterLink :to="'/analisi/' + data.self.split('/').slice(-2).join('/')">{{ data.nome }}</RouterLink>
                </template>
            </Column>
            <Column v-for="col in cols.filter(c => c.field!=='nome')" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable">
                <template #body="{data}">
                    {{ 
                        col.field === 'nome' ?
                            null
                        : col.body ? col.body(data) : data[col.field]
                    }}
                </template>
            </Column>
            <template #empty>
                <Skeleton v-for="i in 10" :key="i" width="100%" height="50px" class="tw-my-3"/>
            </template>
        </DataTable>
    </div>
</template>

<!--
<DataTable :value="circoscrizioni" scrollable scrollHeight="85vh" v-model:expanded-rows="circoscrizioni" stripedRows dataKey="self">
            <Column expander style="width: 3em"/>
            <Column v-for="col in cols" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable">
                <template #body="{data}">
                    {{ 
                        col.body ? col.body(data) : data[col.field]
                    }}
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="tw-p-4">
                    <DataTable :value="quartieri.filter(q => q.circoscrizione.self === slotProps.data.self)" scrollable scrollHeight="200px" striped-rows size="small" dataKey="self" :show-headers="false">
                        <template #header>
                            <span class="tw-font-bold">Quartieri della circoscrizione {{ slotProps.data.nome }}</span>
                        </template>
                        <template #empty>
                            Nessun quartiere trovato
                        </template>
                        
                        <Column v-for="col in cols" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable">
                            <template #body="{data}">
                                {{ 
                                    col.body ? col.body(data) : data[col.field]
                                }}
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>



-->