type SondaggioBaseBase = {
    _id : Number,
    isAperto : Boolean,
    statoApprovazione : "Approvato" | "In attesa" | "Rifiutato"
};

export default SondaggioBaseBase;