import {Schema, model} from 'mongoose';
import user from './User';
import { Sondaggi } from '../../../types';

const sondaggioSchema = new Schema<Sondaggi.DB>({
    _id : { type : Schema.Types.ObjectId, required : true },
    titolo : { type : String, required : true },
    dataInizio : { type : Date, required : true },
    isAperto : {type : Boolean, required : true },
    statoApprovazione : { type : String, enum : ["Approvato", "In attesa", "Rifiutato"], required : true },
    sondaggista : { type : Schema.Types.ObjectId, ref: 'User', required : true }
});

const Sondaggio = model('Sondaggio', sondaggioSchema);

export default Sondaggio;