import Dati from "../Dati";
import Minimal from "./Minimal";

type Circoscrizione = Minimal & Dati.DatiBase &{
    servizi: Dati.ServiziGenerali,
    sicurezza: Dati.Sicurezza
}

export default Circoscrizione;