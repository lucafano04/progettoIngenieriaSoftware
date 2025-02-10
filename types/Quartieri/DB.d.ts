import Base from "./Base";
import Dati from "../Dati";
import Coordinate from "../Coordinate";
import {Types} from "mongoose";

type DB = Dati.DatiBaseDB & Base & Coordinate & {
    _id: Types.ObjectId,
    circoscrizione: Types.ObjectId,
    servizi: Dati.ServiziGenerali,
    sicurezza: Dati.Sicurezza
};

export default DB;