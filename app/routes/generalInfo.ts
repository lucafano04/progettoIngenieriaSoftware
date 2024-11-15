import express from 'express';                                           
import db from '../db'; // Import the database connection from the db file
import { CircoscrizioneBase, CircoscrizioneDB, Errors, Quartiere, QuartiereBase, QuartiereDB } from '../types';
import { getCircoscrizioneWithSoddisfazioneMedia, getCircoscrizioniWithSoddisfazioneMedia } from '../utils/circoscrizioni';
import {Types} from "mongoose";

const router = express.Router(); //creo un nuovo router


// rotta che restituisce informazioni sulla popolazione, superficie, età media, e soddisfazione media in tutta Trento
router.get('/', async (req,res)=>{
    //uso la funzione getCircoscrizioniWithSoddisfazioneMedia per ricavare la soddisfazione media di ogni circoscrizione
    const circoscrizioniConMedia=await getCircoscrizioniWithSoddisfazioneMedia();
    //interrogo il database per ottenere le circoscrizioni perché mi servono i dati su popolazione, superficie, ed età
    const circoscrizioniDB=await db.models.Circoscrizione.find();


    try{
        //combino i dati delle circoscrizioni e creo un array di oggetti che contengono i dati generali per ogni circoscrizione
        const datiGeneraliCircoscrizioni= await Promise.all(circoscrizioniConMedia.map(async (cirBase)=>{
            //per ogni circoscrizioneconmedia trovo la circoscrizionedb corrispondente
            const cirDB: CircoscrizioneDB=circoscrizioniDB.find(async (cir)=>
                new Types.ObjectId(cirBase.self.split('/').pop()).equals(cir._id)
            ); 

            if(!cirDB){//controllo se non ho trovato la circoscrizione nel database. tecnicamente questo non dovrebbe mai succedere
                const errore: Errors = {
                    code: 500,
                    message: "Errore nel server",
                    details: `Circoscrizione ${cirBase.self} non trovata nel database`,
                };
                throw new Error(JSON.stringify(errore));
            }

            //prendo i dati che mi interessano (popolazione, superficie, età, soddisfazione) da cirDB e cirBase e li metto in un oggetto apposito
            const dati = {
                popolazione: cirDB.popolazione,
                superficie: cirDB.superficie,
                etaMedia: cirDB.etaMedia,
                soddifazioneMedia: cirBase.soddisfazioneMedia
            };

            return dati;
        }));

        //trovo la popolazione totale di Trento sommando la popolazione di ogni circoscrizione
        const popolazioneTotale=datiGeneraliCircoscrizioni.reduce((acc,curr)=>acc+curr.popolazione,0);
        //trovo la superficie totale di Trento sommando la superficie di ogni circoscrizione
        const superficieTotale=datiGeneraliCircoscrizioni.reduce((acc,curr)=>acc+curr.superficie,0);
        //trovo l'età media di Trento facendo una media dell'età nelle circoscrizioni pesata in base alla popolazione
        const etaMediaTotale=datiGeneraliCircoscrizioni.reduce((acc,curr)=>acc+curr.etaMedia*(curr.popolazione/popolazioneTotale),0);
        //trovo la soddisfazione media di Trento facendo una media della soddisfazione nelle circoscrizioni pesata in base alla popolazione
        const soddisfazioneTotale=datiGeneraliCircoscrizioni.reduce((acc,curr)=>acc+curr.soddifazioneMedia*(curr.popolazione/popolazioneTotale),0);

        //creo un oggetto contenente i quattro dati da mandare in risposta
        const datiGeneraliCitta={
            popolazione: popolazioneTotale,
            superficie: superficieTotale,
            etaMedia: etaMediaTotale,
            soddisfazioneMedia: soddisfazioneTotale,
        };

        //invio la risposta
        res.status(200).json(datiGeneraliCitta);
    }catch(err){
        console.error(err);
        if(err instanceof Error){
            res.status(500).json(JSON.parse(err.message));
        }else{
            res.status(500).json({code: 500, message: "Errore nel server", details: err});
        }
    }
});


export default router;