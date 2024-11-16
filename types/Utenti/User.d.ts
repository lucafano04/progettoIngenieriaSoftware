import UserBase from "./UserBase";

type User = UserBase & {
    self: string,
};

export default User;