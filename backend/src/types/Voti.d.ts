import VotoBase from "./VotiBase";

type Voti = VotoBase & {
    self: string,
    quartiere: string,
};

export default Voti;