import {Types} from "mongoose";

type SondaggioBaseBase = {
    _id : Types.ObjectId,
    isAperto : Boolean,
    statoApprovazione : "Approvato" | "In attesa" | "Rifiutato"
};

export default SondaggioBaseBase;