import db from './db' // Import and initialize the database connection
import express, {Express} from 'express' // Import the express library
import { quartieri } from './routes';
// To access the database connection, use db.mongoose for the mongoose object and db.schemas for a object containing the schemas

const BASE_URL = process.env.BASE_API || '/api/v1'; // Define the base URL for the API
const PORT = process.env.PORT || 3000; // Define the port for the server

const app: Express = express(); // Create an express app

db.mongoose.startSession().then(()=>{ // Start a session with the database
    console.log("[INFO] Connected to MongoDB"); // Log that the connection was successful
});
/* async function getCircoscrizioni() {                                    // Define the getCircoscrizioni function
    const circoscrizioni = await db.models.Circoscrizione.find();       // Get all the Circoscrizioni 
    console.log(circoscrizioni);                                        // Log the Circoscrizioni
    const users = await db.models.User.find();                         // Get all the Users
    console.log(users);                                                 // Log the Users
    const quartieri = await db.models.Quartiere.find();                // Get all the Quartieri
    console.log(quartieri);                                             // Log the Quartieri
    const voti = await db.models.Voti.find();                          // Get all the Voti
    console.log(voti);                                                  // Log the Voti
    const sondaggi = await db.models.Sondaggio.find();                 // Get all the Sondaggi
    console.log(sondaggi);                                              // Log the Sondaggi

}

getCircoscrizioni().then(()=>{                                          // Call the getCircoscrizioni function
    console.log("Done");                                                // Log "Done" when the function is done
    db.mongoose.connection.close();                                     // Close the connection to the database so the program can exit
}); */

app.use(express.json());                                                // Use the express.json middleware to parse JSON bodies
app.use(express.urlencoded({extended: true}));                          // Use the express.urlencoded middleware to parse URL-encoded bodies


app.route(BASE_URL + '/').get((req, res) => {                                      // Define a route for the root path
    res.send('Hello World!');                                           // Send "Hello World!" as a response
});

app.use(BASE_URL + '/quartieri',quartieri);

app.listen(PORT, () => {                            // Start the server on port 3000
    console.log('[INFO] Server is running at https://localhost:3000');                      // Log that the server is running
});