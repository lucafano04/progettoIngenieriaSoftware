import express from 'express';                                           
import db from '../db'; // Import the database connection from the db file
import { CircoscrizioneBase, CircoscrizioneDB, Errors, Quartiere, QuartiereBase } from '../types';

const router = express.Router(); // Create a new router


// Rotta per ottenere tutti i quartieri
router.get('/', async (req, res) => {
    const { deepData } = req.query;
    let quartieriDB = await db.models.Quartiere.find();
    
    // Tanti calcoli per trasformare QuartiereDB in Quartiere
    // Es. calcolare la soddisfazione media
    try{
        // Oggetto da restituire
        let quartieri: Quartiere[] | QuartiereBase[];

        // Oggetto utilitario per memorizzare le circoscrizioni base e non dover ripetere il calcolo della soddisfazione media (very expensive)
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
        // Se deepData è true, restituisco tutti i dati (TODO) altrimenti solo i dati base
        // TODO: Aggiungere il caso deepData=true
        if(deepData){
            quartieri = [];
        } else {
            quartieri = await Promise.all(quartieriDB.map(async (quartiere) => {
                let cirBase : CircoscrizioneBase | undefined = circoscrizioniBase.find((cir) => cir._id.equals(quartiere.circoscrizione));
                if(!cirBase){
                    const response: Errors = {
                        code: 500,
                        message: "Errore nel server",
                        details: `Circoscrizione ${quartiere.circoscrizione} associata al quartiere ${quartiere.nome} non trovata`, 
                    };
                    throw new Error(JSON.stringify(response));
                }
                // Ottengo i sondaggi approvati
                const sondaggi = await db.models.Sondaggio.find({statoApprovazione: 'Approvato'}).select('_id');
                // Ottengo i voti dei sondaggi approvati relativi al quartiere
                const voti = await db.models.Voti.find({sondaggio: {$in: sondaggi}, quartiere: quartiere._id}).select('voto');
                // Calcolo la media dei voti del quartiere
                const mediaVoti = voti.length > 0 ? voti.reduce((acc, curr) => acc + curr.voto, 0) / voti.length : 0;
                return {
                    _id: quartiere._id,
                    nome: quartiere.nome,
                    coordinate: quartiere.coordinate,
                    circoscrizione: cirBase,
                    soddisfazioneMedia: mediaVoti,
                };
            }));
            
        }
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

export default router; // Export the router