import voti from "./Voti"
import mediaVoti from "./MediaVoti"
import AddSondaggio from "./AddSondaggio";
import SondaggioBase from "./SondaggioBase";

type Sondaggio = AddSondaggio & SondaggioBase & {
    voti : [voti],
    mediaVoti : [mediaVoti]
};

export default Sondaggio;