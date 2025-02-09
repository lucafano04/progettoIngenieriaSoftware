import express from 'express';                                           
import db from '../db'; // Import the database connection from the db file
import { Circoscrizioni, Errors, Quartieri } from '../../types';
import { getCircoscrizioneWithSoddisfazioneMedia, getCircoscrizioneWithSoddisfazioneMediaNoC, getCircoscrizioniWithSoddisfazioneMedia, getCircoscrizioniWithSoddisfazioneMediaNoC } from '../utils/circoscrizioni';
import {Types} from "mongoose";
import { BASE_URL, RESPONSE_MESSAGES } from '../variables';

const router = express.Router(); // Create a new router


// Rotta per ottenere tutti i quartieri
router.get('/', async (req, res) => {
    // Parametro deepData che indica se restituire tutti i dati del quartiere o solo quelli base
    const deepData: boolean = req.query.deepData === 'true';
    // Parametro coordinate che indica se restituire le coordinate del quartiere (true di default, false per non restituire le coordinate)
    const coordinate: boolean = req.query.coordinate !== 'false';
    // Ottengo tutti i quartieri dal DB
    // Se coordinate è false, non restituisco le coordinate
    let quartieriDB = await db.models.Quartiere.find({}, coordinate ? {} : { coordinate: 0 });
    
    // Tanti calcoli per trasformare QuartiereDB in Quartiere
    // Es. calcolare la soddisfazione media
    try{
        // Oggetto da restituire che può essere di quattro tipi: Quartiere[], Minimal[], QuartiereNoC[], MinimalBase[] a seconda dei parametri deepData e coordinate
        // Questo oggetto non conterrà mai tipi misti di Quartiere, Minimal, QuartiereNoC e MinimalBase sono o tutti Quartiere o tutti Minimal, ecc...
        let quartieri: Quartieri.Quartiere[] | Quartieri.Minimal[] | Quartieri.QuartiereNoC[] | Quartieri.MinimalBase[];
        // Ottengo le circoscrizioni con la soddisfazione media (con o senza coordinate)
        const circoscrizioniBase: Circoscrizioni.Minimal[] | Circoscrizioni.MinimalBase[] = coordinate ? await getCircoscrizioniWithSoddisfazioneMedia() : await getCircoscrizioniWithSoddisfazioneMediaNoC();
        // Se deepData è true, restituisco tutti i dati altrimenti solo i dati base (come definito nell'API doc)
        // Se deepData è assente/`undefined`/`null` lo tratto come `false`
        if(deepData){
            // Caso deepData = true quindi voglio tutti i dati del quartiere non solo quelli base
            quartieri = await Promise.all(quartieriDB.map(async (quartiere) => {
                // Cerco la circoscrizione associata al quartiere
                const cirBase : Circoscrizioni.Minimal | Circoscrizioni.MinimalBase | undefined = circoscrizioniBase.find(
                    (cir) => 
                        new Types.ObjectId(cir.self.split('/').pop()).equals(quartiere.circoscrizione) // creo un oggetto ObjectId con l'id della circoscrizione estratto dalla stringa self e controllo se è uguale all'id della circoscrizione del quartiere 
                );
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
                const quartiereRet: Quartieri.Quartiere | Quartieri.QuartiereNoC = {
                    self: `${BASE_URL}/quartieri/${quartiere._id}`,
                    nome: quartiere.nome,
                    ...coordinate ? { coordinate: quartiere.coordinate } : {},
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
                const cirBase : Circoscrizioni.Minimal  | Circoscrizioni.MinimalBase | undefined = circoscrizioniBase.find(
                    (cir) => 
                        new Types.ObjectId(cir.self.split('/').pop()).equals(quartiere.circoscrizione) // creo un oggetto ObjectId con l'id della circoscrizione estratto dalla stringa self e controllo se è uguale all'id della circoscrizione del quartiere 
                );
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
                const quartiereRet: Quartieri.Minimal | Quartieri.MinimalBase = {
                    self: `${BASE_URL}/quartieri/${quartiere._id}`,
                    nome: quartiere.nome,
                    ...coordinate ? { coordinate: quartiere.coordinate } : {},
                    circoscrizione: cirBase,
                    soddisfazioneMedia: mediaVoti,
                };
                // Restituisco l'oggetto
                return quartiereRet; 
            }));
            
        }
        // Restituisco i quartieri sia che questi siano completi o base
        res.status(200).json(quartieri);
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
    if(!Types.ObjectId.isValid(id)){
        const response: Errors = {
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: `L'id ${id} non è valido`,
        };
        res.status(400).json(response);
        return;
    }
    const coordinate = req.query.coordinate !== 'false';
    // Cerco il quartiere nel DB
    const quartiereDB = await db.models.Quartiere.findById(id, coordinate ? {} : { coordinate: 0 });
    // Se il quartiere non esiste, restituisco un errore
    if(!quartiereDB){
        const response: Errors = {
            code: 404,
            message: RESPONSE_MESSAGES[404],
            details: `Quartiere con id ${id} non trovato`,
        };
        res.status(404).json(response);
        return;
    }
    try{
        // Cerco la circoscrizione associata al quartiere
        let circoscrizione: Circoscrizioni.Minimal | Circoscrizioni.MinimalBase;
        if(coordinate)
            circoscrizione = await getCircoscrizioneWithSoddisfazioneMedia(quartiereDB.circoscrizione);
        else
            circoscrizione = await getCircoscrizioneWithSoddisfazioneMediaNoC(quartiereDB.circoscrizione);
        // Calcolo la media dei voti del quartiere
        const mediaVoti = await getMediaVoti(quartiereDB);
        // Creo l'oggetto da restituire
        const quartiere: Quartieri.Quartiere = {
            self: `${BASE_URL}/quartieri/${quartiereDB._id}`,
            nome: quartiereDB.nome,
            coordinate: quartiereDB.coordinate,
            circoscrizione: {
                self: circoscrizione.self,
                nome: circoscrizione.nome,
                ...'coordinate' in circoscrizione ? { coordinate: circoscrizione.coordinate } : {},
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
        res.status(200).json(quartiere);
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
 * @param {Quartieri.DB} quartiere oggetto quartiere del quale calcolare la media dei voti
 * @returns la media dei voti del quartiere (1-5) o 0 se non ci sono voti
 */
async function getMediaVoti(quartiere: Quartieri.DB): Promise<number> {
    const sondaggi = await db.models.Sondaggio.find({ statoApprovazione: 'Approvato' }).select('_id');
    // Ottengo i voti dei sondaggi approvati relativi al quartiere
    const voti = await db.models.Voti.find({ sondaggio: { $in: sondaggi }, quartiere: quartiere._id }).select('voto');
    // Calcolo la media dei voti del quartiere
    const mediaVoti = voti.length > 0 ? voti.reduce((acc, curr) => acc + curr.voto, 0) / voti.length : 0;
    return mediaVoti;
}
