import { IMapSettings } from "@/board/types";
import { IMap } from "./types";
import { cloneMap, getPlayer } from "./map-utils";
import { PlayerMotionMap } from "./map-functions";

export function checkPlayerCollision(map: IMap): { isCollision: boolean, map: IMap } {
    const newMap: IMap = cloneMap(map);
    const player = getPlayer(newMap);
    let isCollision = false;

    if (player !== undefined && player.direction !== undefined) {
        player.attributes = [];
        const nextLocation = PlayerMotionMap.get(player.direction)!.nextMove(player.location, newMap.width);

        if (!isNextMoveValid(newMap, nextLocation) || isNextMoveWall(newMap, nextLocation)) {

            isCollision = true;

            const attributes = player.attributes || [];
            attributes.push(`error-${player.direction}`);
            player.attributes = attributes;
        }
    }

    console.log('checkPlayerCollision', isCollision, player)
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
                console.log('invalid East');
                isValid = false;
            }
            if (player.direction === 'west' && isMaxEast(nextMove, map.width)) {
                console.log('invalid West');
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

export function validateMap(map: IMapSettings) {
    //not a deep copy
    const validMap = { ...map };
    let isValid = true;
    const mapSize = map.width * map.height;


    if (isOffMap(map.player, mapSize)
        || isOffMap(map.goal, mapSize)) {
        isValid = false;
    }
    for (let wall of map.walls) {
        if (isOffMap(wall, mapSize)) {
            isValid = false;
            break;
        }
    }

    if (map.walls.has(map.player)
        || map.walls.has(map.goal)) {
        isValid = false;
    }

    const response = isValid ? validMap : undefined;
    return response;
}
