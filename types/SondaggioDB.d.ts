import AddSondaggio from "./AddSondaggio";
import SondaggioBaseBase from "./SondaggioBaseBase";
import {Types} from "mongoose";

type SondaggioDB = AddSondaggio & SondaggioBaseBase & {
    _id: Types.ObjectId,
    sondaggista: Types.ObjectId
};

export default SondaggioDB;