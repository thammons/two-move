import { Direction, IMap, IMove, ItemLocation } from "../types";

export class Move implements IMove {
    defaultDirectionMap: Map<Direction, Direction> = new Map([
        ['east', 'south'],
        ['south', 'west'],
        ['west', 'north'],
        ['north', 'east']
    ]);
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

    getNextDirection(directionMap?: Map<Direction, Direction>): Move {
        if (!directionMap) directionMap = this.defaultDirectionMap;

        const direction = this.direction;
        let nextDirection = direction;
        if (directionMap.has(direction)) {
            nextDirection = directionMap.get(direction)!;
        }
        return new Move(nextDirection, this.desitnationLocation, this.desitnationLocation);
    }

    getNextMove(mapWidth: number): Move {
        const direction = this.direction;
        const currentLocation = this.desitnationLocation;

        let nextLocation = currentLocation;
        if (direction === 'east') {
            nextLocation = currentLocation + 1;
        } else if (direction === 'west') {
            nextLocation = currentLocation - 1;
        } else if (direction === 'north') {
            nextLocation = currentLocation - mapWidth;
        } else if (direction === 'south') {
            nextLocation = currentLocation + mapWidth;
        }

        return new Move(this.direction, this.desitnationLocation, nextLocation);
    }

    isValidMove(map: IMap): boolean {
        const direction = this.direction;
        const startLocation = this.startLocation;
        const desiredLocation = this.desitnationLocation;

        const moveIsAtEdgeWest = isMaxWest(direction, startLocation, map);
        const moveIsAtEdgeEast = isMaxEast(direction, startLocation, map);
        const moveIsOffTheBoard = desiredLocation < 0 || desiredLocation > map.width * map.height - 1;
        const moveIsBlocked = () => map.walls.includes(desiredLocation);
    
        return !(moveIsOffTheBoard || moveIsAtEdgeWest || moveIsAtEdgeEast || moveIsBlocked());
    }
}

//TODO This should live on a generic map?
export function isMaxWest(direction: Direction, location: ItemLocation, map: IMap): boolean {
    return direction === 'west' && location % map.width === 0;
}

export function isMaxEast(direction: Direction, location: ItemLocation, map: IMap): boolean {
    return direction === 'east' && location % map.width === map.width - 1;
}
