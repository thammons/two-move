import { Direction } from "@/board/types";
import { IMap } from "./types";
import * as Utils from "./map-utils";

export function movePlayer(map: IMap): IMap {
    const newMap = Utils.cloneMap(map);

    const player = Utils.getPlayer(newMap);
    if (player !== undefined && player.direction !== undefined) {
        player.location = PlayerMotionMap.get(player.direction)!.nextMove(player.location, newMap.width);
    }

    return newMap;
}

export function turnPlayer(map: IMap): IMap {
    const newMap = Utils.cloneMap(map);

    const player = Utils.getPlayer(newMap);
    if (player !== undefined && player.direction !== undefined) {
        player.direction = PlayerMotionMap.get(player.direction)!.nextDirection;
    }

    return newMap;
}

export function checkPlayerGoal(map: IMap): boolean {
    const player = Utils.getPlayer(map);
    const goal = Utils.getGoal(map);
    let isGoal = false;

    if (player !== undefined && goal !== undefined) {
        if (player.location === goal.location) {
            isGoal = true;
        }
    }

    return isGoal;
}

export function getMap(): IMap {
    const map: IMap = {
        width: 10,
        height: 10,
        mapItems: new Map([
            ['empty', []],
            ['player', [{ type: "player", location: 0, direction: 'east' }]],
            ['goal', [{ type: "goal", location: 2 }]],
            ['wall', [
                { type: "wall", location: 10 },
                { type: "wall", location: 11 },
                { type: "wall", location: 12 },
                { type: "wall", location: 13 }
            ]],
        ])
    };
    return map;
}

interface IPlayerMotionMapItem {
    nextDirection: Direction;
    nextMove: (location: number, width: number) => number;
}

export class PlayerMotionMap {
    private static map: Map<Direction, IPlayerMotionMapItem> =
        new Map<Direction, { nextDirection: Direction, nextMove: (location: number, width: number) => number }>([
            ['north', { nextDirection: 'east', nextMove: (location: number, width: number) => location - width }],
            ['east', { nextDirection: 'south', nextMove: (location: number, _: number) => location + 1 }],
            ['south', { nextDirection: 'west', nextMove: (location: number, width: number) => location + width }],
            ['west', { nextDirection: 'north', nextMove: (location: number, _: number) => location - 1 }],
        ]);

    static get(direction: Direction): { nextDirection: Direction, nextMove: (location: number, width: number) => number } {
        return this.map.get(direction)!;
    }
}
