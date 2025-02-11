import { Types } from 'mongoose';
import db from '../db';
import { Circoscrizioni } from '../../types';
import { Circoscrizione } from '../../types/Circoscrizioni';

/**
 * Funzione che restituisce un array di oggetti di tipo CircoscrizioneBase contenente i dati delle circoscrizioni con la relativa soddisfazione media
 * @returns {Promise<Circoscrizioni.Minimal>[]} Un array di oggetti di tipo CircoscrizioneBase o CircoscrizioneBaseNoC contenente i dati delle circoscrizioni con la relativa soddisfazione media (se coordinate è true, altrimenti senza coordinate)
 */
async function getCircoscrizioniWithSoddisfazioneMedia(): Promise<Circoscrizioni.Minimal[]> {
    const circoscrizioniNoC = await getCircoscrizioniWithSoddisfazioneMediaNoC();
    const circoscrizioni: Circoscrizioni.Minimal[] = await Promise.all(circoscrizioniNoC.map(async (cirBase) => {
        const coordinate = await db.models.Circoscrizione.findById(cirBase.self.split('/').pop(), {coordinate: 1});
        if(!coordinate)
            throw new Error(JSON.stringify({ code: 500, message: "Errore nel server", details: `Coordinate della circoscrizione ${cirBase.nome} non trovate`}));
        return {
            ...cirBase,
            coordinate: coordinate.coordinate
        }
    }));
    return circoscrizioni;
}

/**
 * Funzione che restituisce un array di oggetti di tipo CircoscrizioneMinimalBase ovvero contenente i dati delle circoscrizioni con la relativa soddisfazione media senza coordinate
 * @returns {Promise<Circoscrizioni.MinimalBase[]>} Un array di oggetti di tipo CircoscrizioneMinimalBase contenente i dati delle circoscrizioni con la relativa soddisfazione media senza coordinate
 */
async function getCircoscrizioniWithSoddisfazioneMediaNoC(): Promise<Circoscrizioni.MinimalBase[]> {
    const circoscrizioniDB = await db.models.Circoscrizione.find({}, {coordinate: 0})
    const circoscrizioniBase: Circoscrizioni.MinimalBase[] = await Promise.all(circoscrizioniDB.map(async (circoscrizione) => {
        const mediaVoti = await getMediaVotiCircoscrizione(circoscrizione._id);
        const cirBase: Circoscrizioni.Minimal | Circoscrizioni.MinimalBase = {
            self: `/api/v1/circoscrizioni/${circoscrizione._id}`,
            nome: circoscrizione.nome,
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
    const mediaVoti = await getMediaVotiCircoscrizione(id);
    const cirBase: Circoscrizioni.Minimal = {
        self: `/api/v1/circoscrizioni/${circoscrizioneDB._id}`,
        nome: circoscrizioneDB.nome,
        coordinate: circoscrizioneDB.coordinate,
        soddisfazioneMedia: mediaVoti,
    };
    return cirBase;
}

async function getCircoscrizioneWithSoddisfazioneMediaNoC(id: Types.ObjectId): Promise<Circoscrizioni.MinimalBase> {
    const circoscrizioneDB = await db.models.Circoscrizione.findById(id, { coordinate: 0 });
    if (!circoscrizioneDB)
        throw new Error(JSON.stringify({ code: 404, message: "Circoscrizione non trovata", details: `Circoscrizione con id ${id} non trovata`}));
    const mediaVoti = await getMediaVotiCircoscrizione(id);
    const cirBase: Circoscrizioni.MinimalBase = {
        self: `/api/v1/circoscrizioni/${circoscrizioneDB._id}`,
        nome: circoscrizioneDB.nome,
        soddisfazioneMedia: mediaVoti
    };
    return cirBase;
}

/**
 * Funzione che restituisce la media dei voti di una circoscrizione
 * @param {Types.ObjectId} id Id della circoscrizione di cui si vuole ottenere la media dei voti
 * @returns {Promise<number>} La media dei voti della circoscrizione
 */
async function getMediaVotiCircoscrizione(id: Types.ObjectId): Promise<number> {
    const quartieriPerCir = await db.models.Quartiere.find({ circoscrizione: id }).select('_id');
    // Ottengo gli _id dei sondaggi approvati
    const sondaggi = await db.models.Sondaggio.find({ statoApprovazione: 'Approvato' }, { _id: 1 });
    // Ottengo i voti dei sondaggi approvati relativi ai quartieri della circoscrizione
    const voti = await db.models.Voti.find({ sondaggio: { $in: sondaggi }, quartiere: { $in: quartieriPerCir } }, { voto: 1 });
    // Calcolo la media dei voti della circoscrizione
    const mediaVoti = voti.length > 0 ? voti.reduce((acc, curr) => acc + curr.voto, 0) / voti.length : 0;
    return mediaVoti;
}

async function getCircoscrizioneCompletaFromMinimal(cirBase: Circoscrizioni.Minimal) : Promise<Circoscrizioni.Circoscrizione> {
    const cirCompleta = await getCircoscrizioneCompletaFromMinimalBase(cirBase);
    return {
        ...cirCompleta,
        coordinate: cirBase.coordinate
    }
}

async function getCircoscrizioneCompletaFromMinimalBase(cirBase: Circoscrizioni.MinimalBase) : Promise<Circoscrizioni.CircoscrizioneNoC> {
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
    const cirCompleta : Circoscrizioni.CircoscrizioneNoC = {
        self: cirBase.self,
        nome: cirBase.nome,
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
    getCircoscrizioneWithSoddisfazioneMediaNoC,
    getCircoscrizioneCompletaFromMinimal,
    getCircoscrizioneCompletaFromMinimalBase
}
export default utilCircoscrizioni;
export {
    getCircoscrizioniWithSoddisfazioneMedia,
    getCircoscrizioniWithSoddisfazioneMediaNoC,
    getCircoscrizioneWithSoddisfazioneMedia,
    getCircoscrizioneWithSoddisfazioneMediaNoC,
    getCircoscrizioneCompletaFromMinimal,
    getCircoscrizioneCompletaFromMinimalBase
}