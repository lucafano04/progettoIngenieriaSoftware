import { Circoscrizioni } from "../../types";

async function getCircoscrizioni(deepData: boolean = false): Promise<Circoscrizioni.Circoscrizione[] | Circoscrizioni.Minimal[]>{
    const response = await fetch(`/api/v1/circoscrizioni?deepData=${deepData}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(response.status !== 200)
        throw new Error((await response.json()).details);
    const data = await response.json();
    if(deepData)
        return data as Circoscrizioni.Circoscrizione[];
    else
        return data as Circoscrizioni.Minimal[];
}

async function getCircoscrizioniNoCoordinate(deepData: boolean = false): Promise<Circoscrizioni.MinimalBase[] | Circoscrizioni.CircoscrizioneNoC[]>{
    const response = await fetch(`/api/v1/circoscrizioni?deepData=${deepData}&coordinate=false`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(response.status !== 200)
        throw new Error((await response.json()).details);
    const data = await response.json();
    if(deepData)
        return data as Circoscrizioni.MinimalBase[];
    else
        return data as Circoscrizioni.CircoscrizioneNoC[];
}

async function getCircoscrizione(id: string): Promise<Circoscrizioni.Circoscrizione>{
    const response = await fetch(`/api/v1/circoscrizioni/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(response.status !== 200)
        throw new Error((await response.json()).details);
    const data = await response.json();
    return data as Circoscrizioni.Circoscrizione;
}

async function getCircoscrizioneNoCoordinate(id: string): Promise<Circoscrizioni.CircoscrizioneNoC>{
    const response = await fetch(`/api/v1/circoscrizioni/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(response.status !== 200)
        throw new Error((await response.json()).details);
    const data = await response.json();
    return data as Circoscrizioni.CircoscrizioneNoC;
}

const circoscrizioni = {
    getCircoscrizioni,
    getCircoscrizioniNoCoordinate,
    getCircoscrizione,
    getCircoscrizioneNoCoordinate,
}
export default circoscrizioni;
export {
    getCircoscrizioni,
    getCircoscrizioniNoCoordinate,
    getCircoscrizione,
    getCircoscrizioneNoCoordinate,
}