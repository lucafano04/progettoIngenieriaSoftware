import express from 'express';                                           
import db from '../db'; // Import the database connection from the db file
import { Circoscrizioni, Errors, Quartieri, Sondaggi, Utenti, Voti } from '../../types';
import {Types} from "mongoose";
import { BASE_URL } from '../variables';
import { Db } from 'mongodb';

const router = express.Router(); // Create a new router



//rotta per ottenere la lista di sondaggi
router.get('/',async(req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const {user} = req.body;

    // mi assicuro che i dati dell'autenticazione effettivamente ci siano e altrimenti rispondo con un errore
    // tecnicamente questo non dovrebbe mai succedere perché il caso in cui la richiesta non ha token dovrebbe essere già controllato dal checker middleware
    if(!user){ 
        const response: Errors ={
            code: 401,
            message: "Unauthorized",
            details: "Utente non autenticato",
        }
        res.status(401).json(response)
        return;
    }

    //mi assicuro che l'utente che sta facendo la richiesta sia un amministratore o u sondaggista, altrimenti risponod con un errore
    if(user.ruolo!='Amministratore' && user.ruolo!='Sondaggista'){
        const response: Errors ={
            code: 403,
            message: "Forbidden",
            details: "Solo amministratori e sondaggisti hanno il permesso di vedere i sondaggi",
        }
        res.status(403).json(response)
        return;
    }


    // prendo tutti i sondaggi dal database
    let sondaggiDB=await db.models.Sondaggio.find();

    //filtro sondaggiDB per selezionare solo i sondaggi che l'utente ha il permesso di vedere
    sondaggiDB= sondaggiDB.filter(async (sond) => {
        return user.ruolo=='Amministratore' || (user.ruolo=='Sondaggista' && user._id == sond.sondaggista);
    })

    //prenod il parametro deepData, che indica se dovrò restituire sondaggi completi o minimal
    const {deepData} = req.query;


    //la variabile che restituirò in risposta, potrebbe essere un array di sondaggi completi oppure di sondaggi minimal
    let sondaggi: Sondaggi.Sondaggio[] | Sondaggi.Minimal[];

    //per creare i tipi Sondaggio e Minimal mi servono anche le informazioni sul sondaggista, quindi prendo la lista di sondaggisti dal database e li mappo a tipi Utente.User
    const utentiDB=await db.models.User.find({ruolo: 'Sondaggista'});
    const utenti=await Promise.all(utentiDB.map(async (udb)=>{
        const u: Utenti.User={
            self:`${BASE_URL}/utenti/${udb._id}`,
            email: udb.email,
            nome: udb.nome,
            cognome: udb.cognome,
            ruolo: udb.ruolo,
            imageUrl: udb.imageUrl
        }
    
        return u;
    }))


    try{
        //in base al valore di deepData, a sondaggi verrà assegnato un valore diverso 
        if(!deepData){
            //se deepdata è falso, devo solo restituire un arrai di sondaggi minimal
            //questo si potrebbe fare facilmente usando la funzione getSondaggio() per ottenere un sondaggio completo e poi rimuovere campi per creare un sondaggio minimal, ma per usare quella funzione avrei bisogno di fare una query superflua al database e un sacco di calcolo extra inutile, quindi per risparmiare cre i sondaggi minimal manualmente 

            //mappo i sondaggiDB a sondaggi minimal
            sondaggi= await Promise.all(sondaggiDB.map(async (sondDB)=>{
                //trovo in utenti il sondaggista che ha creato il sondaggio
                const creatore=utenti.find((u)=> new Types.ObjectId(u.self.split('/').pop()).equals(sondDB.sondaggista) );

                if(!creatore){
                    const response: Errors = {
                        code: 500,
                        message: "Errore nel server",
                        details: `Creatore del sondaggio ${sondDB._id} non trovato`, 
                    };
                    throw new Error(JSON.stringify(response));
                }

                //adesso che ho le informazioni sull'utente, posso creare il sondaggio minimal
                const sondMin: Sondaggi.Minimal={
                    self: `${BASE_URL}/sondaggi/${sondDB._id}`,
                    sondaggista: creatore,
                    titolo: sondDB.titolo,
                    dataInizio: sondDB.dataInizio,
                    isAperto: sondDB.isAperto,
                    statoApprovazione: sondDB.statoApprovazione
                };

                return sondMin;
            }));
        }else{
            //se deepData è vero, devo restituire sondaggi completi, ovvero includendo tutte le proprietà di Minimal e anch l'array di voti e di mediaVoti

            //prendo dal database l'array di voti
            const votiDB=await db.models.Voti.find();

            //mappo ogni sondaggioDB a un Sondaggi.Sondaggio 
            sondaggi= await Promise.all(sondaggiDB.map( async (sondDB)=> getSondaggio(sondDB,votiDB,utenti)));
        }



        //mando la risposta con la lista dei sondaggi
        res.status(200).json(sondaggi);

    }catch(err: any){
        console.error(err);
        if(err instanceof Error){
            res.status(500).json(JSON.parse(err.message));
        }else{
            res.status(500).json({code: 500, message: "Errore nel server", details: err});
        }
    }
});


//rotta per creare un nuovo sondaggio, nel body della richiesta ci saranno i dati di un AddSondaggio
router.post('/',async(req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const {user} = req.body;

    // mi assicuro che i dati dell'autenticazione effettivamente ci siano e altrimenti rispondo con un errore
    // tecnicamente questo non dovrebbe mai succedere perché il caso in cui la richiesta non ha token dovrebbe essere già controllato dal checker middleware
    if(!user){ 
        const response: Errors ={
            code: 401,
            message: "Unauthorized",
            details: "Utente non autenticato",
        }
        res.status(401).json(response)
        return;
    }

    //mi assicuro che l'utente che sta facendo la richiesta sia un amministratore o u sondaggista, altrimenti risponod con un errore
    if(user.ruolo!='Sondaggista'){
        const response: Errors ={
            code: 403,
            message: "Forbidden",
            details: "Solo sondaggisti possono creare sondaggi",
        }
        res.status(403).json(response)
        return;
    }


    //perndo il titolo e la data di inizio del sondaggio, se questi non sono presenti nel corpo della richiesta rispondo con un errore
    const {titolo, dataInizio}= req.body;
    if(!titolo || !dataInizio){
        const response: Errors ={
            code: 400,
            message: "Bad Request",
            details: "Campi titolo, dataInizio mancanti",
        }
        res.status(400).json(response)
        return;
    }


    //creo un nuovo sondaggio e lo salvo nel database
    let nuovoSondaggio= new db.models.Sondaggio({
        titolo: titolo,
        dataInizio: new Date(dataInizio),
        isAperto: true,
        statoApprovazione: 'In attesa', //In attesa dovrebbe essere il valore di default??
        sondaggista: user.id
    });
    nuovoSondaggio= await nuovoSondaggio.save();

    //mando la risposta con l'url della nuova risorsa creata
    res.status(201).location(`${BASE_URL}/sondaggi/${nuovoSondaggio._id}`);
});


//rotta per ottenere i dati di un singolo sondaggio
router.get(':id',async (req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const {user} = req.body;

    // mi assicuro che i dati dell'autenticazione effettivamente ci siano e altrimenti rispondo con un errore
    // tecnicamente questo non dovrebbe mai succedere perché il caso in cui la richiesta non ha token dovrebbe essere già controllato dal checker middleware
    if(!user){ 
        const response: Errors ={
            code: 401,
            message: "Unauthorized",
            details: "Utente non autenticato",
        }
        res.status(401).json(response)
        return;
    }


    // cerco il sondaggio che è stato richiesto e se non lo trovo rispondo con un errore
    const {id} = req.params;
    let sondaggioDB=await db.models.Sondaggio.findById(id);
    if(!sondaggioDB){
        const response: Errors ={
            code: 404,
            message: "Not Found",
            details: `Sondaggio ${id} non trovato nel database`,
        }
        res.status(404).json(response)
        return;
    }


    //mi assicuro che l'utente che sta facendo la richiesta sia un amministratore o il sondaggista che ha creato il sondaggio, altrimenti rispondo con un errore
    const puoVisualizzare=user.ruolo=='Amministratore' || (user.ruolo=='Sondaggista' && sondaggioDB._id.equals(user._id));
    if(!puoVisualizzare){
        const response: Errors ={
            code: 403,
            message: "Forbidden",
            details: "Solo amministratori e il sondaggista creatore hanno il permesso di vedere questo sondaggio",
        }
        res.status(403).json(response)
        return;
    }
    

    //per creare il tipo Sondaggio mi servono anche le informazioni sul sondaggista, quindi prendo la lista di sondaggisti dal database e li mappo a tipi Utente.User
    const utentiDB=await db.models.User.find({ruolo: 'Sondaggista'});
    const utenti=await Promise.all(utentiDB.map(async (udb)=>{
        const u: Utenti.User={
            self:`${BASE_URL}/utenti/${udb._id}`,
            email: udb.email,
            nome: udb.nome,
            cognome: udb.cognome,
            ruolo: udb.ruolo,
            imageUrl: udb.imageUrl
        }
    
        return u;
    }))


    //prendo dal database l'array di voti
    const votiDB=await db.models.Voti.find();


    // trasformo il sondaggioDB che ho preso dal database in un Sondaggi.Sondaggio da mandare in risposta
    try{
        const sondaggio: Sondaggi.Sondaggio = await getSondaggio(sondaggioDB,votiDB,utenti);
        res.status(200).json(sondaggio);
    }catch(err: any){
        console.error(err);
        if(err instanceof Error){
            res.status(500).json(JSON.parse(err.message));
        }else{
            res.status(500).json({code: 500, message: "Errore nel server", details: err});
        }
    }
});


//rotta per modificare i dati di un singolo sondaggio, nel body della richiesta ci saranno i dati di un AddSondaggio
router.patch(':id',async (req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const {user} = req.body;

    // mi assicuro che i dati dell'autenticazione effettivamente ci siano e altrimenti rispondo con un errore
    // tecnicamente questo non dovrebbe mai succedere perché il caso in cui la richiesta non ha token dovrebbe essere già controllato dal checker middleware
    if(!user){ 
        const response: Errors ={
            code: 401,
            message: "Unauthorized",
            details: "Utente non autenticato",
        }
        res.status(401).json(response)
        return;
    }


    // cerco il sondaggio che è stato richiesto e se non lo trovo rispondo con un errore
    const {id} = req.params;
    let sondaggioDB=await db.models.Sondaggio.findById(id);
    if(!sondaggioDB){
        const response: Errors ={
            code: 404,
            message: "Not Found",
            details: `Sondaggio ${id} non trovato nel database`,
        }
        res.status(404).json(response)
        return;
    }


    //mi assicuro che l'utente che sta facendo la richiesta sia il sondaggista che ha creato il sondaggio, altrimenti rispondo con un errore
    const puoModificare=(user.ruolo=='Sondaggista' && sondaggioDB._id.equals(user._id));
    if(!puoModificare){
        const response: Errors ={
            code: 403,
            message: "Forbidden",
            details: "Solo il sondaggista creatore ha il permesso di modificare questo sondaggio",
        }
        res.status(403).json(response)
        return;
    }



    //prendo i parametri dal body della richiesta invio un errore se non ci sono
    const {titolo,dataInizio,isAperto} = req.body;
    if(!titolo || !dataInizio || isAperto===undefined){ 
        const response: Errors ={
            code: 400,
            message: "Bad Request",
            details: "Campi titolo, dataInizio, isAperto mancanti",
        }
        res.status(400).json(response)
        return;
    }

    //modifico i valori dei campi del sondaggio
    sondaggioDB.titolo=titolo;
    sondaggioDB.dataInizio=dataInizio;
    sondaggioDB.isAperto=isAperto;

    //salvo le modifiche nel database
    sondaggioDB= await sondaggioDB.save();

    //invio la risposta di successo
    res.status(200).location(`${BASE_URL}/sondaggi/${sondaggioDB._id}`);
});


//rotta per eliminare un singolo sondaggio
router.delete(':id',async (req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const {user} = req.body;

    // mi assicuro che i dati dell'autenticazione effettivamente ci siano e altrimenti rispondo con un errore
    // tecnicamente questo non dovrebbe mai succedere perché il caso in cui la richiesta non ha token dovrebbe essere già controllato dal checker middleware
    if(!user){ 
        const response: Errors ={
            code: 401,
            message: "Unauthorized",
            details: "Utente non autenticato",
        }
        res.status(401).json(response)
        return;
    }


    // cerco il sondaggio che è stato richiesto e se non lo trovo rispondo con un errore
    const {id} = req.params;
    let sondaggioDB=await db.models.Sondaggio.findById(id);
    if(!sondaggioDB){
        const response: Errors ={
            code: 404,
            message: "Not Found",
            details: `Sondaggio ${id} non trovato nel database`,
        }
        res.status(404).json(response)
        return;
    }


    //mi assicuro che l'utente che sta facendo la richiesta sia il sondaggista che ha creato il sondaggio, altrimenti rispondo con un errore
    const puoEliminare=(user.ruolo=='Sondaggista' && sondaggioDB._id.equals(user._id));
    if(!puoEliminare){
        const response: Errors ={
            code: 403,
            message: "Forbidden",
            details: "Solo il sondaggista creatore ha il permesso di eliminare questo sondaggio",
        }
        res.status(403).json(response)
        return;
    }


    //elimino il sondaggio dal database
    await db.models.Sondaggio.findByIdAndDelete(sondaggioDB._id);

    //invio la risposta di successo
    res.status(204).send();
});





/**
 * Funzione che crea un oggetto di tipo Sondaggi.Sondaggio da uno di tipo Sondaggi.DB
 * @param {Sondaggi.DB} SondaggioDB oggetto sondaggio preso dal database da trasformare
 * @param {Voti.DB[]} votiDB array di voti presi dal database
 * @param {Utenti.User[]} utenti array di utenti
 * @returns un oggetto contenente i dati completi di quel sondaggio, inclusi l'utene creatore del sondaggio, la lista di voti nel sondaggio, e la lista di medie per quartiere nel sondaggio
 */
async function getSondaggio(sondaggioDB: Sondaggi.DB,votiDB: Voti.DB[],utenti: Utenti.User[]){
     //trovo in utenti il sondaggista che ha creato il sondaggio
    const creatore=utenti.find((u)=> new Types.ObjectId(u.self.split('/').pop()).equals(sondaggioDB.sondaggista) );

    if(!creatore){
        const response: Errors = {
            code: 500,
            message: "Errore nel server",
            details: `Creatore del sondaggio ${sondaggioDB._id} non trovato`, 
        };
        throw new Error(JSON.stringify(response));
    }

    //trovo l'array di tutti i voti che appartengono al sondaggio s
    const votiDelSondaggio=votiDB.filter(async (v)=>v.sondaggio.equals(sondaggioDB._id));

    //per ogni voto ne estraggo id del quartiere al quale si riferisce
    const idQuartieri=await Promise.all(votiDelSondaggio.map( async (voto)=>voto.quartiere));
    //rimuovo i duplicati per ottenere una lista di id di ogni quartiere per il quale esiste almeno un voto nel sondaggio
    const idQuartieriunici= idQuartieri.filter((item, index) => idQuartieri.indexOf(item) === index);

    //mappo ogni quartiere nel sondaggio a un oggetto di tipo Voti.Media
    const medieVoti: Voti.Media[]=await Promise.all(idQuartieriunici.map(async (idQuart)=>{
        //trovo i voti del sondaggio attuale che si riferiscono al quartiere attuale
        const votiDelSondaggioDelQuartiere=votiDelSondaggio.filter(async (v)=>v.quartiere.equals(idQuart));

        //trovo la media di tutti i voti del quartiere
        const media=votiDelSondaggioDelQuartiere.length > 0 ? votiDelSondaggioDelQuartiere.reduce((acc, curr) => acc + curr.voto, 0) / votiDelSondaggioDelQuartiere.length : 0;

        const mediaQuartiere: Voti.Media={
            media: media,
            quartiere: `${BASE_URL}/quartieri/${idQuart}`
        }

        return mediaQuartiere;
    }));

    //mappo ogni voto del sondaggio in oggetti di tipo Voti.Voto
    const voti: Voti.Voto[]=await Promise.all(votiDelSondaggio.map(async(votoDB)=>{
        const ris: Voti.Voto={
            self: `${BASE_URL}/voti/${votoDB._id}`,
            quartiere:  `${BASE_URL}/quartieri/${votoDB.quartiere}`,
            eta: votoDB.eta,
            voto: votoDB.voto,
            dataOra: votoDB.dataOra
        };
        return ris;
    }));


    //combino i dati in un oggetto di tipo Sondaggi.Sondaggio
    const sondaggio: Sondaggi.Sondaggio={
        self: `${BASE_URL}/sondaggi/${sondaggioDB._id}`,
        sondaggista: creatore,
        voti: voti,
        mediaVoti: medieVoti,
        titolo: sondaggioDB.titolo,
        dataInizio: sondaggioDB.dataInizio,
        isAperto: sondaggioDB.isAperto,
        statoApprovazione: sondaggioDB.statoApprovazione
    }

    return sondaggio;
}




export default router;