import circoscrizioneBase from "./CircoscrizioneBase";
import QuartiereBaseBase from "./QuartiereBaseBase";

type QuartiereBase = QuartiereBaseBase & {
    self: string,
    circoscrizione: circoscrizioneBase,
    soddisfazioneMedia: number
};

export default QuartiereBase;