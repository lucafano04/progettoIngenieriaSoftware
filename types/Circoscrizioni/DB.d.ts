import Base from './Base';
import Minimal from './Minimal';
import {Types} from "mongoose";

type DB = Base & {
    _id: Types.ObjectId,
}

export default DB;