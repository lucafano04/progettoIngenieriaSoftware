import voti from "../Voti"
import mediaVoti from "../MediaVoti"
import Minimal from "./Minimal";

type Sondaggio = Minimal & {
    voti: [voti],
    mediaVoti: [mediaVoti]
};

export default Sondaggio;