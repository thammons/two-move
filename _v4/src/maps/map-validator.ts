import { AttributeType, IMap } from "./types";
import { cloneMap, getItemsByType, getGoal, getPlayer } from "./map-utils";
import { PlayerMotionMap } from "./map-player-motions";

export function checkPlayerCollision(
    map: IMap,
    takeStep: boolean = true
): { isCollision: boolean; map: IMap } {
    const newMap: IMap = cloneMap(map);
    const player = getPlayer(newMap);
    let isCollision = false;

    if (player !== undefined && player.direction !== undefined) {
        const attributes: AttributeType[] = [];
        const nextLocation = takeStep
            ? PlayerMotionMap.get(player.direction)?.nextMove(
                  player.location,
                  newMap.width
              )
            : player.location;

        const playerDirectionValid = PlayerMotionMap.has(player.direction);
        const nextMoveValid = isNextMoveValid(newMap, nextLocation);
        const nextMoveWall = isLocationWall(newMap, nextLocation);

        if (playerDirectionValid && (!nextMoveValid || nextMoveWall)) {
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
    } else {
        const player = getPlayer(map);

        const playInvalid =
            player === undefined ||
            player.direction === undefined ||
            !PlayerMotionMap.has(player.direction);

        if (playInvalid) {
            isValid = false;
        } else {
            if (player.direction === "east" && isMaxWest(nextMove, map.width)) {
                isValid = false;
            }
            if (player.direction === "west" && isMaxEast(nextMove, map.width)) {
                isValid = false;
            }
        }
    }
    return isValid;
}

export const anyOffMap = (locations: number[], size: number) =>
    locations.some((location) => isOffMap(location, size));

export const isOffMap = (location: number, size: number) =>
    location < 0 || location > size - 1;

export const isMaxEast = (location: number, width: number) =>
    location % width === width - 1;

export const isMaxWest = (location: number, width: number) =>
    location % width === 0;

export function anyLocationIsWall(map: IMap, locations: number[]): boolean {
    return locations.some((location) => isLocationWall(map, location));
}

export function isLocationWall(map: IMap, nextMove: number): boolean {
    const walls = getItemsByType(map, "wall");
    return walls.some((wall) => wall.location === nextMove);
}

export function validateMap(map: IMap) {
    //not a deep copy
    const validMap = { ...map };
    let isValid = true;
    const mapSize = map.width * map.height;

    const player = getPlayer(map);
    const goal = getGoal(map);
    const walls = getItemsByType(map, "wall");

    if (player === undefined || goal === undefined) {
        isValid = false;
    } else if (anyOffMap([player.location, goal.location], mapSize)) {
        isValid = false;
    } else if (anyLocationIsWall(map, [player.location, goal.location])) {
        isValid = false;
    }

    if (walls.some((wall) => isOffMap(wall.location, mapSize))) {
        isValid = false;
    }

    const response = isValid ? validMap : undefined;
    return response;
}
