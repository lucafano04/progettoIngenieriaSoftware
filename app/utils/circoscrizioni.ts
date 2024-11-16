import { Types } from 'mongoose';
import db from '../db';
import { Circoscrizioni } from '../../types';

/**
 * Funzione che restituisce un array di oggetti di tipo CircoscrizioneBase contenente i dati delle circoscrizioni con la relativa soddisfazione media
 * @returns {Promise<Circoscrizioni.Minimal>[]} Un array di oggetti di tipo CircoscrizioneBase contenente i dati delle circoscrizioni con la relativa soddisfazione media
 */
async function getCircoscrizioniWithSoddisfazioneMedia(): Promise<Circoscrizioni.Minimal[]> {
    const circoscrizioniDB = await db.models.Circoscrizione.find();
    const circoscrizioniBase: Circoscrizioni.Minimal[] = await Promise.all(circoscrizioniDB.map(async (circoscrizione) => {
        const quartieriPerCir = await db.models.Quartiere.find({circoscrizione: circoscrizione._id}).select('_id');
        // Ottengo gli _id dei sondaggi approvati
        const sondaggi = await db.models.Sondaggio.find({statoApprovazione: 'Approvato'}).select('_id');
        // Ottengo i voti dei sondaggi approvati relativi ai quartieri della circoscrizione
        const voti = await db.models.Voti.find({sondaggio: {$in: sondaggi}, quartiere: {$in: quartieriPerCir}}).select('voto');
        // Calcolo la media dei voti della circoscrizione
        const mediaVoti = voti.length > 0 ? voti.reduce((acc, curr) => acc + curr.voto, 0) / voti.length : 0;
        const cirBase: Circoscrizioni.Minimal = {
            self: `/api/v1/circoscrizioni/${circoscrizione._id}`,
            nome: circoscrizione.nome,
            coordinate: circoscrizione.coordinate,
            soddisfazioneMedia: mediaVoti,
        };
        return cirBase;
    }));
    return circoscrizioniBase;

}

/**
 * Funzione che restituisce un oggetto di tipo CircoscrizioneBase contenente i dati della circoscrizione con la relativa soddisfazione media
 * @param {Types.ObjectId} id ID della circoscrizione di cui si vuole ottenere la soddisfazione media
 * @returns {Promise<Circoscrizioni.Minimal>} Un oggetto di tipo CircoscrizioneBase contenente i dati della circoscrizione con la relativa soddisfazione media
 */
async function getCircoscrizioneWithSoddisfazioneMedia(id: Types.ObjectId): Promise<Circoscrizioni.Minimal> {
    const circoscrizioneDB = await db.models.Circoscrizione.findById(id);
    if (!circoscrizioneDB)
        throw new Error(JSON.stringify({ code: 404, message: "Circoscrizione non trovata", details: `Circoscrizione con id ${id} non trovata`}));
    const quartieriPerCir = await db.models.Quartiere.find({ circoscrizione: circoscrizioneDB._id }).select('_id');
    // Ottengo gli _id dei sondaggi approvati
    const sondaggi = await db.models.Sondaggio.find({ statoApprovazione: 'Approvato' }).select('_id');
    // Ottengo i voti dei sondaggi approvati relativi ai quartieri della circoscrizione
    const voti = await db.models.Voti.find({ sondaggio: { $in: sondaggi }, quartiere: { $in: quartieriPerCir } }).select('voto');
    // Calcolo la media dei voti della circoscrizione
    const mediaVoti = voti.length > 0 ? voti.reduce((acc, curr) => acc + curr.voto, 0) / voti.length : 0;
    const cirBase: Circoscrizioni.Minimal = {
        self: `/api/v1/circoscrizioni/${circoscrizioneDB._id}`,
        nome: circoscrizioneDB.nome,
        coordinate: circoscrizioneDB.coordinate,
        soddisfazioneMedia: mediaVoti,
    };
    return cirBase;
}

const utilCircoscrizioni = {
    getCircoscrizioniWithSoddisfazioneMedia,
    getCircoscrizioneWithSoddisfazioneMedia
}
export default utilCircoscrizioni;
export {
    getCircoscrizioniWithSoddisfazioneMedia,
    getCircoscrizioneWithSoddisfazioneMedia
}