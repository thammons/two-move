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
    previousMove: IMove | undefined = undefined;

    getNextMove(player: IPlayer, board: IBoard): IMove {
        if (this.moves.length === 0
            || !this.previousMove
            || (this.previousMove.desitnationLocation !== player.location
            && this.previousMove.direction !== player.direction))
            this.moves = this.generateMoves(player, board.map, 10);

        this.previousMove = this.moves.shift()!;
        return this.previousMove;
    }

    generateMoves(player: IPlayer, map: IMap, numberToGenerate: number): IMove[] {
        const moves: IMove[] = [];

        let lastMove = new Move(player.direction, player.location, player.location);
        let nextMove = lastMove;

        Array.from(Array(numberToGenerate).keys()).forEach(() => {
            nextMove = nextMove.getNextMove(map.width);
            let isValid = nextMove.isValidMove(map);
            moves.push(nextMove);
            if (!isValid) {
                nextMove = nextMove.getNextDirection(this.directionMap);
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