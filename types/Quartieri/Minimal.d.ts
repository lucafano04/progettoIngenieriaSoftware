import MinimalBase from "./MinimalBase";
import {Coordinate, Circoscrizioni} from "..";

type Minimal = MinimalBase & Coordinate & {
    circoscrizione: Circoscrizioni.Minimal
}

export default Minimal;