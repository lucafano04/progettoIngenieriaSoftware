import AddSondaggio from "./AddSondaggio";
import SondaggioBaseBase from "./SondaggioBaseBase";

type SondaggioDB = AddSondaggio & SondaggioBaseBase & {
    sondaggista: Number,
};

export default SondaggioDB;