<script setup lang="ts">
    import { Quartieri } from '../types';
    import { ref, onMounted } from 'vue';

    const text = ref(''); // Ref per mantenere la reattività del dato

    onMounted(async () => {
        try {
            const req = await fetch('/api/v1/quartieri');
            const data = await req.json();
            text.value = data.map((q: Quartieri.Minimal) => q.nome).join(', ');
        } catch (error) {
            console.error('Errore durante la fetch:', error);
        }
    });
</script>

<template>
    <h1>TEST</h1>
    <p>{{ text }}</p>
</template>

<style scoped>
    h1 {
        color: red;
    }
    p {
        color: blue;
    }
</style>
