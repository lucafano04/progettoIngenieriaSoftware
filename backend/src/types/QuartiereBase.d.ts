import circoscrizioneBase from "./CircoscrizioneBase";
import QuartiereBaseBase from "./QuartiereBaseBase";

type QuartiereBase = QuartiereBaseBase & {
    circoscrizione : circoscrizioneBase,
};

export default QuartiereBase;