import express from 'express';                                           
import db from '../db'; // Import the database connection from the db file
import { Errors, Sondaggi, Utenti, Voti } from '../../types';
import {Types} from "mongoose";
import { BASE_URL, RESPONSE_MESSAGES } from '../variables';

const router = express.Router(); // Create a new router



//rotta per ottenere la lista di sondaggi
router.get('/',async(req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const user: Utenti.User = req.body.user;

    // mi assicuro che i dati dell'autenticazione effettivamente ci siano e altrimenti rispondo con un errore
    // tecnicamente questo non dovrebbe mai succedere perché il caso in cui la richiesta non ha token dovrebbe essere già controllato dal checker middleware
    // Serve per TS che non capisce che user non può essere undefined o null o un non Utente.User
    if(!user){
        const response: Errors ={
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: "Utente non autenticato",
        }
        res.status(401).json(response)
        return;
    }

    //mi assicuro che l'utente che sta facendo la richiesta sia un Amministratore o u sondaggista, altrimenti rispondi con un errore
    if(user.ruolo !== 'Amministratore' && user.ruolo !== 'Sondaggista'){
        const response: Errors ={
            code: 403,
            message: RESPONSE_MESSAGES[403],
            details: "Solo amministratori e sondaggisti hanno il permesso di vedere i sondaggi",
        }
        res.status(403).json(response)
        return;
    }

    try{
        // prendo tutti i sondaggi dal database
        let sondaggiDB = await db.models.Sondaggio.find();

        //filtro sondaggiDB per selezionare solo i sondaggi che l'utente ha il permesso di vedere
        sondaggiDB = sondaggiDB.filter(sondaggio =>
            user.ruolo === 'Amministratore' || ( user.ruolo === 'Sondaggista' && sondaggio.sondaggista.equals(new Types.ObjectId(user.self.split('/').pop())))
        )

        //prendo il parametro deepData, che indica se dovrò restituire sondaggi completi o minimal
        const deepData: boolean = req.query.deepData === 'true';

        //la variabile che restituirò in risposta, potrebbe essere un array di sondaggi completi oppure di sondaggi minimal
        let sondaggi: Sondaggi.Sondaggio[] | Sondaggi.Minimal[];

        //per creare i tipi Sondaggio e Minimal mi servono anche le informazioni sul sondaggista, quindi prendo la lista di sondaggisti dal database e li mappo a tipi Utente.User
        const utentiDB = await db.models.User.find({ruolo: 'Sondaggista'});
        const utenti = utentiDB.map((udb)=> ({
                self:`${BASE_URL}/utenti/${udb._id}`,
                email: udb.email,
                nome: udb.nome,
                cognome: udb.cognome,
                ruolo: udb.ruolo,
                imageUrl: udb.imageUrl
            }
        ))
        //in base al valore di deepData, a sondaggi verrà assegnato un valore diverso 
        if(deepData){
            //se deepData è vero, devo restituire sondaggi completi, ovvero includendo tutte le proprietà di Minimal e anche l'array di voti e di mediaVoti
            //prendo dal database l'array di voti
            const votiDB = await db.models.Voti.find();
            //mappo ogni sondaggioDB a un Sondaggi.Sondaggio 
            sondaggi = sondaggiDB.map(
                sondaggioDB=> getSondaggio(sondaggioDB,votiDB,utenti)
            );
        }else{
            //se deepData è falso, devo solo restituire un array di sondaggi minimal
            //questo si potrebbe fare facilmente usando la funzione getSondaggio() per ottenere un sondaggio completo e poi rimuovere campi per creare un sondaggio minimal, ma per usare quella funzione avrei bisogno di fare una query superflua al database e un sacco di calcolo extra inutile, quindi per risparmiare cre i sondaggi minimal manualmente 

            //mappo i sondaggiDB a sondaggi minimal
            sondaggi = sondaggiDB.map((sondaggioDB)=>{
                //trovo in utenti il Sondaggista che ha creato il sondaggio
                const creatore=utenti.find((u) => new Types.ObjectId(u.self.split('/').pop()).equals(sondaggioDB.sondaggista));

                if(!creatore){
                    const response: Errors = {
                        code: 500,
                        message: RESPONSE_MESSAGES[500],
                        details: `Creatore del sondaggio ${sondaggioDB._id} non trovato`, 
                    };
                    throw new Error(JSON.stringify(response));
                }

                //adesso che ho le informazioni sull'utente, posso creare il sondaggio minimal
                const sondaggioMinimal: Sondaggi.Minimal={
                    self: `${BASE_URL}/sondaggi/${sondaggioDB._id}`,
                    sondaggista: creatore,
                    titolo: sondaggioDB.titolo,
                    dataInizio: sondaggioDB.dataInizio,
                    isAperto: sondaggioDB.isAperto,
                    statoApprovazione: sondaggioDB.statoApprovazione
                };

                return sondaggioMinimal;
            });
        }
        //mando la risposta con la lista dei sondaggi completi o minimal
        res.status(200).json(sondaggi);
    }catch(err: any){
        console.error(err);
        if(err instanceof Error){
            res.status(500).json(JSON.parse(err.message));
        }else{
            res.status(500).json({code: 500, message: RESPONSE_MESSAGES[500], details: err});
        }
    }
});


//rotta per creare un nuovo sondaggio, nel body della richiesta ci saranno i dati di un AddSondaggio
router.post('/',async(req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const user: Utenti.User = req.body.user;
    //mi assicuro che l'utente che sta facendo la richiesta sia un Amministratore o u sondaggista, altrimenti risponde con un errore
    if(user.ruolo !== 'Sondaggista'){
        const response: Errors ={
            code: 403,
            message: RESPONSE_MESSAGES[403],
            details: "Solo sondaggisti possono creare sondaggi",
        }
        res.status(403).json(response)
        return;
    }
    //prendo il titolo e la data di inizio del sondaggio, se questi non sono presenti nel corpo della richiesta rispondo con un errore
    const {titolo}= req.body;
    if(!titolo){
        const response: Errors ={
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: "Campi titolo mancanti",
        }
        res.status(400).json(response)
        return;
    }


    //creo un nuovo sondaggio e lo salvo nel database
    let nuovoSondaggio= new db.models.Sondaggio({
        titolo: titolo,
        dataInizio: new Date(),
        isAperto: true,
        statoApprovazione: 'In attesa', //In attesa dovrebbe essere il valore di default??
        sondaggista: user.self.split('/').pop()
    });
    nuovoSondaggio= await nuovoSondaggio.save(); // @Boss314 è davvero necessario fare nuovoSondaggio= ? non basta solo await nuovoSondaggio.save() ?
    //mando la risposta con l'url della nuova risorsa creata
    res.status(201).location(`${BASE_URL}/sondaggi/${nuovoSondaggio._id}`).send();
});


//rotta per ottenere i dati di un singolo sondaggio
router.get('/:id',async (req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const user: Utenti.User = req.body.user;

    // mi assicuro che i dati dell'autenticazione effettivamente ci siano e altrimenti rispondo con un errore
    // tecnicamente questo non dovrebbe mai succedere perché il caso in cui la richiesta non ha token dovrebbe essere già controllato dal checker middleware
    if(!user){ 
        const response: Errors ={
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: "Utente non autenticato",
        }
        res.status(401).json(response)
        return;
    }

    const {id} = req.params;
    // Controllo che l'id sia valido e se non lo è rispondo con un errore
    if(!Types.ObjectId.isValid(id)){
        const response: Errors ={
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: `L'id ${id} non è valido`,
        }
        res.status(400).json(response)
        return;
    }
    // cerco il sondaggio che è stato richiesto e se non lo trovo rispondo con un errore
    let sondaggioDB = await db.models.Sondaggio.findById(id);
    if(!sondaggioDB){
        const response: Errors = {
            code: 404,
            message: RESPONSE_MESSAGES[404],
            details: `Sondaggio ${id} non trovato nel database`,
        }
        res.status(404).json(response)
        return;
    }


    //mi assicuro che l'utente che sta facendo la richiesta sia un Amministratore o il sondaggista che ha creato il sondaggio, altrimenti rispondo con un errore
    const puoVisualizzare = user.ruolo == 'Amministratore' || (
        user.ruolo == 'Sondaggista' 
        && sondaggioDB.sondaggista.equals(new Types.ObjectId(user.self.split('/').pop()))
    );
    if(!puoVisualizzare){
        const response: Errors ={
            code: 403,
            message: RESPONSE_MESSAGES[403],
            details: "Solo amministratori e il sondaggista creatore hanno il permesso di vedere questo sondaggio",
        }
        res.status(403).json(response)
        return;
    }
    

    //per creare il tipo Sondaggio mi servono anche le informazioni sul sondaggista, quindi prendo la lista di sondaggisti dal database e li mappo a tipi Utente.User
    const utentiDB = await db.models.User.find({ruolo: 'Sondaggista'});
    const utenti = utentiDB.map(udb =>({
            self:`${BASE_URL}/utenti/${udb._id}`,
            email: udb.email,
            nome: udb.nome,
            cognome: udb.cognome,
            ruolo: udb.ruolo,
            imageUrl: udb.imageUrl
        })
    );


    //prendo dal database l'array di voti
    const votiDB = await db.models.Voti.find({sondaggio: sondaggioDB._id});


    // trasformo il sondaggioDB che ho preso dal database in un Sondaggi.Sondaggio da mandare in risposta
    try{
        const sondaggio: Sondaggi.Sondaggio = getSondaggio(sondaggioDB,votiDB,utenti);
        res.status(200).json(sondaggio);
    }catch(err: any){
        console.error(err);
        if(err instanceof Error){
            res.status(500).json(JSON.parse(err.message));
        }else{
            res.status(500).json({code: 500, message: RESPONSE_MESSAGES[500], details: err});
        }
    }
});


//rotta per modificare i dati di un singolo sondaggio, nel body della richiesta ci saranno i dati di un AddSondaggio
router.patch('/:id',async (req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const user: Utenti.User = req.body.user;

    // cerco il sondaggio che è stato richiesto e se non lo trovo rispondo con un errore
    const {id} = req.params;

    if(!Types.ObjectId.isValid(id)){
        const response: Errors ={
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: `L'id ${id} non è valido`,
        }
        res.status(400).json(response)
        return;
    }
    
    //prendo i parametri dal body della richiesta invio un errore se non ci sono
    const {titolo,dataInizio,isAperto} = req.body;
    if(!titolo && !dataInizio && isAperto === undefined){ 
        const response: Errors ={
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: "Nessun campo da modificare specificato, inserire almeno uno tra titolo, dataInizio, isAperto",
        }
        res.status(400).json(response)
        return;
    }
    let sondaggioDB=await db.models.Sondaggio.findById(id);
    if(!sondaggioDB){
        const response: Errors ={
            code: 404,
            message: RESPONSE_MESSAGES[404],
            details: `Sondaggio ${id} non trovato nel database`,
        }
        res.status(404).json(response)
        return;
    }

    //mi assicuro che l'utente che sta facendo la richiesta sia il sondaggista che ha creato il sondaggio, altrimenti rispondo con un errore
    const puoModificare = 
        user.ruolo === 'Sondaggista' && 
        sondaggioDB.sondaggista.equals(new Types.ObjectId(user.self.split('/').pop())) && sondaggioDB.isAperto;
    
    if(!puoModificare){
        const response: Errors ={
            code: 403,
            message: RESPONSE_MESSAGES[403],
            details: "Solo il sondaggista creatore ha il permesso di modificare questo sondaggio, e solo se è aperto",
        }
        res.status(403).json(response)
        return;
    }
    // Imposto i nuovi valori del sondaggio solo se sono stati passati nel body della richiesta
    let modifiche: Partial<Sondaggi.DB> = {};
    if(titolo) modifiche.titolo = titolo;
    if(dataInizio) modifiche.dataInizio = new Date(dataInizio);
    if(isAperto !== undefined) modifiche.isAperto = isAperto;

    //applico le modifiche al sondaggio
    await db.models.Sondaggio.findByIdAndUpdate(sondaggioDB._id,modifiche);

    //invio la risposta di successo
    res.status(200).location(`${BASE_URL}/sondaggi/${sondaggioDB._id}`).send();
});


//rotta per eliminare un singolo sondaggio
router.delete('/:id',async (req,res)=>{
    // ricavo le informazioni sull'autenticazione dell'utente dal token decodificato dalla funzione checker in token.ts
    const user: Utenti.User = req.body.user;

    // cerco il sondaggio che è stato richiesto e se non lo trovo rispondo con un errore
    const {id} = req.params;
    if(!Types.ObjectId.isValid(id)){
        const response: Errors ={
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: `L'id ${id} non è valido`,
        }
        res.status(400).json(response)
        return;
    }
    let sondaggioDB=await db.models.Sondaggio.findById(id);
    if(!sondaggioDB){
        const response: Errors ={
            code: 404,
            message: RESPONSE_MESSAGES[404],
            details: `Sondaggio ${id} non trovato nel database`,
        }
        res.status(404).json(response)
        return;
    }


    //mi assicuro che l'utente che sta facendo la richiesta sia il sondaggista che ha creato il sondaggio, altrimenti rispondo con un errore
    const puoEliminare=(user.ruolo == 'Sondaggista' && sondaggioDB.sondaggista.equals(new Types.ObjectId(user.self.split('/').pop())) && sondaggioDB.isAperto);
    if(!puoEliminare){
        const response: Errors ={
            code: 403,
            message: RESPONSE_MESSAGES[403],
            details: "Solo il sondaggista creatore ha il permesso di eliminare questo sondaggio, e solo se è aperto",
        }
        res.status(403).json(response)
        return;
    }


    //elimino il sondaggio dal database
    await db.models.Sondaggio.findByIdAndDelete(sondaggioDB._id);
    // elimino tutti i voti relativi al sondaggio appena eliminato
    await db.models.Voti.deleteMany({sondaggio: sondaggioDB._id});

    //invio la risposta di successo
    res.status(204).send();
});





/**
 * Funzione che crea un oggetto di tipo Sondaggi.Sondaggio da uno di tipo Sondaggi.DB
 * @param {Sondaggi.DB} sondaggioDB oggetto sondaggio preso dal database da trasformare
 * @param {Voti.DB[]} votiDB array di voti presi dal database
 * @param {Utenti.User[]} utenti array di utenti
 * @returns un oggetto contenente i dati completi di quel sondaggio, inclusi l'utente creatore del sondaggio, la lista di voti nel sondaggio, e la lista di medie per quartiere nel sondaggio
 */
function getSondaggio(sondaggioDB: Sondaggi.DB,votiDB: Voti.DB[],utenti: Utenti.User[]){
     //trovo in utenti il sondaggista che ha creato il sondaggio
    const creatore=utenti.find((u)=> new Types.ObjectId(u.self.split('/').pop()).equals(sondaggioDB.sondaggista) );

    if(!creatore){
        const response: Errors = {
            code: 500,
            message: RESPONSE_MESSAGES[500],
            details: `Creatore del sondaggio ${sondaggioDB._id} non trovato`, 
        };
        throw new Error(JSON.stringify(response));
    }
    const votiSondaggio: Voti.DB[] = votiDB.filter(
        (voto)=>voto.sondaggio.equals(sondaggioDB._id)
    );
    //per ogni voto ne estraggo id del quartiere al quale si riferisce
    const idQuartieri = votiSondaggio.map((voto)=>voto.quartiere);
    //rimuovo i duplicati per ottenere una lista di id di ogni quartiere per il quale esiste almeno un voto nel sondaggio
    const idQuartieriUnici: Types.ObjectId[] = [];
    idQuartieri.forEach((idQuart)=>{
        if(!idQuartieriUnici.find((idQu)=>idQu.equals(idQu))){
            idQuartieriUnici.push(idQuart);
        }
    });

    //mappo ogni quartiere nel sondaggio a un oggetto di tipo Voti.Media
    const medieVoti: Voti.Media[] = idQuartieriUnici.map((idQuart)=>{
        //trovo i voti del sondaggio attuale che si riferiscono al quartiere attuale
        const votiDelSondaggioDelQuartiere = votiSondaggio.filter(
            (v)=>v.quartiere.equals(idQuart)
        );

        //trovo la media di tutti i voti del quartiere
        const media = votiDelSondaggioDelQuartiere.length > 0 ? 
            votiDelSondaggioDelQuartiere.reduce(
                (acc, curr) => acc + curr.voto, 0
            ) / votiDelSondaggioDelQuartiere.length 
            : 0;

        const mediaQuartiere: Voti.Media={
            media: media,
            quartiere: `${BASE_URL}/quartieri/${idQuart}`
        }

        return mediaQuartiere;
    });

    //mappo ogni voto del sondaggio in oggetti di tipo Voti.Voto
    const voti: Voti.Voto[]= votiSondaggio.map(votoDB=>({
            self: `${BASE_URL}/voti/${votoDB._id}`,
            quartiere:  `${BASE_URL}/quartieri/${votoDB.quartiere}`,
            eta: votoDB.eta,
            voto: votoDB.voto,
            dataOra: votoDB.dataOra
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