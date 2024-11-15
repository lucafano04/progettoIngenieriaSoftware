import serviziGenerali from "./ServiziGenerali";
import sicurezza from "./Sicurezza";
import QuartiereBase from "./QuartiereBase";
import DatiBase from "./DatiBase";

type Quartiere = DatiBase & QuartiereBase & {
    servizi: serviziGenerali,
    sicurezza: sicurezza
};

export default Quartiere;