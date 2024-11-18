import express, {Express} from 'express' // Import the express library
import { circoscrizioni, generalInfo, quartieri, session, sondaggi, voti} from './routes';
import { BASE_URL } from './variables';
import { checker } from './utils/token';
// To access the database connection, use db.mongoose for the mongoose object and db.schemas for a object containing the schemas

const app: Express = express(); // Create an express app

app.use(express.json());                                                // Use the express.json middleware to parse JSON bodies
app.use(express.urlencoded({extended: true}));                          // Use the express.urlencoded middleware to parse URL-encoded bodies

/* Debug logs Privacy goes brrrr */
/* app.get(BASE_URL+'/*', (req, res, next) => {
    console.log(`Request @ ${new Date().toISOString()}`);
    console.log(`URI: ${req.url} method: ${req.method}`);
    console.log(`IP: ${req.ip}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    if(req.body) console.log(`Body: ${JSON.stringify(req.body)}`);
    
    next();
}); */

app.route(BASE_URL + '/').get((req, res) => {                                      // Define a route for the root path
    res.send('Hello World!');                                                      // Send "Hello World!" as a response
});

// Imposto il router per le circoscrizioni
app.use(BASE_URL + '/circoscrizioni', circoscrizioni);

// Imposto il router per le circoscrizioni
app.use(BASE_URL + '/quartieri', quartieri);

// Imposto il router per le sessioni
app.use(BASE_URL + '/session', session);

// Imposto il router per le informazioni generali
app.use(BASE_URL + '/generalInfo', generalInfo);



// Imposto l'uso del middleware checker per controllare i token di autenticazione, tutte le route dopo questa riga eseguiranno il controllo del token per assicurarsi che gli utenti siano autenticati
app.use(checker);

// Imposto il router per i voti
app.use(BASE_URL + '/voti', voti);

// Imposto il router per i sondaggi
app.use(BASE_URL + '/sondaggi', sondaggi);


export default app; // Export the app object