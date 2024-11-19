import Minimal from './Minimal';
import Dati from '../Dati';
import {Types} from "mongoose";

type DB = Minimal & Dati.DatiBaseDB &{
    _id: Types.ObjectId,
    servizi: Dati.ServiziGenerali,
    sicurezza: Dati.Sicurezza
}

export default DB;