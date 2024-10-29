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

const coordinate = new Schema([[Number]]);

const soddisfazione = new Schema(Number);

const circoscrizioneBase = new Schema({
    id : Number,
    nome : String,
    coordinate : coordinate,
    soddisfazioneMedia : soddisfazione
});

const circoscrizione = new Schema({
    id : Number,
    nome : String,
    coordinate : coordinate,
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
    coordinate : coordinate,
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
    coordinate,
    soddisfazione,
    circoscrizioneBase,
    circoscrizione,
    quartiere
};

export default schemas;
export {
    serviziGenerali,
    sicurezza,
    coordinate,
    soddisfazione,
    circoscrizioneBase,
    circoscrizione,
    quartiere
};