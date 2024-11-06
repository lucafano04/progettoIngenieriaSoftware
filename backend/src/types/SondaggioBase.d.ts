import user from "./User"
import AddSondaggio from "./AddSondaggio"
import SondaggioBaseBase from "./SondaggioBaseBase";

type SondaggioBase = AddSondaggio & SondaggioBaseBase & {
    sondaggista : user
};

export default SondaggioBase;