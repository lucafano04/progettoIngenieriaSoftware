import {Schema, model} from 'mongoose';
import schemas from '../schemas';
import { Circoscrizioni } from '../../../types';

const circoscrizioneSchema = new Schema<Circoscrizioni.DB>({
    nome : { type : String, required : true },
    coordinate : { type : [[Number]], required : true },
    // soddisfazioneMedia : { type : Number, required : true }, // Questo campo deve essere calcolato tramite i voti dei sondaggi
    popolazione : { type : Number, required : true },
    superficie : { type : Number, required : true },
    serviziTotali : { type : Number, required : true },
    interventiPolizia : { type : Number, required : true },
    etaMedia : { type : Number, required : true },
    servizi : { type : schemas.serviziGenerali, required : true },
    sicurezza : { type : schemas.sicurezza, required : true }
});

const Circoscrizione = model('Circoscrizione', circoscrizioneSchema);

export default Circoscrizione;