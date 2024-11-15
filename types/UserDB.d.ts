import UserBase from "./UserBase";
import { Types } from "mongoose";

type UserDB = UserBase & {
    _id: Types.ObjectId,
    password: string,
};

export default UserDB;