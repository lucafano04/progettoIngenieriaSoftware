import circoscrizioneBase from "./CircoscrizioneBase";

type QuartiereBase = {
    id : Number,
    nome : String,
    coordinate : [[Number]],
    circoscrizione : circoscrizioneBase,
    soddisfazioneMedia : Number
};

export default QuartiereBase;