import voti from "./Voti"
import mediaVoti from "./MediaVoti"
import SondaggioDB from "./SondaggioDB";

type Sondaggio = SondaggioDB & {
    voti : [voti],
    mediaVoti : [mediaVoti]
};

export default Sondaggio;