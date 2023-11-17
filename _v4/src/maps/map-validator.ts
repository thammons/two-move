import { AttributeType, IMap } from "./types";
import { cloneMap, getItemsByType, getGoal, getPlayer } from "./map-utils";
import { PlayerMotionMap } from "./map-functions";

export function checkPlayerCollision(map: IMap, takeStep: boolean = true): { isCollision: boolean, map: IMap } {
    const newMap: IMap = cloneMap(map);
    const player = getPlayer(newMap);
    let isCollision = false;

    if (player !== undefined && player.direction !== undefined) {
        const attributes:AttributeType[] = [];
        const nextLocation = takeStep
            ? PlayerMotionMap.get(player.direction)!.nextMove(player.location, newMap.width)
            : player.location;

        if (!isNextMoveValid(newMap, nextLocation) || isNextMoveWall(newMap, nextLocation)) {
            isCollision = true;
            attributes.push(`error-${player.direction}`);
        }

        player.attributes = attributes;
    }

    return { isCollision, map: newMap };
}

export function isNextMoveValid(map: IMap, nextMove: number): boolean {

    let isValid = true;

    if (isOffMap(nextMove, map.width * map.height)) {
        isValid = false;
    }
    else {
        const player = getPlayer(map);
        if (player === undefined || player.direction === undefined) {
            isValid = false;
        }
        else {
            if (player.direction === 'east' && isMaxWest(nextMove, map.width)) {
                isValid = false;
            }
            if (player.direction === 'west' && isMaxEast(nextMove, map.width)) {
                 isValid = false;
            }
        }
    }
    return isValid;
}

export const isOffMap = (location: number, size: number) => location < 0 || location > size - 1;
export const isMaxEast = (location: number, width: number) => location % width === width - 1;
export const isMaxWest = (location: number, width: number) => location % width === 0;

export function isNextMoveWall(map: IMap, nextMove: number): boolean {
    const walls = map.mapItems.get('wall');
    if (walls !== undefined) {
        return walls.some(wall => wall.location === nextMove);
    }
    return false;
}

export function validateMap(map: IMap) {
    //not a deep copy
    const validMap = { ...map };
    let isValid = true;
    const mapSize = map.width * map.height;

    const player = getPlayer(map);
    const goal = getGoal(map);
    const walls = getItemsByType(map, 'wall');

    if (player === undefined || goal === undefined) {
        isValid = false;
    }
    else if (isOffMap(player.location, mapSize)
        || isOffMap(goal.location, mapSize)) {
        isValid = false;
    }
    else if (walls.some(wall => wall.location === player.location)
        || walls.some(wall => wall.location === goal.location)) {
        isValid = false;
    }

    if (walls.some(wall => isOffMap(wall.location, mapSize))) {
        isValid = false;
    }

    const response = isValid ? validMap : undefined;
    return response;
}
