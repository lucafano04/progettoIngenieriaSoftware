import user from "./User"
import AddSondaggio from "./AddSondaggio"

type SondaggioBase = AddSondaggio & {
    _id : Number,
    isAperto : Boolean,
    statoApprovazione : "Approvato" | "In attesa" | "Rifiutato",
    sondaggista : user
};

export default SondaggioBase;