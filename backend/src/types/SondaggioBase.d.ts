import user from "./User"

type SondaggioBase = {
    titolo : String,
    dataInizio : Date,
    id : Number,
    isAperto : Boolean,
    statoApprovazione : String,
    sondaggista : user
};

export default SondaggioBase;