import Dati from '.';

type DatiSpecifici = Dati.DatiBase & {
    servizi: Dati.ServiziGenerali,
    sicurezza: Dati.Sicurezza
}

export default DatiSpecifici;