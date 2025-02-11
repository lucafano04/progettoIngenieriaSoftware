import Add from "./Add"
import Base from "./Base";
import {Types} from "mongoose";

type DB = Base & {
    _id: Types.ObjectId,
    sondaggista: Types.ObjectId
};

export default DB;