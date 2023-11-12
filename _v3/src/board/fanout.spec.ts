import { describe, test, expect } from "vitest";
import { IMap } from "../types";
import { getNorthWall } from "./fanout";

const map:IMap = {
    cellWidth: 10,
    height: 10,
    width: 10,
    player: 54, //middle of the blank square
    goal: 99,
    walls: [
         0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        40, 41, 42,             46, 47, 48, 49,
        50, 51, 52,             56, 57, 58, 59,
        60, 61, 62,             66, 67, 68, 69,
        70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
        80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
        90, 91, 92, 93, 94, 95, 96, 97, 98, 99
    ]
}

describe("should return the nearest walls in all directions", () => {
    test("north most wall is returned", () => {
        const result = getNorthWall(map.player, map, 4);
        expect(result).eqls([32,33,34,35,36]);
    });

});