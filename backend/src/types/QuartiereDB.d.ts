import DatiBaseDB from "./DatiBaseDB";
import QuartiereBaseBase from "./QuartiereBaseBase";
import ServiziGenerali from "./ServiziGenerali";
import Sicurezza from "./Sicurezza";
import {Types} from "mongoose";

type QuartiereDB = DatiBaseDB & QuartiereBaseBase & {
    _id: Types.ObjectId,
    circoscrizione: Types.ObjectId,
    servizi: ServiziGenerali,
    sicurezza: Sicurezza
};

export default QuartiereDB;