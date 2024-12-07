import { Sondaggi, Voti } from "../../types";

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


async function getSondaggio(id:string): Promise<Sondaggi.Sondaggio>{
    const token = sessionStorage.getItem('token');
    if(!token)
        throw new Error('Non sei autenticato');
    const response = await fetch(`/api/v1/sondaggi/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if(response.status === 200)
        return await response.json() as Sondaggi.Sondaggio;
    if(response.status)
        throw new Error(await response.text());
    throw new Error('Errore sconosciuto nel caricamento dei sondaggi');
}

/**
 * Funzione per aggiungere un voto ad un sondaggio esistente
 * 
 * @param {string} sondaggio l'id del sondaggio a cui aggiungere il voto
 * @param {Voti.Add} voto il voto da aggiungere al sondaggio 
 * @returns {Promise<string>} la location del voto aggiunto
 */
async function addVoto(sondaggio: string, voto: Voti.Add): Promise<string> {
    const token = sessionStorage.getItem('token');
    if(!token)
        throw new Error('Non sei autenticato');
    const response = await fetch(`/api/v1/voti?idSondaggio=${sondaggio}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(voto)
    });
    if(response.status === 201)
        return response.headers.get('Location') || '';
    if(response.status)
        throw new Error(await response.text());
    throw new Error('Errore sconosciuto nel caricamento dei sondaggi');
}

async function deleteVoto(voto: Voti.Voto) {
    const token = sessionStorage.getItem('token');
    if(!token)
        throw new Error('Non sei autenticato');
    const response = await fetch(`${voto.self}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if(response.status === 204)
        return;
    if(response.status)
        throw new Error(await response.text());
    throw new Error('Errore sconosciuto nel caricamento dei sondaggi');
}

const sondaggi = {
    getSondaggi,
    aggiungiSondaggio,
    getSondaggio,
    addVoto,
    deleteVoto
};


export default sondaggi;
export {
    getSondaggi,
    aggiungiSondaggio,
    getSondaggio,
    addVoto,
    deleteVoto
};