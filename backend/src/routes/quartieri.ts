import express from 'express';                                           
import db from '../db'; // Import the database connection from the db file
import { CircoscrizioneBase, CircoscrizioneDB, Errors, Quartiere, QuartiereBase, QuartiereDB } from '../types';
import { getCircoscrizioneWithSoddisfazioneMedia, getCircoscrizioniWithSoddisfazioneMedia } from '../utils/circoscrizioni';

const router = express.Router(); // Create a new router


// Rotta per ottenere tutti i quartieri
router.get('/', async (req, res) => {
    // Parametro deepData che indica se restituire tutti i dati del quartiere o solo quelli base
    const { deepData } = req.query;
    // Ottengo tutti i quartieri dal DB
    let quartieriDB = await db.models.Quartiere.find();
    
    // Tanti calcoli per trasformare QuartiereDB in Quartiere
    // Es. calcolare la soddisfazione media
    try{
        // Oggetto da restituire che può essere di due tipi: Quartiere[] o QuartiereBase[] a seconda del valore di deepData
        // Questo oggetto non conterrà mai tipi misti di Quartiere e QuartiereBase (o tutti Quartiere o tutti QuartiereBase)
        let quartieri: Quartiere[] | QuartiereBase[];
        const circoscrizioniBase: CircoscrizioneBase[] = await getCircoscrizioniWithSoddisfazioneMedia();
        // Se deepData è true, restituisco tutti i dati altrimenti solo i dati base (come definito nell'API doc)
        // Se deepData è assente/`undefined`/`null` lo tratto come `false`
        if(deepData){
            // Caso deepData = true quindi voglio tutti i dati del quartiere non solo quelli base
            quartieri = await Promise.all(quartieriDB.map(async (quartiere) => {
                // Cerco la circoscrizione associata al quartiere
                const cirBase : CircoscrizioneBase | undefined = circoscrizioniBase.find((cir) => cir._id.equals(quartiere.circoscrizione));
                // Se non trovo la circoscrizione, restituisco un errore (Inconsistenza nel DB)
                if(!cirBase){
                    const response: Errors = {
                        code: 500,
                        message: "Errore nel server",
                        details: `Circoscrizione ${quartiere.circoscrizione} associata al quartiere ${quartiere.nome} non trovata`, 
                    };
                    throw new Error(JSON.stringify(response));
                }
                // Calcolo la media dei voti del quartiere
                const mediaVoti = await getMediaVoti(quartiere);
                // Creo l'oggetto da restituire
                const quartiereRet: Quartiere = {
                    _id: quartiere._id,
                    nome: quartiere.nome,
                    coordinate: quartiere.coordinate,
                    circoscrizione: cirBase,
                    etaMedia: quartiere.etaMedia,
                    interventiPolizia: quartiere.interventiPolizia,
                    popolazione: quartiere.popolazione,
                    soddisfazioneMedia: mediaVoti,
                    servizi: quartiere.servizi,
                    serviziTotali: quartiere.serviziTotali,
                    sicurezza: quartiere.sicurezza,
                    superficie: quartiere.superficie,
                };
                return quartiereRet;
            }))
        } else {
            // Caso deepData = false quindi voglio solo i dati base del quartiere
            quartieri = await Promise.all(quartieriDB.map(async (quartiere) => {
                // Cerco la circoscrizione associata al quartiere
                const cirBase : CircoscrizioneBase | undefined = circoscrizioniBase.find((cir) => cir._id.equals(quartiere.circoscrizione));
                // Se non trovo la circoscrizione, restituisco un errore (Inconsistenza nel DB)
                if(!cirBase){
                    const response: Errors = {
                        code: 500,
                        message: "Errore nel server",
                        details: `Circoscrizione ${quartiere.circoscrizione} associata al quartiere ${quartiere.nome} non trovata`, 
                    };
                    throw new Error(JSON.stringify(response));
                }
                // Ottengo i sondaggi approvati
                const mediaVoti = await getMediaVoti(quartiere);
                // Creo l'oggetto da restituire
                const quartiereRet: QuartiereBase = {
                    _id: quartiere._id,
                    nome: quartiere.nome,
                    coordinate: quartiere.coordinate,
                    circoscrizione: cirBase,
                    soddisfazioneMedia: mediaVoti,
                };
                // Restituisco l'oggetto
                return quartiereRet; 
            }));
            
        }
        // Restituisco i quartieri sia che questi siano completi o base
        res.json(quartieri);
    }catch(err: any){
        console.error(err);
        if(err instanceof Error){
            res.status(500).json(JSON.parse(err.message));
        }else{
            res.status(500).json({code: 500, message: "Errore nel server", details: err});
        }
    }
});

// Rotta per ottenere un quartiere dato il suo id
router.get('/:id', async (req, res) => {
    // Ottengo l'id del quartiere dalla richiesta
    const { id } = req.params;
    // Cerco il quartiere nel DB
    const quartiereDB = await db.models.Quartiere.findById(id);
    // Se il quartiere non esiste, restituisco un errore
    if(!quartiereDB){
        const response: Errors = {
            code: 404,
            message: "Quartiere non trovato",
            details: `Quartiere con id ${id} non trovato`,
        };
        res.status(404).json(response);
        return;
    }
    try{
        // Cerco la circoscrizione associata al quartiere
        const circoscrizione = await getCircoscrizioneWithSoddisfazioneMedia(quartiereDB.circoscrizione);
        // Calcolo la media dei voti del quartiere
        const mediaVoti = await getMediaVoti(quartiereDB);
        // Creo l'oggetto da restituire
        const quartiere: Quartiere = {
            _id: quartiereDB._id,
            nome: quartiereDB.nome,
            coordinate: quartiereDB.coordinate,
            circoscrizione: {
                _id: circoscrizione._id,
                nome: circoscrizione.nome,
                coordinate: circoscrizione.coordinate,
                soddisfazioneMedia: circoscrizione.soddisfazioneMedia,
            },
            etaMedia: quartiereDB.etaMedia,
            interventiPolizia: quartiereDB.interventiPolizia,
            popolazione: quartiereDB.popolazione,
            soddisfazioneMedia: mediaVoti,
            servizi: quartiereDB.servizi,
            serviziTotali: quartiereDB.serviziTotali,
            sicurezza: quartiereDB.sicurezza,
            superficie: quartiereDB.superficie,
        };
        // Restituisco il quartiere
        res.json(quartiere);
    }catch(err: any){
        console.error(err);
        if(err instanceof Error){
            res.status(500).json(JSON.parse(err.message));
        }else{
            res.status(500).json({code: 500, message: "Errore nel server", details: err});
        }
    }
});

export default router; // Export the router

/**
 * Funzione che calcola la media dei voti di un quartiere
 * @param {QuartiereDB} quartiere oggetto quartiere del quale calcolare la media dei voti
 * @returns la media dei voti del quartiere (1-5) o 0 se non ci sono voti
 */
async function getMediaVoti(quartiere: QuartiereDB): Promise<number> {
    const sondaggi = await db.models.Sondaggio.find({ statoApprovazione: 'Approvato' }).select('_id');
    // Ottengo i voti dei sondaggi approvati relativi al quartiere
    const voti = await db.models.Voti.find({ sondaggio: { $in: sondaggi }, quartiere: quartiere._id }).select('voto');
    // Calcolo la media dei voti del quartiere
    const mediaVoti = voti.length > 0 ? voti.reduce((acc, curr) => acc + curr.voto, 0) / voti.length : 0;
    return mediaVoti;
}
