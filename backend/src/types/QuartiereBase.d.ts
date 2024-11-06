import circoscrizioneBase from "./CircoscrizioneBase";

type QuartiereBase = {
    _id : Number,
    nome : String,
    coordinate : [[Number]],
    circoscrizione : circoscrizioneBase,
    soddisfazioneMedia : Number
};

export default QuartiereBase;