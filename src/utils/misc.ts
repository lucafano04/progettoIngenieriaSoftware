import { Dati } from "../../types";

async function getInfoGenerali(): Promise<Dati.DatiGenericiCitta>{
    const info = await fetch(`/api/v1/generalInfo`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if(info.status !== 200)
        throw new Error(`Errore nel recupero dei dati generali della città ${await info.text()}`);
    const data = await info.json();
    return data as Dati.DatiGenericiCitta;
}

/**
 * Restituisce il gradiente di colore a partire da rosso-giallo-verde in base alla soddisfazione
 * @param {float} soddisfazione la soddisfazione da cui ricavare il colore (1-5) + 0 se non sono presenti dati
 * @param {boolean} toGrey se true restituisce il colore in scala di grigio 
 * @returns il colore da assegnare
 */
function getColorFromSoddisfazione(soddisfazione: number, toGrey: boolean = false): string{
    if(soddisfazione === 0){
        if(toGrey)
            return '#a0a0a0';
        return '#000000';
    }
    if(soddisfazione < 2.5){
        const red = Math.round(255*(1-soddisfazione/2.5));
        const green = 255;
        return toGrey ? `rgb(${red*0.8},${green*0.8},${0})` : `rgb(${red},${green},0)`;
    }else{
        const red = 0;
        const green = Math.round(255*(1-(soddisfazione-2.5)/2.5));
        return toGrey ? `rgb(${red*0.8},${green*0.8},${0})` : `rgb(${red},${green},0)`;
    }
}

const misc = {
    getInfoGenerali,
    getColorFromSoddisfazione
}

export default misc;
export {
    getInfoGenerali,
    getColorFromSoddisfazione
}