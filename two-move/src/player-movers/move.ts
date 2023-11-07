import { Direction, IMap, IMove, ItemLocation } from "../types";
import * as utils from './mover-utils';

export class Move implements IMove {
    direction: Direction;
    startLocation: ItemLocation;
    desitnationLocation: ItemLocation;
    isMove: boolean;

    constructor(direction: Direction, startLocation: ItemLocation, desitnationLocation: ItemLocation) {
        this.direction = direction;
        this.startLocation = startLocation;
        this.desitnationLocation = desitnationLocation;
        this.isMove = startLocation !== desitnationLocation;
    }

    static init(move: IMove) {
        return new Move(move.direction, move.startLocation, move.desitnationLocation);
    }

    getNextDirection(directionMap: Map<Direction, Direction>): Move {
        const directon = utils.getNextDirection(this.direction, directionMap);
        return new Move(directon, this.desitnationLocation, this.desitnationLocation);
    }

    getNextMove(mapWidth: number): Move {
        const newLocation = utils.getNextLocation(this.desitnationLocation, this.direction, mapWidth);
        return new Move(this.direction, this.desitnationLocation, newLocation);
    }

    isValidMove(map: IMap): boolean {
        return utils.isValidMove(this.direction, this.startLocation, this.desitnationLocation, map);
    }
}
