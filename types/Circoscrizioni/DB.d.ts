import Base from './Base';
import Coordinate from '../Coordinate';
import {Types} from "mongoose";

type DB = Base & Coordinate & {
    _id: Types.ObjectId,
}

export default DB;