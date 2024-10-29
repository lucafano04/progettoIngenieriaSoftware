import mongoose from 'mongoose';
import schemas from './schemas.js';

if(process.env.MONGO_DB_USER === undefined || process.env.MONGO_DB_PASS === undefined || process.env.MONGO_DB_CLUSTER === undefined || process.env.MONGO_DB_APP_NAME === undefined) {
    console.log(process.env);
    console.error("MONGO_DB_USER, MONGO_DB_PASS, MONGO_DB_CLUSTER and MONGO_DB_APP_NAME must be defined in .env file");
    process.exit(1);
}
mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_DB_APP_NAME}`);

mongoose.connection.on('error', ()=>{
    console.error("[ERROR] Connection to MongoDB failed");
    process.exit(1);
});

mongoose.connection.on('open', ()=>{
    console.log("[INFO] Connected to MongoDB");
});

// Esempio di creazione di un model per la collezione Circoscrizione
const circoscrizioni = mongoose.model('Circoscrizione', schemas.circoscrizione);


const models = {
    circoscrizioni
};
const exports = {
    mongoose,
    models,
    schemas
};

export default exports;
export {
    mongoose,
    models,
    schemas
};
