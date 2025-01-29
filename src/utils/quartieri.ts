import { Quartieri } from "../../types";

async function getQuartieri(deepData:boolean = false): Promise<Quartieri.Quartiere[] | Quartieri.Minimal[]>{
    const quartieri = await fetch(`/api/v1/quartieri?deepData=${deepData}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(quartieri.status !== 200)
        throw new Error(`Errore nel recupero dei quartieri ${await quartieri.text()}`);
    const data = await quartieri.json();
    if(deepData)
        return data as Quartieri.Quartiere[];
    else
        return data as Quartieri.Minimal[];
}

async function getQuartieriNoCoordinate(deepData: boolean = false): Promise<Quartieri.MinimalBase[] | Quartieri.QuartiereNoC[]>{
    const quartieri = await fetch(`/api/v1/quartieri?deepData=${deepData}&coordinate=false`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(quartieri.status !== 200)
        throw new Error(`Errore nel recupero dei quartieri ${await quartieri.text()}`);
    const data = await quartieri.json();
    if(deepData)
        return data as Quartieri.QuartiereNoC[];
    else
        return data as Quartieri.MinimalBase[];
}

async function getQuartiere(id: string): Promise<Quartieri.Quartiere>{
    const quartiere = await fetch(`/api/v1/quartieri/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(quartiere.status !== 200)
        throw new Error(`Errore nel recupero del quartiere ${id} ${await quartiere.text()}`);
    const data = await quartiere.json();
    return data as Quartieri.Quartiere;
}

async function getQuartiereNoCoordinate(id: string): Promise<Quartieri.QuartiereNoC>{
    const quartiere = await fetch(`/api/v1/quartieri/${id}?coordinate=false`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(quartiere.status !== 200)
        throw new Error(`Errore nel recupero del quartiere ${id} ${await quartiere.text()}`);
    const data = await quartiere.json();
    return data as Quartieri.QuartiereNoC;
}

const quartieri = {
    getQuartieri,
    getQuartieriNoCoordinate,
    getQuartiere,
    getQuartiereNoCoordinate
}

export default quartieri;
export {
    getQuartieri,
    getQuartieriNoCoordinate,
    getQuartiere,
    getQuartiereNoCoordinate,
}