import { IBoard, IMove, IMover, IPlayer } from "../types.js";

export class KeydownMover implements IMover {
    getNextMove(player: IPlayer, board: IBoard): IMove {
        throw new Error("Method not implemented.");
    }
    
}