import voti from "./Voti"
import mediaVoti from "./MediaVoti"
import SondaggioDB from "./SondaggioDB";
import SondaggioBase from "./SondaggioBase";

type Sondaggio = SondaggioBase & {
    voti : [voti],
    mediaVoti : [mediaVoti]
};

export default Sondaggio;