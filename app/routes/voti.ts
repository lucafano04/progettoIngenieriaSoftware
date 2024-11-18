import express from 'express';                                           
import db from '../db'; // Import the database connection from the db file
import {Errors, Utenti, Voti } from '../../types';
import { BASE_URL, RESPONSE_MESSAGES } from '../variables';
import { Types } from 'mongoose';

const router = express.Router(); // Create a new router


//rotta per ottenere un array di tutti i voti appartenenti a un dato sondaggio
router.get('/', async (req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const user: Utenti.User = req.body.user;

    // ricavo l'id del sondaggio di cui voglio trovare i voti
    const idSondaggio = req.query.idSondaggio as string;
    // controllo che sie effettivamente stato passato un sondaggio come parametro, altrimenti rispondo con un errore
    if(!idSondaggio){
        const response: Errors ={
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: "Parametro idSondaggio mancante",
        }
        res.status(400).json(response)
        return;
    }
    if(!Types.ObjectId.isValid(idSondaggio)){
        const response: Errors = {
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: `Il parametro idSondaggio ${idSondaggio} non è un ObjectID valido`,
        }
        res.status(400).json(response);
        return;
    }


    //adesso che so che idSondaggio non è undefined, provo a trovare quel sondaggio
    const sondaggioDB= await db.models.Sondaggio.findById(idSondaggio);

    //controllo che il sondaggio esista altrimenti rispondo con un errore
    if(!sondaggioDB){
        const response: Errors ={
            code: 404,
            message: RESPONSE_MESSAGES[404],
            details: `Sondaggio ${idSondaggio} non trovato`,
        }
        res.status(404).json(response)
        return;
    }

    //l'utente ha il diritto a visualizzare i voti presenti nel sondaggio se e solo se è un amministratore o il sondaggista che ha creato quel sondaggio
    const puoVisualizzare = (user.ruolo == 'Amministratore') || (user.ruolo == 'Sondaggista' && sondaggioDB.sondaggista.equals(new Types.ObjectId(user.self.split('/').pop())));

    //se l'utente non è autorizzato a vedere i dati del sondaggio richiesto rispondo con un errore
    if(!puoVisualizzare){
        const response: Errors ={
            code: 403,
            message: RESPONSE_MESSAGES[403],
            details: `L'utente ${user.self.split("/").pop()} non ha il permesso di accedere al sondaggio ${idSondaggio}`,
        }
        res.status(403).json(response)
        return;
    }


    try{

        //trovo nel database l'array di voti che appartengono al sondaggio che sto cercando
        const votiDB= await db.models.Voti.find({sondaggio: idSondaggio});
        
        //combino i dati di votiDB con i nomi dei quartieri per creare una risposta di tipo Voti.Voto
        const voti=votiDB.map((votoDB)=>({
                self: `/api/v1/voti/${votoDB._id}`,
                quartiere: `/api/v1/quartieri/${votoDB.quartiere}`,
                eta: votoDB.eta,
                voto: votoDB.voto,
                dataOra: votoDB.dataOra
            }));

        //invio in risposta i voti
        res.status(200).json(voti);

    }catch(err: any){
        console.error(err);
        if(err instanceof Error){
            res.status(500).json(JSON.parse(err.message));
        }else{
            res.status(500).json({code: 500, message: "Errore nel server", details: err});
        }
    }
});



//rotta per aggiungere a un determinato sondaggio un voto inviato dall'utente
router.post('/',async(req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const {user} = req.body;

    // mi assicuro che i dati dell'autenticazione effettivamente ci siano e altrimenti rispondo con un errore
    if(!user){
        const response: Errors ={
            code: 401,
            message: "Unauthorized",
            details: "Utente non autenticato",
        }
        res.status(401).json(response)
        return;
    }

    // ricavo l'id del sondaggio di cui voglio trovare i voti
    const {idSondaggio} = req.query;

    // controllo che sie effettivamente stato passato un sondaggio come parametro, altrimenti rispondo con un errore
    if(!idSondaggio){
        const response: Errors ={
            code: 404,
            message: "Not Found",
            details: "Parametro idSondaggio mancante",
        }
        res.status(404).json(response)
        return;
    }


    //adesso che so che idSondaggio non è undefined, provo a trovare quel sondaggio
    const sondaggioDB= await db.models.Sondaggio.findById(idSondaggio);

    //controllo che il sondaggio esista altrimenti rispondo con un errore
    if(!sondaggioDB){
        const response: Errors ={
            code: 404,
            message: "Not Found",
            details: `Sondaggio ${idSondaggio} non trovato`,
        }
        res.status(404).json(response)
        return;
    }

    //l'utente ha il diritto ad aggiungere voti al sondaggio se e solo se è il sondaggista che ha creato quel sondaggio
    const puoAggiungere = (user.ruolo == 'Sondaggista' && sondaggioDB.sondaggista.equals(user._id));

    //se l'utente non è autorizzato a vedere i dati del sondaggio richiesto rispondo con un errore
    if(!puoAggiungere){
        const response: Errors ={
            code: 403,
            message: "Forbidden",
            details: `L'utente ${user._id} non ha il permesso di accedere al sondaggio ${idSondaggio}`,
        }
        res.status(403).json(response)
        return;
    }

    //ricavo i dati su eta del cittadino che ha votato, voto del cittadino, e quartiere a cui si riverisce il voto dal body della richeista
    const {eta,voto,quartiere} = req.body;

    //mi assicuro che tutti i dati siano presenti e rispondo con un errore in caso contrario
    if(!eta || !voto || !quartiere){
        const response: Errors ={
            code: 400,
            message: "Bad Request",
            details: `Campi età, voto, quartiere mancanti`,
        }
        res.status(400).json(response)
        return;
    }
    //controllo che l'età non sia un numero negativo
    if(eta<0){
        const response: Errors ={
            code: 400,
            message: "Bad Request",
            details: `Valore età ${eta} invalido`,
        }
        res.status(400).json(response)
        return;
    }
    //controllo che il voto sia tra 1 e 5
    if(voto<1 || voto>5){
        const response: Errors ={
            code: 400,
            message: "Bad Request",
            details: `Valore voto ${voto} invalido`,
        }
        res.status(400).json(response)
        return;
    }

    //cerco il quartiere richiest nel database e se non esiste rispondo con un errore
    const quartiereDB= await db.models.Quartiere.findById(quartiere);
    if(!quartiereDB){
        const response: Errors ={
            code: 400,
            message: "Bad Request",
            details: `Quartiere ${quartiere} non esistente nel database`,
        }
        res.status(400).json(response)
        return;
    }

    //creo un nuovo oggetto dello schema db.models.Voti e lo salvo nel database
    let nuovoVoto= new db.models.Voti({
        eta: eta,
        voto: voto,
        quartiere: quartiere,
        dataOra: new Date(),
        sondaggio: idSondaggio,
    });
    nuovoVoto= await nuovoVoto.save();



    //mando la risposta con l'url della nuova risorsa creata
    res.status(201).location(`${BASE_URL}/voti/${nuovoVoto._id}`);
});





//rotta per eliminare un voto specifico, un voto può essere eliminato solo dall'utente sondaggista che ha creato il sondaggio al quale il voto appartiene
router.delete('/:idVoto',async (req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const utente = req.body.user;

    // mi assicuro che i dati dell'autenticazione effettivamente ci siano e altrimenti rispondo con un errore
    if(!utente){
        const response: Errors ={
            code: 401,
            message: "Unauthorized",
            details: "Utente non autenticato",
        }
        res.status(401).json(response)
        return;
    }

    try{
        //trovo l'id del voto da eliminare dai parametri della richiesta
        const {idVoto} = req.params;
        
        //cerco il voto da eliminare nel database, se non lo trovo rispondo con un errore
        const votoDB=await db.models.Voti.findById(idVoto);
        if(!votoDB){
            const response: Errors ={
                code: 404,
                message: "Not Found",
                details: `Voto ${idVoto} non trovato`,
            }
            res.status(404).json(response)
            return;
        }

        //trovo il sondaggio a cui appartiene il voto per assicurarmi che l'utente che fa la richiesta sia il sondaggista giusto
        const sondaggioDB=await db.models.Sondaggio.findById(votoDB.sondaggio);

        if(!sondaggioDB){
            const response: Errors = {
                code: 500,
                message: "Errore nel server",
                details: `Il voto ${idVoto} ha sondaggio: ${votoDB.sondaggio} ma questo sondaggio non esiste nel database`, 
            };
            throw new Error(JSON.stringify(response));
        }

        //l'utente ha il diritto ad eliminare un voto se e solo se è il sondaggista che ha creato il sondaggio a cui appartiene il voto
        const puoEliminare = (utente.ruolo == 'Sondaggista' && utente._id == sondaggioDB.sondaggista);

        //se l'utente non è autorizzato eliminare il voto richiesto rispondo con un errore
        if(!puoEliminare){
            const response: Errors ={
                code: 403,
                message: "Forbidden",
                details: `L'utente ${utente._id} non ha il permesso di accedere al sondaggio ${votoDB.sondaggio}`,
            }
            res.status(403).json(response)
            return;
        }

        //elimino il voto dal database
        db.models.Voti.findByIdAndDelete(idVoto);
        
        //mando la risposta di successo eliminazione
        res.status(204).send();
    }catch(err: any){
        console.error(err);
        if(err instanceof Error){
            res.status(500).json(JSON.parse(err.message));
        }else{
            res.status(500).json({code: 500, message: "Errore nel server", details: err});
        }
    }
});



export default router;