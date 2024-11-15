import express from 'express';                                           
import db from '../db'; // Import the database connection from the db file
import { Circoscrizione, CircoscrizioneBase, CircoscrizioneDB, Errors, Quartiere, QuartiereBase, QuartiereDB } from '../types';
import { getCircoscrizioneWithSoddisfazioneMedia, getCircoscrizioniWithSoddisfazioneMedia } from '../utils/circoscrizioni';
import {Types} from "mongoose";
import { serviziGenerali, sicurezza } from '../db/schemas';

const router = express.Router(); // Create a new router


// rotta per ottenere un array delle circoscrizioni di Trento, in base ai parametri vengono restituiti dati base o dati completi
router.get('/', async (req,res)=>{
    //ottengo il parametro deepData che indica se dovrò restituire i dati base o completi delle circoscrizioni
    const { deepData } = req.query;

    //le circoscrizioni che restituirò, potrebbero essere di tipo Circoscrizione oppure CircoscrizioneBase
    let circoscrizioni: Circoscrizione[] | CircoscrizioneBase[];

    try{
        //ottengo la lista di circoscrizioniBase
        const circoscrizioniBase = await getCircoscrizioniWithSoddisfazioneMedia();

        if(deepData){
            //devo restituire i dati completi delle circoscrizioni, quindi devo recuperare i dati completi dal database
            const circoscrizioniDB = await db.models.Circoscrizione.find();

            //mappo ogni circoscrizione base alla corrispondente circoscrizione completa usando i dati ottenuti dalla query
            circoscrizioni= await Promise.all(circoscrizioniBase.map( async (cirBase)=>{
                //trovo la circoscrizioneDB corrispondente (dove il self di quella base è uguale al _id di quella DB)
                const cirDB=circoscrizioniDB.find(async (cir)=>(
                    new Types.ObjectId(cirBase.self.split('/').pop()).equals(cir._id)
                ));
                if(!cirDB){
                    const errore: Errors = {
                        code: 500,
                        message: "Errore nel server",
                        details: `Circoscrizione ${cirBase.self} non trovata nel database`,
                    };
                    throw new Error(JSON.stringify(errore));
                }

                //combino i dati dalla circoscrizioneBase e la circoscrizioneDB per creare la circoscrizione completa
                const cirCompleta : Circoscrizione = {
                    self: cirBase.self,
                    nome: cirBase.nome,
                    coordinate: cirBase.coordinate,
                    soddisfazioneMedia: cirBase.soddisfazioneMedia,
                    servizi: cirDB.servizi,
                    sicurezza: cirDB.sicurezza,
                    popolazione: cirDB.popolazione,
                    superficie: cirDB.superficie,
                    serviziTotali: cirDB.serviziTotali,
                    interventiPolizia: cirDB.interventiPolizia,
                    etaMedia: cirDB.etaMedia,
                };

                return cirCompleta;
            }));
        }else{
            //devo restituire solo i dati base, mi basta mandare l'array circoscrizioniBase che ho già
            circoscrizioni=circoscrizioniBase;
        }


        res.status(200).json(circoscrizioni);
    }catch(err){
        console.error(err);
        if(err instanceof Error){
            res.status(500).json(JSON.parse(err.message));
        }else{
            res.status(500).json({code: 500, message: "Errore nel server", details: err});
        }
    }
});



// rotta per ottenere i dati di una circoscrizione specifica
router.get('/:id',async (req,res) =>{
    //potrei fare tutto questo usando la funzione getCircoscrizioneWithSoddisfazioneMedia() ma quella mi restituisce dati di tipo CircoscrizioneBase e a me servono Circoscrizione, dunque sarei costretto a fare una seconda query per le circoscrizioni, quindi faccio tutte le query necessarie direttamente qui



    const { id } = req.params;

    
    const circoscrizioneDB = await db.models.Circoscrizione.findById(id);
    
    if(!circoscrizioneDB){
        const errore: Errors = {
            code: 404,
            message: "Circoscrizione non trovata",
            details: `Circoscrizione con id ${id} non trovata`,
        };
        res.status(404).json(errore);
        return;
    }


    try{
        // trovo gli _id dei quartieri che appartengono alla circoscrizione che sto cercando
        const quartieriPerCir = await db.models.Quartiere.find({ circoscrizione: circoscrizioneDB._id }).select('_id');
        // Ottengo gli _id dei sondaggi approvati
        const sondaggi = await db.models.Sondaggio.find({ statoApprovazione: 'Approvato' }).select('_id');
        // Ottengo i voti dei sondaggi approvati relativi ai quartieri della circoscrizione
        const voti = await db.models.Voti.find({ sondaggio: { $in: sondaggi }, quartiere: { $in: quartieriPerCir } }).select('voto');
        // Calcolo la media dei voti della circoscrizione
        const mediaVoti = voti.length > 0 ? voti.reduce((acc, curr) => acc + curr.voto, 0) / voti.length : 0;

        // uso i dati che ho raccolto per creare la risposta di tipo Circoscrizione
        const circoscrizione: Circoscrizione = {
            self: `/api/v1/circoscrizioni/${circoscrizioneDB._id}`,
            nome: circoscrizioneDB.nome,
            coordinate: circoscrizioneDB.coordinate,
            soddisfazioneMedia: mediaVoti,
            popolazione:circoscrizioneDB.popolazione,
            serviziTotali: circoscrizioneDB.serviziTotali,
            interventiPolizia:circoscrizioneDB.interventiPolizia,
            etaMedia:circoscrizioneDB.etaMedia,
            servizi: circoscrizioneDB.servizi,
            sicurezza: circoscrizioneDB.sicurezza,
            superficie: circoscrizioneDB.superficie,
        };

        //rispondo alla richiesta mandando la circoscrizione
        res.status(200).json(circoscrizione);
    }catch(err){
        console.error(err);
        if(err instanceof Error){
            res.status(500).json(JSON.parse(err.message));
        }else{
            res.status(500).json({code: 500, message: "Errore nel server", details: err});
        }
    }
});

export default router; // Export the router