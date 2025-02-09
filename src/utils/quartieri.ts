import { Quartieri } from "../../types";

async function getQuartieri(deepData:boolean = false): Promise<Quartieri.Quartiere[] | Quartieri.Minimal[]>{
    const response = await fetch(`/api/v1/quartieri?deepData=${deepData}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(response.status !== 200)
        throw new Error((await response.json()).details);
    const data = await response.json();
    if(deepData)
        return data as Quartieri.Quartiere[];
    else
        return data as Quartieri.Minimal[];
}

async function getQuartieriNoCoordinate(deepData: boolean = false): Promise<Quartieri.MinimalBase[] | Quartieri.QuartiereNoC[]>{
    const response = await fetch(`/api/v1/quartieri?deepData=${deepData}&coordinate=false`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(response.status !== 200)
        throw new Error((await response.json()).details);
    const data = await response.json();
    if(deepData)
        return data as Quartieri.QuartiereNoC[];
    else
        return data as Quartieri.MinimalBase[];
}

async function getQuartiere(id: string): Promise<Quartieri.Quartiere>{
    const response = await fetch(`/api/v1/quartieri/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(response.status !== 200)
        throw new Error((await response.json()).details);
    const data = await response.json();
    return data as Quartieri.Quartiere;
}

async function getQuartiereNoCoordinate(id: string): Promise<Quartieri.QuartiereNoC>{
    const response = await fetch(`/api/v1/quartieri/${id}?coordinate=false`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(response.status !== 200)
        throw new Error((await response.json()).details);
    const data = await response.json();
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