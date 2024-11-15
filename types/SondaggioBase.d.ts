import user from "./User"
import AddSondaggio from "./AddSondaggio"
import SondaggioBaseBase from "./SondaggioBaseBase";

type SondaggioBase = AddSondaggio & SondaggioBaseBase & {
    self: string,
    sondaggista: user
};

export default SondaggioBase;