import {Schema, model} from 'mongoose';
import user from './User';
import { Sessione } from '../../types';

const sessioneSchema = new Schema<Sessione>({
    token : { type : Number, required : true },
    user : { type : user, required : true }
});

const Sessione = model('Sessione', sessioneSchema);

export default Sessione;