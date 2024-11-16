import { Schema, Types } from 'mongoose';
import { Dati, Circoscrizioni } from '../../types';


// Definizione degli schemi senza modello
const serviziGeneraliSchema = new Schema<Dati.ServiziGenerali>({
    areeVerdi : { type : Number, required : true },
    scuole : { type : Number, required : true },
    serviziRistorazione : { type : Number, required : true },
});
const sicurezzaSchema = new Schema<Dati.Sicurezza>({
    numeroInterventi : { type : Number, required : true },
    incidenti : { type : Number, required : true },
    tassoCriminalita : { type : Number, required : true }
});


const schemas = {
    serviziGenerali: serviziGeneraliSchema,
    sicurezza: sicurezzaSchema,
};

export default schemas;
export {
    serviziGeneraliSchema as serviziGenerali,
    sicurezzaSchema as sicurezza,
};