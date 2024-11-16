import {Schema, model} from 'mongoose';
import schemas from '../schemas';
import { Quartieri } from '../../../types';

const quartiereSchema = new Schema<Quartieri.DB>({
    _id : { type : Schema.Types.ObjectId, required : true },
    nome : { type : String, required : true },
    coordinate : { type : [[Number]], required : true },
    circoscrizione : {type : Schema.Types.ObjectId, ref : 'Circoscrizione', required : true},
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