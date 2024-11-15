import {Types} from "mongoose";

type CircoscrizioneBase = {
    self: string,
    nome: String,
    coordinate: [[number]],
    soddisfazioneMedia: number,
}

export default CircoscrizioneBase;