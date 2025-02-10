// Questo file è un file di configurazione che contiene le variabili d'ambiente del progetto. Queste variabili sono accessibili in tutto il progetto. Questo file è utile per evitare di scrivere più volte lo stesso valore in più file. Inoltre, se il valore cambia, basta cambiarlo su .env e non in tutti i file in cui è presente.


if(!process.env.AVATAR_BASE || !process.env.AVATAR_QUERY)
    console.warn('[WARN] AVATAR_BASE or AVATAR_QUERY not set, will use default values');

const BASE_URL = process.env.BASE_API || '/api/v1'; // Define the base URL for the API
const AVATAR_BASE = process.env.AVATAR_BASE || 'https://gravatar.com/avatar/'
const AVATAR_QUERY = process.env.AVATAR_QUERY || 's=400&d=identicon&r=x'; // Define the query string for the avatar image
const JWT_SECRET = process.env.JWT_SECRET || '';
const RANDOM_SECRET = process.env.RANDOM_SECRET  || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const RESPONSE_MESSAGES = {
    400: 'Richiesta non valida',
    401: 'Non autorizzato',
    403: 'Vietato',
    404: 'Non trovato',
    500: 'Errore nel server'
}

const variables = {
    BASE_URL,
    AVATAR_BASE,
    AVATAR_QUERY,
    JWT_SECRET,
    RANDOM_SECRET
}

export default variables;
export {
    BASE_URL,
    AVATAR_BASE,
    AVATAR_QUERY,
    JWT_SECRET,
    RANDOM_SECRET,
    RESPONSE_MESSAGES
}