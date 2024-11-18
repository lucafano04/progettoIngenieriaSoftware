import voti from "../Voti"
import Minimal from "./Minimal";

type Sondaggio = Minimal & {
    voti: voti.Voto[],
    mediaVoti: voti.Media[]
};

export default Sondaggio;