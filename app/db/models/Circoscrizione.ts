import {Schema, model} from 'mongoose';
import schemas from '../schemas';
import { Circoscrizioni } from '../../../types';

const circoscrizioneSchema = new Schema<Circoscrizioni.DB>({
    nome : { type : String, required : true },
    coordinate : { type : [[Number]], required : true },
});

const Circoscrizione = model('Circoscrizione', circoscrizioneSchema);

export default Circoscrizione;