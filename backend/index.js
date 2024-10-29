const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Lukil:Porca3oia..@progettocomune.gu45j.mongodb.net/?retryWrites=true&w=majority&appName=progettoComune');

const serviziGenerali = new Schema({
    areeVerdi : number,
    scuole : number,
    serviziRistorazione : number,
    localiNotturni : number
});

const sicurezza = new Schema({
    numeroInterventi : number,
    incidenti : number,
    tassoCriminalita : number
});

const coordinate = new Schema([[number]]);

const soddisfazione = new Schema(number);

const circoscrizioneBase = new Schema({
    id : number,
    nome : string,
    coordinate : coordinate,
    soddisfazioneMedia : soddisfazione
});

const circoscrizione = new Schema({
    id : number,
    nome : string,
    coordinate : coordinate,
    soddisfazioneMedia : soddisfazione,
    popolazione : number,
    superficie : number,
    serviziTotali : number,
    interventiPolizia : number,
    etaMedia : number,
    servizi : serviziGenerali,
    sicurezza : sicurezza
});

const quartiere = new Schema({
    id : number,
    nome : string,
    coordinate : coordinate,
    circoscrizione : circoscrizioneBase,
    soddisfazioneMedia : soddisfazione,
    popolazione : number,
    superficie : number,
    serviziTotali : number,
    interventiPolizia : number,
    etaMedia : number,
    servizi : serviziGenerali,
    sicurezza : sicurezza
});