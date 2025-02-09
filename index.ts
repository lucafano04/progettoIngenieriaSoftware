import db from 'mongoose'; // Import and initialize the database connection
import app from './app';
import { checkTokens } from './app/utils/token';

const PORT = process.env.PORT || 3000; // Define the port for the server

if(!process.env.JWT_SECRET){
    console.error('[ERROR] JWT_SECRET not set');
    process.exit(1);
}

// Generate a random secret for the session



db.startSession().then(()=>{ // Start a session with the database
    console.log("[INFO] Connected to MongoDB"); // Log that the connection was successful
}).catch((err)=>{ 
    console.error("[ERROR] Could not connect to MongoDB", err); 
    process.exit(1);
});


app.listen(PORT, () => {    // Start the server on port 3000
    console.log('[INFO] Server is running at http://localhost:3000');   // Log that the server is running
});


// Imposto una funzione che chiama in automatico 
checkTokens();

// Export the app for testing purposes
export default app;