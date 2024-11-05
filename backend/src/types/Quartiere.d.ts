import circoscrizioneBase from "./CircoscrizioneBase";
import serviziGenerali from "./ServiziGenerali";
import sicurezza from "./Sicurezza";

type Quartiere = {
    _id : Number,
    nome : String,
    coordinate : [[Number]],
    circoscrizione : circoscrizioneBase,
    soddisfazioneMedia : Number,
    popolazione : Number,
    superficie : Number,
    serviziTotali : Number,
    interventiPolizia : Number,
    etaMedia : Number,
    servizi : serviziGenerali,
    sicurezza : sicurezza
};

export default Quartiere;