import Add from "./Add";

type Base = Add & {
    isAperto: Boolean,
    statoApprovazione: "Approvato" | "In attesa" | "Rifiutato",
    dataInizio: Date
};

export default Base;