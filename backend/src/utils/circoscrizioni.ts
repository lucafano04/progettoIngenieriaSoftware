import db from '../db';
import { CircoscrizioneBase } from '../types';

/**
 * Funzione che restituisce un array di oggetti di tipo CircoscrizioneBase contenente i dati delle circoscrizioni con la relativa soddisfazione media
 * @returns Un array di oggetti di tipo CircoscrizioneBase contenente i dati delle circoscrizioni con la relativa soddisfazione media
 */
async function getCircoscrizioniWithSoddisfazioneMedia(){
    const circoscrizioniDB = await db.models.Circoscrizione.find();
    const circoscrizioniBase: CircoscrizioneBase[] = await Promise.all(circoscrizioniDB.map(async (circoscrizione) => {
        const quartieriPerCir = await db.models.Quartiere.find({circoscrizione: circoscrizione._id}).select('_id');
        // Ottengo gli _id dei sondaggi approvati
        const sondaggi = await db.models.Sondaggio.find({statoApprovazione: 'Approvato'}).select('_id');
        // Ottengo i voti dei sondaggi approvati relativi ai quartieri della circoscrizione
        const voti = await db.models.Voti.find({sondaggio: {$in: sondaggi}, quartiere: {$in: quartieriPerCir}}).select('voto');
        // Calcolo la media dei voti della circoscrizione
        const mediaVoti = voti.length > 0 ? voti.reduce((acc, curr) => acc + curr.voto, 0) / voti.length : 0;
        const cirBase: CircoscrizioneBase = {
            _id: circoscrizione._id,
            nome: circoscrizione.nome,
            coordinate: circoscrizione.coordinate,
            soddisfazioneMedia: mediaVoti,
        };
        return cirBase;
    }));
    return circoscrizioniBase;

}

const utilCircoscrizioni = {
    getCircoscrizioniWithSoddisfazioneMedia
}
export default utilCircoscrizioni;
export {
    getCircoscrizioniWithSoddisfazioneMedia
}