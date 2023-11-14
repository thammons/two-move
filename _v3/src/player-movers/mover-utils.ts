import { Direction, IMap, IMove, ItemLocation } from "../types";

export function createMove(direction: Direction, startLocation: ItemLocation, desitnationLocation?: ItemLocation): IMove {
    return {
        direction: direction,
        startLocation: startLocation,
        destinationLocation: desitnationLocation ?? startLocation,
        isMove: startLocation != (desitnationLocation ?? startLocation)
    };
}

export function getNextValidMove(location: ItemLocation, direction: Direction, map: IMap, getNextDirection:(direction:Direction) => Direction): IMove {
    let nextMove = getNextLocation(location, direction, map.width);
    let nextDirection = direction;

    if (!isValidMove(nextDirection, location, nextMove, map)) {
        nextDirection = getNextDirection(direction);
        nextMove = location;
    }

    const nextIMove = {
        direction: nextDirection,
        startLocation: location,
        desitnationLocation: nextMove,
        isMove: nextMove !== location
    };

    return nextIMove;
}

export function getNextDirection(direction: Direction, directionMap:Map<Direction, Direction>): Direction {
    let nextDirection = direction;
    if (directionMap.has(direction)) {
        nextDirection = directionMap.get(direction)!;
    }
    return nextDirection;
}

export function getNextLocation(currentLocation: ItemLocation, direction: Direction, boardWidth: number) {
    let nextLocation = currentLocation;
    if (direction === 'east') {
        nextLocation = currentLocation + 1;
    } else if (direction === 'west') {
        nextLocation = currentLocation - 1;
    } else if (direction === 'north') {
        nextLocation = currentLocation - boardWidth;
    } else if (direction === 'south') {
        nextLocation = currentLocation + boardWidth;
    }
    return nextLocation;
}

export function isValidMove(direction: Direction, startLocation: ItemLocation, desiredLocation: ItemLocation, map: IMap): boolean {
    const moveIsAtEdgeWest = isMaxWest(direction, startLocation, map);
    const moveIsAtEdgeEast = isMaxEast(direction, startLocation, map);
    const moveIsOffTheBoard = desiredLocation < 0 || desiredLocation > map.width * map.height - 1;
    const moveIsBlocked = () => map.walls.includes(desiredLocation);

    return !(moveIsOffTheBoard || moveIsAtEdgeWest || moveIsAtEdgeEast || moveIsBlocked());

};

export function isMaxWest(direction: Direction, location: ItemLocation, map: IMap): boolean {
    return direction === 'west' && location % map.width === 0;
}

export function isMaxEast(direction: Direction, location: ItemLocation, map: IMap): boolean {
    return direction === 'east' && location % map.width === map.width - 1;
}