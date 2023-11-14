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
    destinationLocation: ItemLocation;
    isMove: boolean;

    constructor(direction: Direction, startLocation: ItemLocation, desitnationLocation: ItemLocation) {
        this.direction = direction;
        this.startLocation = startLocation;
        this.destinationLocation = desitnationLocation;
        this.isMove = startLocation !== desitnationLocation;
    }

    static init(move: IMove) {
        return new Move(move.direction, move.startLocation, move.destinationLocation);
    }

    getNextDirection(directionMap?: Map<Direction, Direction>): Move {
        if (!directionMap) directionMap = this.defaultDirectionMap;

        const direction = this.direction;
        let nextDirection = direction;
        if (directionMap.has(direction)) {
            nextDirection = directionMap.get(direction)!;
        }
        return new Move(nextDirection, this.destinationLocation, this.destinationLocation);
    }

    getNextMove(mapWidth: number): Move {
        const direction = this.direction;
        const currentLocation = this.destinationLocation;

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

        return new Move(this.direction, this.destinationLocation, nextLocation);
    }

    isValidMove(map: IMap, playerLocation?: ItemLocation): boolean {
        const direction = this.direction;
        const startLocation = this.startLocation;
        const desiredLocation = this.destinationLocation;

        const moveIsAtEdgeWest = isMaxWest(direction, startLocation, map.width);
        const moveIsAtEdgeEast = isMaxEast(direction, startLocation, map.width);
        const moveIsOffTheBoard = desiredLocation < 0 || desiredLocation > map.width * map.height - 1;
        const moveIsBlocked = () => map.walls.includes(desiredLocation);

        const isValidMoveForPlayer = !playerLocation || playerLocation === startLocation;

        // console.log('IsValidMove', direction, startLocation, desiredLocation, map.width, map.height, map.walls);
        // console.log('IsValidMove', isValidMoveForPlayer, moveIsOffTheBoard, moveIsAtEdgeWest, moveIsAtEdgeEast, moveIsBlocked());

        return isValidMoveForPlayer
            && !(moveIsOffTheBoard || moveIsAtEdgeWest || moveIsAtEdgeEast || moveIsBlocked());
    }
}

//TODO These should live on a generic map?
export function isMaxWest(direction: Direction, playerLocation: ItemLocation, boardWidth: number): boolean {
    return direction === 'west' && (playerLocation % boardWidth) < 0;
}

export function isMaxEast(direction: Direction, playerLocation: ItemLocation, boardWidth: number): boolean {
    return direction === 'east' && Math.floor(playerLocation / boardWidth) !== Math.floor((playerLocation) / boardWidth);
}

