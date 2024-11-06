import {Schema, model} from 'mongoose';
import { VotoDB } from '../../types';

const votoSchema = new Schema<VotoDB>({
    _id : { type : Number, required : true },
    eta : { type : Number, required : true },
    voto : { type : Number, required : true },
    quartiere : {type : Number, required : true },
    dataOra : { type : Date, required : true },
    sondaggio : { type : Number, ref : "Sondaggio", removeuired : true }
});

const Voto = model('Voto', votoSchema);

export default Voto;