import { Direction } from "./types";

interface IPlayerMotionMapItem {
    nextDirection: Direction;
    nextMove: (location: number, width: number) => number;
}

interface IPlayerMotionAction {
    (location: number, width: number): number;
}

class PlayerMotionActions {
    static moveNorth = (loc: number, width: number): number => loc - width;
    static moveEast = (loc: number, _: number): number => loc + 1;
    static moveSouth = (loc: number, width: number): number => loc + width;
    static moveWest = (loc: number, _: number): number => loc - 1;
}

export class PlayerMotionMap {
    private static directionMap: Map<Direction, IPlayerMotionMapItem> = new Map<
        Direction,
        { nextDirection: Direction; nextMove: IPlayerMotionAction }
    >([
        [
            "north",
            { nextDirection: "east", nextMove: PlayerMotionActions.moveNorth },
        ],
        [
            "east",
            { nextDirection: "south", nextMove: PlayerMotionActions.moveEast },
        ],
        [
            "south",
            { nextDirection: "west", nextMove: PlayerMotionActions.moveSouth },
        ],
        [
            "west",
            { nextDirection: "north", nextMove: PlayerMotionActions.moveWest },
        ],
    ]);

    static get(direction: Direction): {
        nextDirection: Direction;
        nextMove: (location: number, width: number) => number;
    } {
        return this.directionMap.get(direction)!;
    }

    static has(direction: Direction): boolean {
        return this.directionMap.has(direction);
    }
}