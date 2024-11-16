import express, {Express} from 'express' // Import the express library
import { circoscrizioni, generalInfo, quartieri, session } from './routes';
// To access the database connection, use db.mongoose for the mongoose object and db.schemas for a object containing the schemas

const BASE_URL = process.env.BASE_API || '/api/v1'; // Define the base URL for the API

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


export default app; // Export the app object