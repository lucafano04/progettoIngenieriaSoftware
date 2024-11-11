import {Types} from "mongoose";
import VotoBase from "./VotiBase";

type VotoDB = VotoBase & {
    _id: Types.ObjectId,
    sondaggio: Types.ObjectId,
    quartiere: Types.ObjectId
};

export default VotoDB;