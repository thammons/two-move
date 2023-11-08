import { Move } from "../board/move.js";
import { Direction, IBoard, IMap, IMove, IMover, IPlayer } from "../types.js";

export class PaceMover implements IMover {
    directionMap: Map<Direction, Direction> = new Map([
        ['east', 'west'],
        ['west', 'east'],
        ['north', 'south'],
        ['south', 'north']
    ]);
    moves: IMove[] = [];
    speed:number;

    constructor(speed:number) {
        this.speed = speed;
    }

    clear(){
        this.moves = [];
    }

    getNextMove(player: IPlayer, board: IBoard): IMove {
        if (this.moves.length === 0)
            this.moves = this.generateMoves(player, board.map, 1);

        return this.moves.shift()!;
    }

    generateMoves(player: IPlayer, map: IMap, numberToGenerate: number): IMove[] {
        const moves: IMove[] = [];

        let lastMove = new Move(player.direction, player.location, player.location);
        let nextMove = lastMove;

        Array.from(Array(numberToGenerate).keys()).forEach(() => {
            lastMove = nextMove;
            nextMove = nextMove.getNextMove(map.width);
            let isValid = nextMove.isValidMove(map);
            moves.push(nextMove);
            if (!isValid) {
                nextMove = lastMove.getNextDirection(this.directionMap);
                moves.push(nextMove);
            }
        });

        const goal = moves.findIndex(m => map.goal === m.desitnationLocation);
        if (goal > -1) {
            moves.splice(goal + 1, moves.length - goal);
        }

        return moves;
    };
}