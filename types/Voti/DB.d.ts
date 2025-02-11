import {Types} from "mongoose";
import Minimal from "./Minimal";

type DB = Minimal & {
    _id: Types.ObjectId,
    sondaggio: Types.ObjectId,
    quartiere: Types.ObjectId
};

export default DB;