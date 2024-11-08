import {Types} from "mongoose";

type Voti = {
    _id : Types.ObjectId,
    eta : number,
    voto : number,
    quartiere : Types.ObjectId,
    dataOra : Date
};

export default Voti;