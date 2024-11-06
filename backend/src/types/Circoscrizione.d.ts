import ServiziGenerali from './ServiziGenerali';
import Sicurezza from './Sicurezza';
import CircoscrizioneBase from './CircoscrizioneBase';
import DatiBase from './DatiBase';

type Circoscrizione = CircoscrizioneBase & DatiBase &{
    servizi : ServiziGenerali,
    sicurezza : Sicurezza
}

export default Circoscrizione;