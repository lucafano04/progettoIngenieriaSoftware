<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { Card, useToast, InputText, FloatLabel, Button, Skeleton } from 'primevue';
    import ListaSondaggi from './ListaSondaggi.vue';
    import { User } from '../../../types/Utenti';
    import { Sondaggi } from '../../../types';
    import { aggiungiSondaggio, getSondaggi } from '../../utils/sondaggi';
    
    const props = defineProps<{
        user: User | null;
    }>();
    const user = props.user;
    const toast = useToast();
    const sondaggi = ref<Sondaggi.Minimal[]>([]);
    const file = ref<File | null>(null);
    const over = ref<boolean>(false);
    const sondaggioAdd = ref<Sondaggi.Add>({titolo: '',})
    const loadingAdd = ref<boolean>(false);
    const preLoading = ref<boolean>(false);
    onMounted(async () => {
        try{
            sondaggi.value = await getSondaggi();
            preLoading.value = true;
        } catch(e: any){
            if(e instanceof Error)
                toast.add({severity: 'error', summary: 'Errore caricamento sondaggi', detail: e.message, life: 5000});
            else
                toast.add({severity: 'error', summary: 'Errore caricamento sondaggi', detail: 'Errore sconosciuto', life: 5000});
        }
    });
    async function handlerFileUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files) {
            file.value = target.files[0];
        }
    }
    function dropAction(event: DragEvent) {
        event.preventDefault();

        over.value = false;
        
        if (event.dataTransfer) {
            file.value = event.dataTransfer.files[0];
        }
    }
    function preventDefaults(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }
    function changeArea(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        console.log(event.type);
        if(event.type === 'dragenter'){
            over.value = true;
        } else {
            over.value = false;
        }
    }
    async function aggiungiSondaggino(){
        loadingAdd.value = true;
        try{
            await aggiungiSondaggio(sondaggioAdd.value);
            toast.add({severity: 'success', summary: 'Sondaggio aggiunto', detail: 'Sondaggio aggiunto con successo', life: 5000});
            sondaggi.value = await getSondaggi();
            sondaggioAdd.value.titolo = '';
        }catch (e: any){
            if(e instanceof Error)
                toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
            else
                toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
        }finally{
            loadingAdd.value = false;
        }
    }
</script>
<template>
    <div class="md:tw-grid gridTemplate tw-w-full tw-gap-4 tw-h-5/6">
        <div class="newSondaggio tw-my-auto" v-if="user?.ruolo === 'Sondaggista'">
            <Card header="Crea una nuova sessione">
                <template #title>
                    Crea una nuova sessione
                </template>
                <template #content>
                    <div class="tw-flex tw-justify-center tw-items-center tw-flex-col">
                        <div class="tw-w-full tw-py-4">
                            <FloatLabel variant="on" class="tw-w-full">
                                <InputText v-model="sondaggioAdd.titolo" id="titolo" type="text" class="tw-w-full" :disabled="loadingAdd" />
                                <label for="titolo">Titolo</label>
                            </FloatLabel>
                        </div>
                        <div class="tw-w-full tw-py-4 tw-flex tw-justify-center">
                            <Button label="Apri Sessione" class="tw-mx-auto" icon="pi pi-play" :loading="loadingAdd" @click="aggiungiSondaggino"/>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <div class="separatorText tw-my-auto" v-if="user?.ruolo === 'Sondaggista'">
            <p class="tw-text-center tw-text-md">Oppure</p>
        </div>
        <div class="uploadSondaggio tw-my-auto" v-if="user?.ruolo === 'Sondaggista'">
            <Card header="Carica una sessione">
                <template #title>
                    Carica una sessione
                </template>
                <template #content>
                    <div class="tw-flex tw-justify-center tw-items-center tw-p-2">
                        <span class="tw-px-4 tw-w-1/2 tw-flex-col tw-justify-between">
                            <div>
                                <span v-if="file">{{file.name}}</span>
                                <span v-else>Seleziona il file da caricare:</span>
                            </div>
                            <label for="file" class="p-button p-component tw-w-full" data-pc-name="button" data-p-disabled="false" pc27="" data-pc-selection="root">
                                <span class="pi pi-upload tw-text-lg p-button-icon p-button-icon-left" data-pc-selection="icon"></span>
                                <span class="p-button-label" data-pc-selection="label">
                                    Sfoglia
                                </span>
                            </label>
                            <input type="file" class="tw-hidden" id="file" v-on:change="handlerFileUpload"/>
                        </span>
                        <label for="file" class="tw-cursor-pointer tw-p-4 tw-border tw-border-dashed tw-rounded-lg tw-text-center tw-w-1/2" id="dropArea" 
                        v-on:drop="dropAction" v-on:dragover="preventDefaults" v-on:dragenter="changeArea" v-on:dragleave="changeArea">
                        <i v-if="over" class="pi pi-download tw-text-2xl"></i>
                        <i v-else class="pi pi-upload tw-text-2xl"></i>
                        <p v-if="over">Rilascia il file</p>
                        <p v-else>Trascina qui il file</p>
                        </label>
                    </div>
                </template>
            </Card>
        </div>
        <div class="listaSondaggi">
            <div class="tw-grid tw-gap-6 tw-grid-cols-1 tw-my-4">
                <h1 class="tw-text-2xl">Sessioni in lavorazione</h1>
                <ListaSondaggi :sondaggi="sondaggi.filter(sondaggio=>sondaggio.isAperto)" />
                <Skeleton v-if="!preLoading" height="66px" />
            </div>
            <div class="tw-my-4">
                <Divider />
            </div>
            <div class="tw-grid tw-gap-6 tw-grid-cols-1 tw-my-4">
                <h1 class="tw-text-2xl">Sessioni caricate</h1>
                <ListaSondaggi :sondaggi="sondaggi.filter(sondaggio=>!sondaggio.isAperto)" />
                <Skeleton v-if="!preLoading" v-for="i in 5" :key="i" height="66px" />
            </div>
        </div>
    </div>
</template>

<style lang="css">
    .gridTemplate {
        grid-template-areas: 
            "newSondaggio listaSondaggi listaSondaggi"
            "separatorText listaSondaggi listaSondaggi"
            "uploadSondaggio listaSondaggi listaSondaggi";
        grid-template-rows: 48% 4% 48%;
        grid-template-columns: 1fr 1fr 1fr;
    }
    .newSondaggio {
        grid-area: newSondaggio;
    }
    .listaSondaggi {
        grid-area: listaSondaggi;
    }
    .uploadSondaggio {
        grid-area: uploadSondaggio;
    }
</style>