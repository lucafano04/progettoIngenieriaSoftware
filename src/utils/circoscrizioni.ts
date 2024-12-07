import { Circoscrizioni } from "../../types";

async function getCircoscrizioni(deepData: boolean = false): Promise<Circoscrizioni.Circoscrizione[] | Circoscrizioni.Minimal[]>{
    const circoscrizioni = await fetch(`/api/v1/circoscrizioni?deepData=${deepData}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(circoscrizioni.status !== 200)
        throw new Error(`Errore nel recupero delle circoscrizioni ${await circoscrizioni.text()}`);
    const data = await circoscrizioni.json();
    if(deepData)
        return data as Circoscrizioni.Circoscrizione[];
    else
        return data as Circoscrizioni.Minimal[];
}

async function getCircoscrizione(id: string): Promise<Circoscrizioni.Circoscrizione>{
    const circoscrizione = await fetch(`/api/v1/circoscrizioni/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(circoscrizione.status !== 200)
        throw new Error(`Errore nel recupero della circoscrizione ${id} ${await circoscrizione.text()}`);
    const data = await circoscrizione.json();
    return data as Circoscrizioni.Circoscrizione;
}

const circoscrizioni = {
    getCircoscrizioni,
    getCircoscrizione
}
export default circoscrizioni;
export {
    getCircoscrizioni,
    getCircoscrizione
}