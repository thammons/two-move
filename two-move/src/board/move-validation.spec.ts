import { describe, test, expect } from "vitest";
import { Direction, IMap, ItemLocation } from "../types";
import { Move, isMaxWest } from "./move";
import { MoveValidation } from "./move-validation_new";

const map: IMap = {
    width: 10,
    height: 10,
    cellWidth: 10,
    player: 0,
    goal: 9,
    //line down the middle of the map, bottom row clear
    walls: [5, 15, 25, 35, 45, 55, 65, 75, 85]
};

describe("isWall validation", () => {
    test("move forward is valid", () => {
        const result = MoveValidation.isWall(0, map);
        expect(true).toBe(true);
    });

    test.each([
        [0, false], [1, false], [2, false], [3, false], [4, false],
        [6, false], [7, false], [8, false], [9, false],
        [5, true], [15, true], [25, true], [35, true],
        [45, true], [55, true], [65, true], [75, true],
    ])("!MoveValidation.isWall(%i, map) is %s", (position, expected) => {
        const result = MoveValidation.isWall(position, map);
        expect(result).toBe(expected);
    });
});

describe("Next direction should be valid if not trying to step off the row moving laterally", () => {
    const mapWidth = 10;
    const mapHeight = 10;
    for (let i = 0; i < mapWidth - 1; i++) {
        test(`'east' should be valid when a player is at '${i}', given a map width of '${mapWidth}'`, () => {
            const result = MoveValidation.isNextCellOnBoard(i, 'east', mapWidth, mapHeight);
            expect(result).toBe(true);
        });
    }

    //start at 1, the first column is invalid
    for (let i = 1; i < mapWidth; i++) {
        test(`'west' should be valid when a player is at '${i}', given a map width of '${mapWidth}'`, () => {
            const result = MoveValidation.isNextCellOnBoard(i, 'west', mapWidth, mapHeight);
            expect(result).toBe(true);
        });
    }
});

describe("Next direction should be valid if not trying to step off the column moving vertically", () => {
    const mapWidth = 10;
    const mapHeight = 10;
    for (let i = 0; i < mapHeight - 1; i++) {
        const secondRow = i + mapWidth;
        test(`'north' should be valid when a player is at '${secondRow}', given a map height: '${mapHeight}', width: '${mapWidth}'`, () => {
            const result = MoveValidation.isNextCellOnBoard(secondRow, 'north', mapWidth, mapHeight);
            expect(result).toBe(true);
        });
    }

    for (let i = 0; i < mapHeight; i++) {
        test(`'south' should be valid when a player is at '${i}', given a map height of '${mapHeight}'`, () => {
            const result = MoveValidation.isNextCellOnBoard(i, 'south', mapWidth, mapHeight);
            expect(result).toBe(true);
        });
    }

});

describe("Next direction should be invalid if trying to step off the row moving laterally", () => {
    const mapWidth = 10;
    const mapHeight = 10;

    test.each([
        [9], [19], [29], [39], [49], [59], [69], [79], [89], [99]
    ])(`'east' should be invalid when a player is at %i, given a map width of '${mapWidth}'`, (farEast) => {
        const result = MoveValidation.isNextCellOnBoard(farEast, 'east', mapWidth, mapHeight);
        expect(result).toBe(false);
    });

    test.each([
        [0], [10], [20], [30], [40], [50], [60], [70], [80], [90]
    ])(`'west' should be invalid when a player is at '%i', given a map width of '${mapWidth}'`, (farWest) => {
        const result = MoveValidation.isNextCellOnBoard(farWest, 'west', mapWidth, mapHeight);
        expect(result).toBe(false);
    });
});

describe("Next direction should be invalid if trying to step off the column moving vertically", () => {
    const mapWidth = 10;
    const mapHeight = 10;
    for (let i = 0; i < mapHeight - 1; i++) {
        const farNorth = i;
        test(`'north' should be invalid when a player is at '${farNorth}', given a map height of '${mapHeight}'`, () => {
            const result = MoveValidation.isNextCellOnBoard(farNorth, 'north', mapWidth, mapHeight);
            expect(result).toBe(false);
        });
    }

    for (let i = 0; i < mapWidth; i++) {
        const farSouth = i + mapWidth * (mapHeight - 1);
        test(`'south' should be invalid when a player is at '${farSouth}', given a map height of '${mapHeight}'`, () => {
            const result = MoveValidation.isNextCellOnBoard(farSouth, 'south', mapWidth, mapHeight);
            expect(result).toBe(false);
        });
    }
});