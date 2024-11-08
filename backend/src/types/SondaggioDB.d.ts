import AddSondaggio from "./AddSondaggio";
import SondaggioBaseBase from "./SondaggioBaseBase";
import {Types} from "mongoose";

type SondaggioDB = AddSondaggio & SondaggioBaseBase & {
    sondaggista: Types.ObjectId
};

export default SondaggioDB;