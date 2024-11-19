import Dati from "../Dati";
import Base from "./Base";
import {Types} from "mongoose";

type DB = Dati.DatiBaseDB & Base & {
    _id: Types.ObjectId,
    circoscrizione: Types.ObjectId,
    servizi: Dati.ServiziGenerali,
    sicurezza: Dati.Sicurezza
};

export default DB;