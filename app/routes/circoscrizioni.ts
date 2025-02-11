import express from 'express';                                           
import db from '../db'; // Import the database connection from the db file
import { Circoscrizioni, Dati, Errors } from '../../types';
import { getCircoscrizioneCompletaFromMinimal, getCircoscrizioneCompletaFromMinimalBase, getCircoscrizioneWithSoddisfazioneMedia, getCircoscrizioneWithSoddisfazioneMediaNoC, getCircoscrizioniWithSoddisfazioneMedia, getCircoscrizioniWithSoddisfazioneMediaNoC } from '../utils/circoscrizioni';
import {Types} from "mongoose";
import { BASE_URL, RESPONSE_MESSAGES } from '../variables';

const router = express.Router(); // Create a new router


// rotta per ottenere un array delle circoscrizioni di Trento, in base ai parametri vengono restituiti dati base o dati completi
router.get('/', async (req,res)=>{
    //ottengo il parametro deepData che indica se dovrò restituire i dati base o completi delle circoscrizioni
    const deepData: boolean = req.query.deepData === 'true';
    // ottengo il parametro coordinate che indica se dovrò restituire le coordinate delle circoscrizioni
    const coordinate: boolean = req.query.coordinate !== 'false';
    //le circoscrizioni che restituirò, potrebbero essere di tipo Circoscrizione oppure CircoscrizioneBase
    let circoscrizioni: Circoscrizioni.Circoscrizione[] | Circoscrizioni.Minimal[] | Circoscrizioni.MinimalBase[] | Circoscrizioni.CircoscrizioneNoC[] = [];
    try{
        //ottengo la lista di circoscrizioniBase
        if(deepData){
            //devo restituire i dati completi delle circoscrizioni, quindi devo recuperare i dati completi dal database
            const circoscrizioniDB = await db.models.Circoscrizione.find({}, coordinate ? {} : {coordinate: 0});
            //mappo ogni circoscrizione base alla corrispondente circoscrizione completa usando i dati ottenuti dalla query
            if(coordinate){
                const circoscrizioniBase = await getCircoscrizioniWithSoddisfazioneMedia();
                circoscrizioni= await Promise.all(circoscrizioniBase.map( async (cirBase)=>{
                    //trovo la circoscrizioneDB corrispondente (dove il self di quella base è uguale al _id di quella DB)
                    const cirDB=circoscrizioniDB.find((cir)=>(
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
                    
                    return await getCircoscrizioneCompletaFromMinimal(cirBase);
                }));
            }else{
                const circoscrizioniBase = await getCircoscrizioniWithSoddisfazioneMediaNoC();
                circoscrizioni= await Promise.all(circoscrizioniBase.map( async (cirBase)=>{
                    //trovo la circoscrizioneDB corrispondente (dove il self di quella base è uguale al _id di quella DB)
                    const cirDB=circoscrizioniDB.find((cir)=>(
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
                    
                    return await getCircoscrizioneCompletaFromMinimalBase(cirBase);
                }));
            }
        }else{
            //devo restituire solo i dati base, mi basta mandare l'array circoscrizioniBase che ho già
            circoscrizioni = coordinate ? await getCircoscrizioniWithSoddisfazioneMedia() : await getCircoscrizioniWithSoddisfazioneMediaNoC();
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
    if(!Types.ObjectId.isValid(id)){
        const errore: Errors = {
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: `L'id ${id} non è valido`,
        };
        res.status(400).json(errore);
        return;
    }
    const coordinate = req.query.coordinate !== 'false';
    
    const circoscrizioneDB = await db.models.Circoscrizione.findById(id, coordinate ? {} : {coordinate: 0});
    
    if(!circoscrizioneDB){
        const errore: Errors = {
            code: 404,
            message: RESPONSE_MESSAGES[404],
            details: `Circoscrizione con id ${id} non trovata`,
        };
        res.status(404).json(errore);
        return;
    }
    try{
        let circoscrizione: Circoscrizioni.Circoscrizione | Circoscrizioni.CircoscrizioneNoC;
        if(coordinate){
            const cirBase: Circoscrizioni.Minimal = await getCircoscrizioneWithSoddisfazioneMedia(circoscrizioneDB._id);
            // uso i dati che ho raccolto per creare la risposta di tipo Circoscrizione
            circoscrizione = await getCircoscrizioneCompletaFromMinimal(cirBase)
        }else{
            const cirBase: Circoscrizioni.MinimalBase = await getCircoscrizioneWithSoddisfazioneMediaNoC(circoscrizioneDB._id);
            // uso i dati che ho raccolto per creare la risposta di tipo CircoscrizioneNoC
            circoscrizione = await getCircoscrizioneCompletaFromMinimalBase(cirBase)
        }
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