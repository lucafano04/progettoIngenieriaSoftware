import ServiziGenerali from './ServiziGenerali';
import Sicurezza from './Sicurezza';
import CircoscrizioneBase from './CircoscrizioneBase';
import DatiBaseDB from './DatiBaseDB';

type CircoscrizioneDB = CircoscrizioneBase & DatiBaseDB &{
    servizi : ServiziGenerali,
    sicurezza : Sicurezza
}

export default CircoscrizioneDB;