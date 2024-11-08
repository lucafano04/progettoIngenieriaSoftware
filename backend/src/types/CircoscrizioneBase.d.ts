import {Types} from "mongoose";

type CircoscrizioneBase = {
    _id : Types.ObjectId,
    nome : String,
    coordinate : [[number]],
    soddisfazioneMedia : number,
}

export default CircoscrizioneBase;