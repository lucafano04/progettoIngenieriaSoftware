import { Schema } from 'mongoose';

const serviziGenerali = new Schema({
    areeVerdi : Number,
    scuole : Number,
    serviziRistorazione : Number,
    localiNotturni : Number
});

const sicurezza = new Schema({
    numeroInterventi : Number,
    incidenti : Number,
    tassoCriminalita : Number
});


const soddisfazione = new Schema(Number);

const circoscrizioneBase = new Schema({
    id : Number,
    nome : String,
    coordinate : [[Number]],
    soddisfazioneMedia : soddisfazione
});

const circoscrizione = new Schema({
    id : Number,
    nome : String,
    coordinate : [[Number]],
    soddisfazioneMedia : soddisfazione,
    popolazione : Number,
    superficie : Number,
    serviziTotali : Number,
    interventiPolizia : Number,
    etaMedia : Number,
    servizi : serviziGenerali,
    sicurezza : sicurezza
});

const quartiere = new Schema({
    id : Number,
    nome : String,
    coordinate : [[Number]],
    circoscrizione : circoscrizioneBase,
    soddisfazioneMedia : soddisfazione,
    popolazione : Number,
    superficie : Number,
    serviziTotali : Number,
    interventiPolizia : Number,
    etaMedia : Number,
    servizi : serviziGenerali,
    sicurezza : sicurezza
});

const schemas = {
    serviziGenerali,
    sicurezza,
    soddisfazione,
    circoscrizioneBase,
    circoscrizione,
    quartiere
};

export default schemas;
export {
    serviziGenerali,
    sicurezza,
    soddisfazione,
    circoscrizioneBase,
    circoscrizione,
    quartiere
};