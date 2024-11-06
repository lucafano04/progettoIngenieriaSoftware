import db from './db'                                                   // Import and initialize the database connection
// To access the database connection, use db.mongoose for the mongoose object and db.schemas for a object containing the schemas

async function getCircoscrizioni() {                                    // Define the getCircoscrizioni function
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
});