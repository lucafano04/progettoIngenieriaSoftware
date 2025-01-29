<script lang="ts" setup>
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useToast, Card, Skeleton, DataTable, Column, Button, Select, FloatLabel, VirtualScroller, useConfirm} from 'primevue';
    import { addVoto, deleteSondaggio, deleteVoto, getSondaggio, getVoti, modificaSondaggio } from '../../../utils/sondaggi';
    import { Sondaggi, Voti } from '../../../../types';
    import { getQuartieriNoCoordinate } from '../../../utils/quartieri';
    import voto1 from "../../../assets/voti/voto1.svg?raw";
    import voto2 from "../../../assets/voti/voto2.svg?raw";
    import voto3 from "../../../assets/voti/voto3.svg?raw";
    import voto4 from "../../../assets/voti/voto4.svg?raw";
    import voto5 from "../../../assets/voti/voto5.svg?raw";

    // Rotta e router usati per gestire redirect vari
    const route = useRoute();
    const router = useRouter();
    // Servizio toast per le notifiche di successo/errore
    const toast = useToast();
    // Servizio confirm per il popup di conferma
    const confirm = useConfirm();
    // Parametri della rotta
    const param = route.params;
    // Riferimento al sondaggio, null se ancora non caricato
    const sondaggio = ref<Sondaggi.Sondaggio | null>(null);
    // Riferimento all'elenco dei quartieri
    const quartieri = ref<{self: string, nome: string}[]>([]);
    // Riferimento al dato de-normalizzato dell'età media - null se non disponibile o non caricato
    const etaMedia = ref<number | null>(null);
    // Riferimento delle righe per la tabella voti per quartiere
    const votiPerQuartiere = ref<{quartiere: {self: string, nome: string}, numeroVoti: number}[]>([]);
    // Riferimento per la selezione del voto - quartiere, età, voto, stato del voto
    // Nuovo tipo definito per leggibilità
    type selType = {quartiere: { value: string | null, invalid: boolean},eta: {value:string, invalid:boolean},voto: number | '',isVoting: number};
    const selezione = ref<selType>(
        {quartiere: { value: null, invalid: false}, eta: {value: '', invalid: false}, voto: '', isVoting: 0}
    );
    // Riferimento per le fasce di età
    const ageRanges:{range: string, value: number | ''}[] = [{range: 'n/a', value: ''}];
    // Riferimento per lo stato del caricamento del voto: true - in caricamento, false - non in caricamento/caricato
    const loadingSend = ref<boolean>(false);
    
    // Aggiunta range di età
    const max = 100;
    for(let i=0;i<max;i+=10){
        ageRanges.push({range: `${i}-${i+9}`, value: Math.floor((i*2+9)/2)});
    }
    ageRanges.push({range: `${max}+`, value: max});

    // Caricamento dati backend quando l'app è stata montata
    onMounted(async () => {
        try{
            // Creo una serie di promesse per ottenere i quartieri, le circoscrizioni e il sondaggio
            const promises = {quartieri: getQuartieriNoCoordinate(), sondaggio: getSondaggio(param.id.toString()) };
            // Faccio partire tutte le richieste in parallelo in modo da ridurre il tempo di attesa
            const [p1,p3] = await Promise.all([promises.quartieri, promises.sondaggio]);
            quartieri.value = p1.map(q => ({self: q.self, nome: q.nome})).sort((a,b) => a.nome.localeCompare(b.nome));
            updateSondaggio(p3);            // Funzione per caricare tutti i dati del sondaggio
        }catch(e){
            // Eseguo il catch di eventuali errori dovuti a non autenticazione e/o altro
            if(e instanceof Error){
                try{
                    const message = JSON.parse(e.message);
                    if(message.code === 401 || message.code === 403){
                        toast.add({severity: 'error', summary: 'Errore', detail: 'Non hai i permessi per visualizzare questo sondaggio', life: 5000});
                        router.push('/sondaggi');
                    }
                }catch(e2){
                    toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
                }
            }else
                toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
        }
    });
    
    /**
     * Funzione per aggiornare il sondaggio e i dati correlati
     * @param {Sondaggi.Sondaggio} newSondaggio l'istanza del sondaggio
    */
    function updateSondaggio(newSondaggio: Sondaggi.Sondaggio){
        sondaggio.value = newSondaggio;
        updateVoti(newSondaggio.voti);
    }
    /**
     * Funzione per aggiornare la tabella dei voti per quartiere
     * @param {Voti.Voto[]} voti il vettore di voti sul quale basare la tabella
     */
    function updateVoti(voti: Voti.Voto[]){
        if(sondaggio.value !== null)
            sondaggio.value.voti =voti.sort((a,b) => new Date(b.dataOra).getTime() - new Date(a.dataOra).getTime());
        // Calcolo età media
        etaMedia.value = voti.length > 0 ?Math.round(voti.reduce((acc, curr) => curr.eta ? acc + curr.eta: acc, 0) / voti.filter(v => v.eta).length) : null;
        // Imposto la referenza al risultato della funzione interna
        votiPerQuartiere.value = voti.reduce((acc: {quartiere: {self: string, nome: string}, numeroVoti: number}[], curr) => {
            // Verifico se per il voto che sto considerando esiste già una riga corrispondente
            const index = acc.findIndex(v => v.quartiere.self === curr.quartiere);
            if(index === -1)
                acc.push({quartiere: quartieri.value.find(q => q.self === curr.quartiere)!, numeroVoti: 1}); // Se non esiste la aggiungo con un voto
            else
                acc[index].numeroVoti++; // Se esiste incremento i voti
            return acc; // Restituisco l'accumulatore 
        }, []); // Se non ci sono voti => tabella vuota
    }
    /**
     * Funzione per rimuovere un voto
     * @param {Voti.Voto} voto il voto da rimuovere
     */ 
    async function removeVoto(voto: Voti.Voto){
        try{
            // Chiamo la funzione per rimuovere il voto
            await deleteVoto(voto);
            // Aggiorno il sondaggio
            updateVoti(await getVoti(param.id.toString()));
            // Notifico l'utente del successo
            toast.add({severity: 'success', summary: 'Successo', detail: 'Voto rimosso con successo', life: 3000});
        }catch(e){
            // Eseguo il catch di eventuali errori - in ogni caso notifico l'utente, se l'errore è conosciuto allora con il messaggio altrimenti errore generico
            if(e instanceof Error){
                toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
            }else
                toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
        }
    }
    /**
     * Handler per iniziare a votare
     */
    async function handlerStartVoting() {
        // Controllo che il quartiere sia selezionato - notifico in caso negativo
        if(!selezione.value.quartiere.value){
            toast.add({severity: 'error', summary: 'Errore', detail: 'Compilare tutti i campi', life: 5000});
            selezione.value.quartiere.invalid = true;
            return;
        }
        // Imposto la visualizzazione alla schermata di voto
        selezione.value.isVoting = 1;
    }
    /**
     * Funzione handler per cambiare il voto dalla schermata "1"
     * @param {number} vote il voto da selezionare
     */
    function handlerChangeVote(vote:number){
        document.querySelectorAll('.svg-image-big').forEach((item)=>{
            if(item.id !== `face-${vote}` || selezione.value.voto === vote)
                item.classList.remove('selected-face');
            else
                item.classList.add('selected-face')
        })
        selezione.value.voto = selezione.value.voto === vote ? '' : vote;
    }
    /**
     * Funzione per inviare il voto
     */
    async function handlerSubmitVoto(){
        // Controllo che il voto sia stato selezionato - notifico in caso negativo
        if(selezione.value.voto === ''){
            toast.add({severity: 'error', summary: 'Errore', detail: 'Selezionare un voto', life: 5000});
            return;
        }
        // Controllo che il sondaggio sia stato caricato correttamente - notifico in caso negativo
        if(!sondaggio.value){
            toast.add({severity: 'error', summary: 'Errore', detail: 'Il sondaggio non è stato caricato correttamente', life: 5000});
            setTimeout(() => {
                window.location.reload();
            }, 5000);
            return;
        }
        // Controllo che il quartiere sia selezionato - notifico in caso negativo
        if(!selezione.value.quartiere.value){
            toast.add({severity: 'error', summary: 'Errore', detail: 'Compilare tutti i campi', life: 5000});
            if(!selezione.value.quartiere.value){
                selezione.value.quartiere.invalid = true;
            }
            return;
        }
        // Imposto il caricamento a true
        loadingSend.value = true;
        try{
            // Creo l'oggetto da inviare al backend
            const newVoto: Voti.Add = {
                eta: selezione.value.eta.value === '' ? undefined : parseInt(selezione.value.eta.value),
                voto: selezione.value.voto,
                quartiere: selezione.value.quartiere.value.split('/').pop()!
            }
            // Chiamo la funzione per aggiungere il voto
            await addVoto(sondaggio.value.self.split('/').pop()!, newVoto);
            // Ignoro la location del quartiere

            // Imposto lo stato del voto a completato - schermata di ringraziamento (2) e resetto i campi
            selezione.value = {eta: {value: '', invalid:false},isVoting: 2,quartiere: {value: '', invalid:false},voto: ''};
            // Imposto il caricamento a false
            loadingSend.value = false;
            try{
                // Mentre è visualizzata la schemata 2 ricarico i voti, in modo da aggiornare i dati (tabella/media, ecc...)
                updateVoti(await getVoti(param.id.toString()));
            }catch (e){
                // Eseguo il catch di eventuali errori - in ogni caso notifico l'utente, se l'errore è conosciuto allora con il messaggio altrimenti errore generico
                if(e instanceof Error)
                    toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
                else
                    toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto nel caricamento del sondaggio', life: 5000});
            }
        }catch(e){
            // Eseguo il catch di eventuali errori - in ogni caso notifico l'utente, se l'errore è conosciuto allora con il messaggio altrimenti errore generico
            if(e instanceof Error)
                toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
            else
                toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto nell\'aggiunta del voto ', life: 5000});
        }finally{
            loadingSend.value = false;
        }
    }
    function handlerDelete(){
        confirm.require({
            header: 'Conferma eliminazione',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'pi pi-trash',
            rejectIcon: 'pi pi-times',
            acceptProps: {severity: 'danger', outlined: true},
            rejectProps: {severity: 'info', outlined: true},
            acceptLabel: 'Elimina',
            rejectLabel: 'Annulla',
            message: 'Sei sicuro di voler cancellare definitivamente il sondaggio?',
            accept: async () => {
                try{
                    await deleteSondaggio(param.id.toString());
                    toast.add({severity: 'success', summary: 'Successo', detail: 'Sondaggio eliminato con successo', life: 3000});
                    router.push('/sondaggi');
                }catch(e){
                    if(e instanceof Error)
                        toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
                    else
                        toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
                }
            },
            reject: () => {
                toast.add({severity: 'info', summary: 'Info', detail: 'Operazione annullata', life: 3000});
            },
        });
    }
    function handlerClose(){
        confirm.require({
            header: 'Conferma chiusura',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            acceptProps: {severity: 'success', outlined: true},
            rejectProps: {severity: 'info', outlined: true},
            acceptLabel: 'Chiudi',
            rejectLabel: 'Annulla',
            message: 'Sei sicuro di voler chiudere il sondaggio?',
            accept: async () => {
                try{
                    await modificaSondaggio(param.id.toString(), false);
                    toast.add({severity: 'success', summary: 'Successo', detail: 'Sondaggio chiuso con successo', life: 3000});
                    router.push('/sondaggi');
                }catch(e){
                    if(e instanceof Error)
                        toast.add({severity: 'error', summary: 'Errore', detail: e.message, life: 5000});
                    else
                        toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto', life: 5000});
                }
            },
            reject: () => {
                toast.add({severity: 'info', summary: 'Info', detail: 'Operazione annullata', life: 3000});
            }
        });
    }
</script>

<template>
    <div v-if="selezione.isVoting === 0" class="md:tw-grid gridTemplateSondaggio tw-w-full tw-h-full tw-gap-6">
        <Card class="md:tw-h-full Statistiche tw-my-4 md:tw-my-0" :pt="{'body': {'class': 'tw-flex-grow'},'content': {'class': 'tw-flex-grow'}}"> 
            <template #title>
                Statistiche Parziali
            </template>
            <template #content class="md:tw-h-full">
                <div class="tw-flex tw-flex-col tw-justify-between md:tw-h-full">
                    <div class="tw-flex tw-justify-between tw-my-3">
                        <span>Numero parziale voti:</span>
                        <span v-if="sondaggio">{{ sondaggio.voti.length }}</span>
                        <span v-else><Skeleton width="50px" /></span>
                    </div>
                    <div class="tw-flex tw-justify-between tw-my-3">
                        <span>Età media parziale:</span>
                        <span v-if="sondaggio">{{ etaMedia || 'N/A' }}</span>
                        <span v-else><Skeleton width="50px" /></span>
                    </div>
                    <div class="tw-my-3 tw-h-full tw-overflow-hidden tw-flex tw-flex-col tw-text-ellipsis tw-whitespace-nowrap">
                        <div>Voti per quartiere:</div>
                        <div v-if="sondaggio" style="min-height: 5rem; max-height: 50rem; height: calc(100% - 5rem);">
                            <DataTable :value="votiPerQuartiere" striped-rows scrollable scroll-height="flex" sort-field="numeroVoti" :sort-order="-1">
                                <Column field="quartiere.nome" header="Quartiere" />
                                <Column field="numeroVoti" header="Numero Voti" />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
        <Card class="md:tw-h-full AddVoto tw-my-4 md:tw-my-0" :pt="{'body': {'class': 'tw-h-full'},'content': {'class': 'tw-h-full'}}">
            <template #title>
                Aggiungi Voto
            </template> 
            <template #content>
                <div class="tw-flex tw-flex-col tw-justify-evenly tw-h-full">
                    <div class="tw-grid tw-p-4 tw-grid-cols-3 tw-gap-4">
                        <div class="tw-col-span-2 tw-flex tw-justify-center tw-items-center">
                            <FloatLabel variant="on" class="tw-w-full">
                                <Select v-model="selezione.quartiere.value" :options="quartieri" optionLabel="nome" optionValue="self" class="tw-w-full" :invalid="selezione.quartiere.invalid" @change="() => selezione.quartiere.invalid = false" />
                                <label for="quartiere">Quartiere</label>
                            </FloatLabel>
                        </div>
                        <div class="tw-w-full tw-p-2">
                            <FloatLabel variant="on" class="tw-w-full">
                                <Select v-model="selezione.eta.value" :options="ageRanges" optionLabel="range" optionValue="value" class="tw-w-full" />
                                <label for="eta">Età</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="tw-p-4">
                        <Button icon="pi pi-inbox" label="Vota" class="tw-w-full" @click="handlerStartVoting()"/>
                    </div>
                </div>
            </template>
        </Card>
        <Card class="md:tw-h-full VotiPrecedenti tw-my-4 md:tw-my-0" :pt="{'body': {'class': 'tw-flex-grow'},'content': {'class': 'tw-flex-grow'}}">
            <template #title>
                Voti Precedenti
            </template>
            <template #content>
                <div class="tw-h-full">
                    <VirtualScroller v-if="sondaggio&&sondaggio.voti.length>0" :items="sondaggio.voti" :itemSize="50" class="tw-h-full">
                        <template v-slot:item="{item}">
                            <div class="tw-bg-gray-700 tw-my-2 tw-w-full tw-text-center tw-text-white tw-rounded-xl tw-text-sm tw-flex tw-justify-between tw-align-center" style="height: 50px;">
                                <span class="tw-mx-2 tw-my-auto">
                                    #{{ item.self.split('/').pop()?.slice(-8) }} {{ new Date(item.dataOra).toLocaleString('it-IT', {day: "2-digit",month: "2-digit",hour: "2-digit",minute: "2-digit",}) }}
                                </span>
                                <Button variant="text" @click="()=>removeVoto(item)" icon="pi pi-trash" class="tw-ml-2 tw-text-white" />
                            </div>
                        </template>
                    </VirtualScroller>  
                    <div v-else-if="!sondaggio"><Skeleton height="2rem" v-for="i in 5" :key="i" class="tw-my-2"/></div>
                    <div v-else class="tw-text-center tw-text-gray-500 tw-mt-2">Nessun voto presente</div>
                </div>
            </template>
        </Card>
        <Card class="md:tw-h-full ImpostazioniSessione tw-my-4 md:tw-my-0" :pt="{'body': {'class': 'tw-flex-grow'},'content': {'class': 'tw-flex-grow'}}">
            <template #title>
                Impostazioni Sessione
            </template>
            <template #content>
                <div class="tw-flex tw-justify-evenly tw-items-center tw-flex-col tw-h-full">
                    <Button label="Esci dal sondaggio" icon="pi pi-sign-out" class="tw-w-full" @click="()=>router.push('/sondaggi')" severity="info"/>
                    <Button label="Chiudi e completa la sessione" icon="pi pi-check" class="tw-w-full" @click="handlerClose()" severity="success" />
                    <Button label="Cancella definitivamente" icon="pi pi-trash" class="tw-w-full" @click="handlerDelete()" severity="danger"/>
                </div>
            </template>
        </Card>
    </div>
    <div v-else-if="selezione.isVoting === 1" class="tw-w-full tw-h-full tw-flex tw-align-center tw-justify-center tw-flex-col">
        <div class="tw-my-4 tw-text-2xl">
            Seleziona il tuo voto:
        </div>
        <div class="tw-flex tw-justify-center tw-my-4">
            <div class="tw-h-min tw-mr-2">
                <div class="svg-image svg-image-big" id="face-1" v-html="voto1" @click="handlerChangeVote(1)"/>
                <p class="tw-text-center">Molto insoddisfatto</p>
            </div>
            <div class="tw-h-min tw-mx-2">
                <div class="svg-image svg-image-big" id="face-2" v-html="voto2" @click="handlerChangeVote(2)" />
                <p class="tw-text-center">Insoddisfatto</p>
            </div>
            <div class="tw-h-min tw-mx-2">
                <div class="svg-image svg-image-big" id="face-3" v-html="voto3" @click="handlerChangeVote(3)" />
                <p class="tw-text-center">Neutrale</p>
            </div>
            <div class="tw-h-min tw-mx-2">
                <div class="svg-image svg-image-big" id="face-4" v-html="voto4" @click="handlerChangeVote(4)" />
                <p class="tw-text-center">Soddisfatto</p>
            </div>
            <div class="tw-h-min tw-ml-2">
                <div class="svg-image svg-image-big" id="face-5" v-html="voto5" @click="handlerChangeVote(5)"/>
                <p class="tw-text-center">Molto soddisfatto</p>
            </div>
        </div>
        <div class="tw-col-span-5 tw-my-8">
            <Button icon="pi pi-inbox" label="Vota" class="tw-w-full" @click="()=>handlerSubmitVoto()" :disabled="selezione.voto===''" :loading="loadingSend"/>
        </div>
        <div class="tw-col-span-5 tw-mt-8 tw-flex tw-justify-end tw-align-end">
            <Button variant="text" label="Annulla" @click="()=>selezione.isVoting = 0"/>
        </div>
    </div>
    <div v-else-if="selezione.isVoting === 2" class="tw-w-full tw-h-full tw-grid tw-grid-cols-1 tw-justify-items-center gridPostVoto">
        <h1 class="tw-text-6xl tw-mb-8 tw-text-center tw-w-full">Grazie per aver votato!</h1>
        <p class="tw-content-end"> La tua preferenza è stata registrata, restituisci il dispositivo all'operatore</p>
        <p class="tw-justify-self-end"> <Button label="Chiudi" severity="danger" @click="()=>selezione.isVoting = 0" /></p>
    </div>
</template>

<style>
    .gridTemplateSondaggio {
        grid-template-columns: 38% 18% 18% 18%;
        grid-template-rows: 50% 50%;
        grid-template-areas: 
            "Statistiche AddVoto AddVoto AddVoto"
            "Statistiche VotiPrecedenti ImpostazioniSessione ImpostazioniSessione";
    }
    .Statistiche {
        grid-area: Statistiche;
    }
    .AddVoto {
        grid-area: AddVoto;
    }
    .VotiPrecedenti {
        grid-area: VotiPrecedenti;
    }
    .ImpostazioniSessione {
        grid-area: ImpostazioniSessione;
    }
    .svg-image-big > svg {
        width: 100%;
        height: 100%;
    }
    .selected-face#face-1 {
        color: #FF0000;
    }
    .selected-face#face-2 {
        color: #FFA500;
    }
    .selected-face#face-3{
        color: #adad00;
    }
    .selected-face#face-4{
        color: #5a8a00;
    }
    .selected-face#face-5{
        color: #00FF00;
    }
    .gridPostVoto {
        grid-template-rows: 50% 10% 40%;
    }
</style>