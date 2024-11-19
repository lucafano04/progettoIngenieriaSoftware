import {Schema, model} from 'mongoose';
import { Voti } from '../../../types';

const votoSchema = new Schema<Voti.DB>({
    eta : { type : Number, required : true },
    voto : { type : Number, required : true },
    quartiere : {type : Schema.Types.ObjectId, required : true },
    dataOra : { type : Date, required : true },
    sondaggio : { type : Schema.Types.ObjectId, ref : "Sondaggio", required : true }
});

const Voto = model('Voto', votoSchema);

export default Voto;