import Minimal from "./Minimal";
import Dati from "../Dati";

type Quartiere = Dati.DatiBase & Minimal & {
    servizi: Dati.ServiziGenerali,
    sicurezza: Dati.Sicurezza
};

export default Quartiere;