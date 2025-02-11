import Base from './Base';
import {Circoscrizioni} from '..';


type MinimalBase = Base & {
    self: string,
    circoscrizione: Circoscrizioni.MinimalBase,
    soddisfazioneMedia: number
}

export default MinimalBase;