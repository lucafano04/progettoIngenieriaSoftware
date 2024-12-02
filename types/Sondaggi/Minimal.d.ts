import { Utenti } from "..";
import Add from "./Add";
import Base from "./Base";

type Minimal = Base & {
    self: string,
    sondaggista: Utenti.User
};

export default Minimal;