import { describe, test, expect } from 'vitest';
import { IMap } from './types';
import { checkPlayerGoal, movePlayer, turnPlayer } from './map-functions';
import { cloneMap } from './map-utils';

/* things that need to happen for the game to be playable
    1. get board (for ui to print)
        - take in a map
        - return displayable board data
    2. move the player
        - take in a map and a direction
        - return displayable board data
    3. turn the player
        - take in a map and a direction
        - return displayable board data
    4. check for collisions
        - take in a map
        - return displayable board data
    5. check for win condition
        - take in a map
        - return displayable board data
            - a new board if the player won
*/

const map: IMap = {
    width: 10,
    height: 10,
    mapItems: new Map([
        ['empty', []],
        ['player', [{ type: "player", location: 0, direction: 'east' }]],
        ['goal', [{ type: "goal", location: 2 }]],
        ['wall', [
            { type: "wall", location: 20 },
            { type: "wall", location: 21 },
            { type: "wall", location: 22 },
            { type: "wall", location: 23 }
        ]],
    ])
};

describe('get board', () => {

    test.skip('Do I even need this? just return an IMap... - returns a board', () => {

        // const result = getBoard(map);

        // expect(result).toBeDefined();
    });
});

describe('move player', () => {
    test('moves player to new location - east', () => {
        const expectedPlayer = { type: "player", location: 1, direction: 'east' };
        const result = movePlayer(map);

        expect(result).toBeDefined();
        expect(result.mapItems.get('player')![0]).toEqual(expectedPlayer);
    });

    test('moves player to new location - south', () => {
        const newMap = cloneMap(map);
        newMap.mapItems.get('player')![0].direction = 'south';

        const expectedPlayer = { type: "player", location: 10, direction: 'south' };
        const result = movePlayer(newMap);

        expect(result).toBeDefined();
        expect(result.mapItems.get('player')![0]).toEqual(expectedPlayer);
    });

    test('moves player to new location - north', () => {
        const newMap = cloneMap(map);
        newMap.mapItems.get('player')![0].direction = 'north';
        newMap.mapItems.get('player')![0].location = 11;

        const expectedPlayer = { type: "player", location: 1, direction: 'north' };
        const result = movePlayer(newMap);

        expect(result).toBeDefined();
        expect(result.mapItems.get('player')![0]).toEqual(expectedPlayer);
    });

    test('moves player to new location - west', () => {
        const newMap = cloneMap(map);
        newMap.mapItems.get('player')![0].direction = 'west';
        newMap.mapItems.get('player')![0].location = 2;

        const expectedPlayer = { type: "player", location: 1, direction: 'west' };
        const result = movePlayer(newMap);

        expect(result).toBeDefined();
        expect(result.mapItems.get('player')![0]).toEqual(expectedPlayer);
    });

    //TODO:Validate failure cases
});
describe('turn player', () => {

    test('turn turns player to the next direction clockwise, east => south', () => {
        const expectedPlayer = { type: "player", location: 0, direction: 'south' };
        const result = turnPlayer(map);

        expect(result).toBeDefined();
        expect(result.mapItems.get('player')![0]).toEqual(expectedPlayer);
    });

    test('turn X2 turns player to the next direction clockwise, east => south => west', () => {
        const expectedPlayer = { type: "player", location: 0, direction: 'south' };
        const result = turnPlayer(map);

        expect(result).toBeDefined();
        expect(result.mapItems.get('player')![0]).toEqual(expectedPlayer);

        const expectedPlayer2 = { type: "player", location: 0, direction: 'west' };
        const result2 = turnPlayer(result);

        expect(result2).toBeDefined();
        expect(result2.mapItems.get('player')![0]).toEqual(expectedPlayer2);
    });

    test('turn X3 turns player to the next direction clockwise, east => south => west => north', () => {
        const expectedPlayer = { type: "player", location: 0, direction: 'south' };
        const result = turnPlayer(map);

        expect(result).toBeDefined();
        expect(result.mapItems.get('player')![0]).toEqual(expectedPlayer);

        const expectedPlayer2 = { type: "player", location: 0, direction: 'west' };
        const result2 = turnPlayer(result);

        expect(result2).toBeDefined();
        expect(result2.mapItems.get('player')![0]).toEqual(expectedPlayer2);

        const expectedPlayer3 = { type: "player", location: 0, direction: 'north' };
        const result3 = turnPlayer(result2);

        expect(result3).toBeDefined();
        expect(result3.mapItems.get('player')![0]).toEqual(expectedPlayer3);
    });

    //TODO:Validate failure cases

});

describe('check goal', () => {
    test('returns true if player is on goal', () => {
        const newMap = cloneMap(map);
        newMap.mapItems.get('player')![0].location = 2;

        const result = checkPlayerGoal(newMap);

        expect(result).toBe(true);
    });

    test('returns false if player is not on goal', () => {
        const result = checkPlayerGoal(map);

        expect(result).toBe(false);
    });
});