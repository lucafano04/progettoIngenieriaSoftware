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
    let red, green;
    if(soddisfazione < 2.5){
        red = Math.round(255*(1-soddisfazione/2.5));
        green = 255;
    }else{
        red = 0;
        green = Math.round(255*((soddisfazione-2.5)/2.5));
    }
    // console.log(soddisfazione, toGrey,  toGrey ? `#${(red*0.8).toString(16).split('.')[0].padStart(2, '0')}${(green*0.8).toString(16).split('.')[0].padStart(2, '0')}00` : `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}00`);
    return toGrey ? `#${(red*0.8).toString(16).split('.')[0].padStart(2, '0')}${(green*0.8).toString(16).split('.')[0].padStart(2, '0')}00` : `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}00`;

    // return toGrey ? `rgb(${red*0.8},${green*0.8},${0})` : `rgb(${red},${green},0)`;
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