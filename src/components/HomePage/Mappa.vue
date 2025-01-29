<script lang="ts" setup>
    import "leaflet/dist/leaflet.css";
    import { LMap, LPolygon, LTileLayer, LControlZoom, LControl } from "@vue-leaflet/vue-leaflet";
    import { nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
    import { Circoscrizioni, Quartieri } from "../../../types";
    import { getColorFromSoddisfazione } from "../../utils/misc";
    import { Button, Skeleton } from "primevue";

    const mapProp = ref({center: [46.06736507521368, 11.12139794405234], zoom: 12});
    const map = useTemplateRef("map");

    const props = defineProps({
        quartCirc: { type: Boolean, required: true },
        zonaSel: { type: String, required: true },
        quartieri: { type: Array as ()=> Quartieri.Minimal[], required: true },
        circoscrizioni: { type: Array as ()=> Circoscrizioni.Minimal[], required: true }
    });
    let { quartieri, circoscrizioni } = props;
    const tipoSel = ref<Quartieri.Minimal[] | Circoscrizioni.Minimal[]>([]);
    const emit = defineEmits(["setZonaSel","openSettings"]);

    onMounted(async () => {
        changedSel(props.quartCirc);
    });
    
    // Listen to changes of the prop quartCirc
    watch(() => props.quartCirc, changedSel);
    watch(() => props.quartieri, (newVal) => {
        quartieri = newVal;
        changedSel(props.quartCirc);
    });
    watch(() => props.circoscrizioni, (newVal) => {
        circoscrizioni = newVal;
        changedSel(props.quartCirc);
    });

    function changedSel(newVal: boolean) {
        if (newVal) {
            tipoSel.value = [];
            tipoSel.value = circoscrizioni;
        } else {
            tipoSel.value = [];
            tipoSel.value = quartieri;
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
            const bounds = quartiere.coordinate.reduce((acc: number[], c: number[]) => [Math.min(acc[0], c[1]), Math.min(acc[1], c[0]), Math.max(acc[2], c[1]), Math.max(acc[3], c[0])], [Infinity, Infinity, -Infinity, -Infinity]);
            const diff = [bounds[2] - bounds[0], bounds[3] - bounds[1]];
            const zoomX = Math.log2(360 / diff[0]);
            const zoomY = Math.log2(180 / diff[1]);
            // Calculate the center of the polygon 
            const centerC = quartiere.coordinate.reduce((acc: number[], c: number[]) => [acc[0] + c[1], acc[1] + c[0]], [0, 0]).map((c: number) => c / quartiere.coordinate.length);
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
        <LMap class="tw-rounded-lg" ref="map" :zoom="mapProp.zoom" :center="mapProp.center" style="height: 100%; width: 100%" :use-global-leaflet="false" :options="{zoomControl: false}" v-if="tipoSel.length > 0">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LControl position="topright" v-if="zonaSel === ''">
                <Button icon="pi pi-cog" severity="contrast" @click="emit('openSettings')" />
            </LControl>
            <LControlZoom position="bottomright" />
            <span v-for="quartiere in tipoSel">
                <LPolygon 
                    :key="quartiere.self" 
                    :lat-lngs="quartiere.coordinate.map((c: number[]) => [c[1], c[0]])" 
                    :fillColor="getColorFromSoddisfazione(quartiere.soddisfazioneMedia,zonaSel!==quartiere.self&&zonaSel!=='')" :fill-opacity="0.3" :name="quartiere.nome.toString()" :interactive="true"
                    @click="handlerZona(quartiere)"
                    :color="zonaSel!==quartiere.self&&zonaSel!==''?'#A0A0A0':'#000000'"
                    />
            </span>
            <span v-if="zonaSel!=='' && tipoSel.find((q: Quartieri.Minimal | Circoscrizioni.Minimal) => q.self === zonaSel)">
                <LPolygon 
                    :key="zonaSel" 
                    :lat-lngs="tipoSel.find((q: Quartieri.Minimal | Circoscrizioni.Minimal) => q.self === zonaSel)?.coordinate.map((c: number[]) => [c[1], c[0]]) || []" 
                    :color="getColorFromSoddisfazione(tipoSel.find((q: Quartieri.Minimal | Circoscrizioni.Minimal) => q.self === zonaSel)?.soddisfazioneMedia || 0)" :fill-opacity="0.3" :name="tipoSel.find((q: Quartieri.Minimal | Circoscrizioni.Minimal) => q.self === zonaSel)?.nome.toString()" :interactive="true"
                    @click="handlerZona(tipoSel.find((q: Quartieri.Minimal | Circoscrizioni.Minimal) => q.self === zonaSel))"
                    />
            </span>
        </LMap>
        <Skeleton v-else width="100%" height="max(500px, 85vh)" />
    </div>
</template>

<style></style>
