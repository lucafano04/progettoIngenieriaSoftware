import user from "./User"
import addSondaggio from "./AddSondaggio"

type SondaggioBase = {
    _id : Number,
    datiSondaggio : addSondaggio,
    isAperto : Boolean,
    statoApprovazione : "Approvato" | "In attesa" | "Rifiutato",
    sondaggista : user
};

export default SondaggioBase;