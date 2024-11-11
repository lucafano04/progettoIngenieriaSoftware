import { Schema, Types } from 'mongoose';
import { CircoscrizioneBase, ServiziGenerali, Sicurezza } from '../types';


// Definizione degli schemi senza modello
const serviziGeneraliSchema = new Schema<ServiziGenerali>({
    areeVerdi : { type : Number, required : true },
    scuole : { type : Number, required : true },
    serviziRistorazione : { type : Number, required : true },
});
const sicurezzaSchema = new Schema<Sicurezza>({
    numeroInterventi : { type : Number, required : true },
    incidenti : { type : Number, required : true },
    tassoCriminalita : { type : Number, required : true }
});
const circoscrizioneBaseSchema = new Schema<CircoscrizioneBase>({
    nome : { type : String, required : true },
    coordinate : { type : [[Number]], required : true },
    soddisfazioneMedia : { type : Number, required : true }
});


const schemas = {
    serviziGenerali: serviziGeneraliSchema,
    sicurezza: sicurezzaSchema,
    circoscrizioneBase: circoscrizioneBaseSchema,
};

export default schemas;
export {
    serviziGeneraliSchema as serviziGenerali,
    sicurezzaSchema as sicurezza,
    circoscrizioneBaseSchema as circoscrizioneBase
};