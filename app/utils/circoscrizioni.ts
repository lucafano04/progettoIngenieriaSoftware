import { Types } from 'mongoose';
import db from '../db';
import { Circoscrizioni } from '../../types';
import { Circoscrizione } from '../../types/Circoscrizioni';

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

async function getCircoscrizioneCompletaFromMinimal(cirBase: Circoscrizioni.Minimal) : Promise<Circoscrizioni.Circoscrizione> {
    const quartieriPerCir = await db.models.Quartiere.find({ circoscrizione: cirBase.self.split('/').pop() })
    const areeVerdi = quartieriPerCir.reduce((acc, curr) => acc + curr.servizi.areeVerdi, 0);
    const localiNotturni = quartieriPerCir.reduce((acc, curr) => acc + curr.servizi.localiNotturni, 0);
    const scuole = quartieriPerCir.reduce((acc, curr) => acc + curr.servizi.scuole, 0);
    const serviziRistorazione = quartieriPerCir.reduce((acc, curr) => acc + curr.servizi.serviziRistorazione, 0);

    const incidenti = quartieriPerCir.reduce((acc, curr) => acc + curr.sicurezza.incidenti, 0);
    const numeroInterventi = quartieriPerCir.reduce((acc, curr) => acc + curr.sicurezza.numeroInterventi, 0);
    const tassoCriminalita = quartieriPerCir.length > 0 ? quartieriPerCir.reduce((acc, curr) => acc + curr.sicurezza.tassoCriminalita, 0) / quartieriPerCir.length : 0;

    const popolazione = quartieriPerCir.reduce((acc, curr) => acc + curr.popolazione, 0);
    const superficie = quartieriPerCir.reduce((acc, curr) => acc + curr.superficie, 0);
    const serviziTotali = quartieriPerCir.reduce((acc, curr) => acc + curr.serviziTotali, 0);
    const interventiPolizia = quartieriPerCir.reduce((acc, curr) => acc + curr.interventiPolizia, 0);

    const etaMedia = quartieriPerCir.length > 0 ? quartieriPerCir.reduce((acc, curr) => acc + curr.etaMedia*(curr.popolazione/popolazione), 0) : 0;
    //combino i dati dalla circoscrizioneBase e la circoscrizioneDB per creare la circoscrizione completa
    const cirCompleta : Circoscrizioni.Circoscrizione = {
        self: cirBase.self,
        nome: cirBase.nome,
        coordinate: cirBase.coordinate,
        soddisfazioneMedia: cirBase.soddisfazioneMedia,
        servizi: {
            areeVerdi: areeVerdi,
            localiNotturni: localiNotturni,
            scuole: scuole,
            serviziRistorazione: serviziRistorazione,
        },
        sicurezza: {
            incidenti: incidenti,
            numeroInterventi: numeroInterventi,
            tassoCriminalita: tassoCriminalita,
        },
        popolazione: popolazione,
        superficie: superficie,
        serviziTotali: serviziTotali,
        interventiPolizia: interventiPolizia,
        etaMedia: etaMedia,
    };
    return cirCompleta;
}

const utilCircoscrizioni = {
    getCircoscrizioniWithSoddisfazioneMedia,
    getCircoscrizioneWithSoddisfazioneMedia,
    getCircoscrizioneCompletaFromMinimal
}
export default utilCircoscrizioni;
export {
    getCircoscrizioniWithSoddisfazioneMedia,
    getCircoscrizioneWithSoddisfazioneMedia,
    getCircoscrizioneCompletaFromMinimal
}