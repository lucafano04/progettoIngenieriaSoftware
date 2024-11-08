import {Types} from "mongoose";

type QuartiereBaseBase = {
    _id : Types.ObjectId,
    nome : String,
    coordinate : number[][],
};

export default QuartiereBaseBase;