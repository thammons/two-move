import { Move } from "../board/move.js";
import { Direction, IBoard, IMap, IMove, IMover, IPlayer } from "../types.js";
import { BaseMover } from "./base-mover.js";

export class PaceMover implements IMover {
    directionMap: Map<Direction, Direction> = new Map([
        ['east', 'west'],
        ['west', 'east'],
        ['north', 'south'],
        ['south', 'north']
    ]);
    speed: number;
    baseMover: BaseMover;

    constructor(speed: number) {
        this.speed = speed;
        this.baseMover = new BaseMover(speed, PaceMover.turnCondition, this.directionMap);
    }

    static turnCondition(lastMove: IMove, nextMove:IMove, board: IBoard) {
        const nextNextMove = Move.init(nextMove).getNextMove(board.map.width);
        return !Move.init(nextMove).isValidMove(board.map, lastMove.desitnationLocation);
    }

    getNextMove(player: IPlayer, board: IBoard): IMove {
        return this.baseMover.getNextMove(player, board);
    }


    clear() {  }
}