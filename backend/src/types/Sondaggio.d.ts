import user from "./User"
import voti from "./Voti"
import mediaVoti from "./MediaVoti"

type Sondaggio = {
    titolo : String,
    dataInizio : Date,
    id : Number,
    isAperto : Boolean,
    statoApprovazione : String,
    sondaggista : user,
    voti : [voti],
    mediaVoti : [mediaVoti]
};

export default Sondaggio;