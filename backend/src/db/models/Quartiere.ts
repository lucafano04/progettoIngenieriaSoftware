import {Schema, model} from 'mongoose';
import schemas from '../schemas';
import circoscrizioneSchema from './Circoscrizione';
import { QuartiereDB } from '../../types';

const quartiereSchema = new Schema<QuartiereDB>({
    _id : { type : Schema.Types.ObjectId, required : true },
    nome : { type : String, required : true },
    coordinate : { type : [[Number]], required : true },
    circoscrizione : {type : Schema.Types.ObjectId, ref : 'Circoscrizione', required : true},
    //soddisfazioneMedia : { type : Number, required : true },
    popolazione : { type : Number, required : true },
    superficie : { type : Number, required : true },
    serviziTotali : { type : Number, required : true },
    interventiPolizia : { type : Number, required : true },
    etaMedia : { type : Number, required : true },
    servizi : { type : schemas.serviziGenerali, required : true },
    sicurezza : { type : schemas.sicurezza, required : true }
});

const Quartiere = model('Quartiere', quartiereSchema);

export default Quartiere;