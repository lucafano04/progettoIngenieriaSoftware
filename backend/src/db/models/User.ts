import {Schema, model} from 'mongoose';
import { UserDB } from '../../types';

const userSchema = new Schema<UserDB>({
    _id : { type : Schema.Types.ObjectId, required : true },
    email : { type : String, required : true },
    nome : { type : String, required : true },
    cognome : { type : String, required : true },
    ruolo : { type : String, enum : ["Amministratore", "Analista", "Circoscrizione", "Sondaggista"], required : true },
    imageUrl : { type : String, required : true },
    password : { type : String, required : true },
});

const User = model('User', userSchema);

export default User;