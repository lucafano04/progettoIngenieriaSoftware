import Base from "./Base";
import { Types } from "mongoose";

type DB = Base & {
    _id: Types.ObjectId,
    password: string,
};

export default DB;