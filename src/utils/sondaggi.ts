import { Sondaggi } from "../../types";

async function getSondaggi(deepData: boolean = false): Promise<Sondaggi.Sondaggio[] | Sondaggi.Minimal[]>{
    const token = sessionStorage.getItem('token');
    if(!token)
        throw new Error('Non sei autenticato');
    const response = await fetch(`/api/v1/sondaggi?deepData=${deepData}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if(response.ok)
        return await response.json() as Sondaggi.Sondaggio[];
    if(response.status)
        throw new Error(await response.text());
    throw new Error('Errore sconosciuto nel caricamento dei sondaggi');
}
/**
 * Funzione per aggiungere un sondaggio al database
 * @param dati dati del sondaggio da aggiungere
 * @returns la location del sondaggio aggiunto (self)
 */
async function aggiungiSondaggio(dati: Sondaggi.Add): Promise<string>{
    const token = sessionStorage.getItem('token');
    if(!token)
        throw new Error('Non sei autenticato');
    const response = await fetch(`/api/v1/sondaggi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dati)
    });
    if(response.ok)
        return response.headers.get('Location') || '';
    if(response.status)
        throw new Error(await response.text());
    throw new Error('Errore sconosciuto nel caricamento dei sondaggi');
}

const sondaggi = {
    getSondaggi,
    aggiungiSondaggio
};


export default sondaggi;
export {
    getSondaggi,
    aggiungiSondaggio
};