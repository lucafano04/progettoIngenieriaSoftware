import {Schema, model} from 'mongoose';
import { User } from '../../types';

const userSchema = new Schema<User>({
    _id : { type : Schema.Types.ObjectId, required : true },
    email : { type : String, required : true },
    nome : { type : String, required : true },
    cognome : { type : String, required : true },
    ruolo : { type : String, enum : ["Amministratore", "Analista", "Circoscrizione", "Sondaggista"], required : true },
    imageUrl : { type : String, required : true }
});

const User = model('User', userSchema);

export default User;