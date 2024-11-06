import user from "./User"
import voti from "./Voti"
import mediaVoti from "./MediaVoti"
import addSondaggio from "./AddSondaggio";

type Sondaggio = {
    _id : Number,
    datiSondaggio : addSondaggio,
    isAperto : Boolean,
    statoApprovazione : "Approvato" | "In attesa" | "Rifiutato",
    sondaggista : user,
    voti : [voti],
    mediaVoti : [mediaVoti]
};

export default Sondaggio;