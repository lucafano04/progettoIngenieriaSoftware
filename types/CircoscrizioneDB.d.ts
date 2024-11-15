import ServiziGenerali from './ServiziGenerali';
import Sicurezza from './Sicurezza';
import CircoscrizioneBase from './CircoscrizioneBase';
import DatiBaseDB from './DatiBaseDB';
import {Types} from "mongoose";

type CircoscrizioneDB = CircoscrizioneBase & DatiBaseDB &{
    _id: Types.ObjectId,
    servizi: ServiziGenerali,
    sicurezza: Sicurezza
}

export default CircoscrizioneDB;