import db from 'mongoose'; // Import and initialize the database connection
import app from './app';

const PORT = process.env.PORT || 3000; // Define the port for the server

if(!process.env.JWT_SECRET){
    console.error('[ERROR] JWT_SECRET not set');
    process.exit(1);
}
if(!process.env.AVATAR_BASE || !process.env.AVATAR_QUERY){
    console.warn('[WARN] AVATAR_BASE or AVATAR_QUERY not set, will use default values');
    process.env.AVATAR_BASE = 'https://gravatar.com/avatar/';
    process.env.AVATAR_QUERY = 's=400&d=identicon&r=x';
}

// Generate a random secret for the session
process.env.RANDOM_SECRET = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

console.log(`[INFO] Random secret: ${process.env.RANDOM_SECRET}`);

db.startSession().then(()=>{ // Start a session with the database
    console.log("[INFO] Connected to MongoDB"); // Log that the connection was successful
}).catch((err)=>{ 
    console.error("[ERROR] Could not connect to MongoDB", err); 
    process.exit(1);
});


app.listen(PORT, () => {    // Start the server on port 3000
    console.log('[INFO] Server is running at http://localhost:3000');   // Log that the server is running
});