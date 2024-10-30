import {Schema, model} from 'mongoose';
import schemas from '../schemas';
import { Circoscrizione, Sicurezza } from '../../types';

const circoscrizioneSchema = new Schema<Circoscrizione>({
    __id : { type : Schema.Types.ObjectId, required : true },
    nome : { type : String, required : true },
    coordinate : { type : [[Number]], required : true },
    soddisfazioneMedia : { type : Number, required : true },
    popolazione : { type : Number, required : true },
    superficie : { type : Number, required : true },
    serviziTotali : { type : Number, required : true },
    interventiPolizia : { type : Number, required : true },
    etaMedia : { type : Number, required : true },
    servizi : { type : schemas.serviziGenerali, required : true },
    sicurezza : { type : schemas.sicurezza, required : true }
});

const circoscrizioni = model('Circoscrizione', circoscrizioneSchema);

export default circoscrizioni;