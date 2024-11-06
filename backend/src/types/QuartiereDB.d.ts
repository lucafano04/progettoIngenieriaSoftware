import DatiBase from "./DatiBase";
import QuartiereBaseBase from "./QuartiereBaseBase";
import ServiziGenerali from "./ServiziGenerali";
import Sicurezza from "./Sicurezza";

type QuartiereDB = DatiBase & QuartiereBaseBase & {
    circoscrizione: Number,
    servizi : ServiziGenerali,
    sicurezza : Sicurezza
};

export default QuartiereDB;