import Voti from "./Voti";
import {Types} from "mongoose";

type VotoDB = Voti & {
    sondaggio : Types.ObjectId
};

export default VotoDB;