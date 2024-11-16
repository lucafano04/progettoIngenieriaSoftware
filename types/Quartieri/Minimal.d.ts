import Base from "./Base";
import Circoscrizioni from "../Circoscrizioni";

type Minimal = Base & {
    self: string,
    circoscrizione: Circoscrizioni.Minimal,
    soddisfazioneMedia: number
};

export default Minimal;