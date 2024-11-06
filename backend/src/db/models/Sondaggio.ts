import {Schema, model} from 'mongoose';
import user from './User';
import { SondaggioDB } from '../../types';

const sondaggioSchema = new Schema<SondaggioDB>({
    _id : { type : Number, required : true },
    titolo : { type : String, required : true },
    dataInizio : { type : Date, required : true },
    isAperto : {type : Boolean, required : true },
    statoApprovazione : { type : String, emun : ["Approvato", "In attesa", "Rifiutato"], required : true },
    sondaggista : { type : user, required : true }
});

const Sondaggio = model('Sondaggio', sondaggioSchema);

export default Sondaggio;