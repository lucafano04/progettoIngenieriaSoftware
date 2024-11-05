import { Types } from 'mongoose';
import ServiziGenerali from './ServiziGenerali';
import Sicurezza from './Sicurezza';

type Circoscrizione = {
    _id : Number,
    nome : String,
    coordinate : [[Number]],
    soddisfazioneMedia : Number,
    popolazione : Number,
    superficie : Number,
    serviziTotali : Number,
    interventiPolizia : Number,
    etaMedia : Number,
    servizi : ServiziGenerali,
    sicurezza : Sicurezza
}

export default Circoscrizione;