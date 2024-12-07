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

const quartieri = {
    getQuartieri,
    getQuartiere
}

export default quartieri;
export {
    getQuartieri,
    getQuartiere
}