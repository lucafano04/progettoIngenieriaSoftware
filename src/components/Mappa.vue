<script lang="ts" setup>
    import "leaflet/dist/leaflet.css";
    import { LMap, LPolygon, LTileLayer, LControlZoom, LControl } from "@vue-leaflet/vue-leaflet";
    import { nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
    import { Circoscrizioni, Quartieri } from "../../types";
    import { getQuartieri } from "../utils/quartieri";
    import { getColorFromSoddisfazione } from "../utils/misc";
    import { useToast, Button, Skeleton } from "primevue";
    import { getCircoscrizioni } from "../utils/circoscrizioni";

    const quartieri = ref<Quartieri.Minimal[] | Circoscrizioni.Minimal[]>([]);
    const mapProp = ref({center: [46.06736507521368, 11.12139794405234], zoom: 12});
    const map = useTemplateRef("map");
    const toast = useToast();

    const props = defineProps({
        quartCirc: { type: Boolean, required: true },
        zonaSel: { type: String, required: true }
    });
    const emit = defineEmits(["setZonaSel","openSettings"]);

    onMounted(async () => {
        changedSel(props.quartCirc);
    });
    // Listen to changes of the prop quartCirc
    watch(() => props.quartCirc, (newVal) => {
        changedSel(newVal);
    });

    async function changedSel(newVal: boolean) {
        if (newVal) {
            try {
                quartieri.value = [];
                quartieri.value = await getCircoscrizioni(false);
            } catch (e: any) {
                if (e instanceof Error)
                    toast.add({ severity: 'error', summary: 'Errore', detail: e.message });
                else
                    toast.add({ severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto' });
            }
        } else {
            try {
                quartieri.value = [];
                quartieri.value = await getQuartieri(false);
            } catch (e: any) {
                if (e instanceof Error)
                    toast.add({ severity: 'error', summary: 'Errore', detail: e.message });
                else
                    toast.add({ severity: 'error', summary: 'Errore', detail: 'Errore sconosciuto' });
            }
        }
    }

    function handlerZona(quartiere: Quartieri.Minimal | Circoscrizioni.Minimal) {
        if(quartiere.self===props.zonaSel){
            mapProp.value.center = [46.06736507521368, 11.12139794405234];
            setTimeout(() => {
                mapProp.value.zoom = 12;
            }, 400);
            emit("setZonaSel", "");
            return;
        }
        emit("setZonaSel", quartiere.self);
        setTimeout(() => {
            // Calculate the zoom level based on the shape of the polygon so that it fits the screen
            const bounds = quartiere.coordinate.reduce((acc, c) => [Math.min(acc[0], c[1]), Math.min(acc[1], c[0]), Math.max(acc[2], c[1]), Math.max(acc[3], c[0])], [Infinity, Infinity, -Infinity, -Infinity]);
            const diff = [bounds[2] - bounds[0], bounds[3] - bounds[1]];
            const zoomX = Math.log2(360 / diff[0]);
            const zoomY = Math.log2(180 / diff[1]);
            // Calculate the center of the polygon 
            const centerC = quartiere.coordinate.reduce((acc, c) => [acc[0] + c[1], acc[1] + c[0]], [0, 0]).map(c => c / quartiere.coordinate.length);
            if (map.value === null) return; 
            mapProp.value.center = centerC;
            // Use nextTick to ensure the DOM updates properly 
            nextTick(() => {
                setTimeout(() => {
                    mapProp.value.zoom = Math.ceil(Math.min(zoomX, zoomY));
                }, 500);
            });
        }, 400);
    }
</script>
<template>
    <div class="tw-rounded" style="height: max(500px, 85vh)">
        <LMap class="tw-rounded-lg" ref="map" :zoom="mapProp.zoom" :center="mapProp.center" style="height: 100%; width: 100%" :use-global-leaflet="false" :options="{zoomControl: false}" v-if="quartieri.length > 0">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LControl position="topright" v-if="zonaSel === ''">
                <Button icon="pi pi-cog" severity="contrast" @click="emit('openSettings')" />
            </LControl>
            <LControlZoom position="bottomright" />
            <span v-for="quartiere in quartieri">
                <LPolygon 
                    :key="quartiere.self" 
                    :lat-lngs="quartiere.coordinate.map(c => [c[1], c[0]])" 
                    :color="getColorFromSoddisfazione(quartiere.soddisfazioneMedia,zonaSel!==quartiere.self&&zonaSel!=='')" :fill-opacity="0.3" :name="quartiere.nome.toString()" :interactive="true"
                    @click="handlerZona(quartiere)"
                    />
                    <!-- <LMarker
                        :key="quartiere.self"
                        :lat-lng="quartiere.coordinate.reduce((acc, c) => [acc[0] + c[1], acc[1] + c[0]], [0, 0]).map(c => c / quartiere.coordinate.length)"
                        :interactive="true"
                        @click="handlerZona(quartiere)"
                    />  -->
            </span>
            <span v-if="zonaSel!=='' && quartieri.find(q => q.self === zonaSel)">
                <LPolygon 
                    :key="zonaSel" 
                    :lat-lngs="quartieri.find(q => q.self === zonaSel)?.coordinate.map(c => [c[1], c[0]]) || []" 
                    :color="getColorFromSoddisfazione(quartieri.find(q => q.self === zonaSel)?.soddisfazioneMedia || 0)" :fill-opacity="0.3" :name="quartieri.find(q => q.self === zonaSel)?.nome.toString()" :interactive="true"
                    @click="handlerZona(quartieri.find(q => q.self === zonaSel) as Quartieri.Minimal)"
                    />
            </span>
        </LMap>
        <Skeleton v-else width="100%" height="max(500px, 85vh)" />
    </div>
</template>

<style></style>
