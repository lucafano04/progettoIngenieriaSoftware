<script lang="ts" setup>
    import "leaflet/dist/leaflet.css";
    import { LMap, LPolygon, LTileLayer, LControlZoom } from "@vue-leaflet/vue-leaflet";
    import { nextTick, onMounted, ref, useTemplateRef } from "vue";
    import { Circoscrizioni, Quartieri } from "../../types";
    import { getQuartieri } from "../utils/quartieri";
    import { getColorFromSoddisfazione } from "../utils/misc";
    import { useToast } from "primevue";

    const quartieri = ref<Quartieri.Minimal[] | Circoscrizioni.Minimal[]>([]);
    const mapProp = ref({center: [46.06736507521368, 11.12139794405234], zoom: 11});
    const map = useTemplateRef("map");
    const toast = useToast();

    const props = defineProps({
        quartCirc: { type: Boolean, required: true },
        zonaSel: { type: String, required: true }
    });
    const emit = defineEmits(["setZonaSel"]);

    onMounted(async () => {
        if(props.quartCirc){

        }else{
            try{
                quartieri.value = await getQuartieri(false);
            }catch(e: any){
                if(e instanceof Error)
                    toast.add({severity: 'error', summary: 'Errore', detail: e.message});
                else
                    toast.add({severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto'});
            }
        }
    });
    function handlerZona(quartiere: Quartieri.Minimal | Circoscrizioni.Minimal) { 
        // Calculate the zoom level based on the shape of the polygon so that it fits the screen
        const bounds = quartiere.coordinate.reduce((acc, c) => [Math.min(acc[0], c[1]), Math.min(acc[1], c[0]), Math.max(acc[2], c[1]), Math.max(acc[3], c[0])], [Infinity, Infinity, -Infinity, -Infinity]);
        const diff = [bounds[2] - bounds[0], bounds[3] - bounds[1]];
        const zoomX = Math.log2(360 / diff[0]);
        const zoomY = Math.log2(180 / diff[1]);
        // Calculate the center of the polygon 
        const centerC = quartiere.coordinate.reduce((acc, c) => [acc[0] + c[1], acc[1] + c[0]], [0, 0]).map(c => c / quartiere.coordinate.length);
        if (map.value === null) return; 
            mapProp.value.zoom = Math.ceil(Math.min(zoomX, zoomY));
        // Use nextTick to ensure the DOM updates properly 
        nextTick(() => {
            mapProp.value.center = centerC;
            setTimeout(() => {
                mapProp.value.center = centerC;
            }, 500);
        });
        emit("setZonaSel", quartiere.self);
    }
</script>
<template>
    <div style="height:600px; width:100%" class="tw-rounded">
        <LMap class="tw-rounded-lg" ref="map" v-model:zoom="mapProp.zoom" v-model:center="mapProp.center" style="height: 100%; width: 100%" :use-global-leaflet="false"
            :options="{zoomControl: false, attributionControl: false}"
        >
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LControlZoom position="bottomright" />
            <span v-for="quartiere in quartieri">
                <LPolygon 
                    :key="quartiere.self" 
                    :lat-lngs="quartiere.coordinate.map(c => [c[1], c[0]])" 
                    :color="getColorFromSoddisfazione(quartiere.soddisfazioneMedia,zonaSel!==quartiere.self&&zonaSel!=='')" :fill-opacity="0.5" :name="quartiere.nome.toString()" :interactive="true"
                    @click="handlerZona(quartiere)"
                    />
            </span>
            <span v-if="zonaSel!==''">
                <LPolygon 
                    :key="zonaSel" 
                    :lat-lngs="quartieri.find(q => q.self === zonaSel)?.coordinate.map(c => [c[1], c[0]]) || []" 
                    :color="getColorFromSoddisfazione(quartieri.find(q => q.self === zonaSel)?.soddisfazioneMedia || 0)" :fill-opacity="0.5" :name="quartieri.find(q => q.self === zonaSel)?.nome.toString()" :interactive="true"
                    />
            </span>
        </LMap>
    </div>
</template>

<style></style>
