import { Direction, IBoard, IMap, IMove, IMover, IPlayer } from "../types.js";
import * as utils from './mover-utils';

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
        if (this.moves.length > 0) {
            if (!!this.previousMove
                && this.previousMove.desitnationLocation === player.location
                && this.previousMove.direction === player.direction) {
                return this.moves.shift()!;
            }
        }

        this.moves = this.generateMoves(player, board.map, 10);
        return this.moves.shift()!;
    }

    generateMoves(player: IPlayer, map: IMap, numberToGenerate: number): IMove[] {
        const moves: IMove[] = [];

        let location = player.location;
        let direction = player.direction;

        Array.from(Array(numberToGenerate).keys()).forEach(() => {
            const getNextDirection = () => utils.getNextDirection(direction, this.directionMap);
            const move = utils.getNextValidMove(location, direction, map, getNextDirection);
            location = move.desitnationLocation;
            direction = move.direction;
            moves.push(move);
        });

        const goal = moves.findIndex(m => map.goal === m.desitnationLocation);
        if (goal > -1) {
            moves.splice(goal + 1, moves.length - goal);
        }

        return moves;
    };
}