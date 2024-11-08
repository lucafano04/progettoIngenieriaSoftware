import {Types} from "mongoose";

type User = {
    _id : Types.ObjectId,
    email : String,
    nome : String,
    cognome : String,
    ruolo : "Amministratore" | "Analista" | "Circoscrizione" | "Sondaggista",
    imageUrl : String
};

export default User;