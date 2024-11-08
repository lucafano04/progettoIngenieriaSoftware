import circoscrizioneBase from "./CircoscrizioneBase";
import QuartiereBaseBase from "./QuartiereBaseBase";

type QuartiereBase = QuartiereBaseBase & {
    circoscrizione : circoscrizioneBase,
    soddisfazioneMedia : number
};

export default QuartiereBase;