import { describe, expect, test } from 'vitest';

import { NullableIMap, MapFromJson } from '../map-from-json';

let validMap: NullableIMap = {
    width: 10,
    height: 10,
    cellWidth: 50,
    player: 0,
    goal: 99,
    walls: []
};

describe('map-from-json creates a map', async () => {

    test('creates a map from a valid script', async () => {
        const map = MapFromJson._validateSettings(validMap!);

        expect(map.width).toEqual(validMap.width);
        expect(map.height).toEqual(validMap.height);
        expect(map.cellWidth).toEqual(validMap.cellWidth);
        expect(map.player).toEqual(validMap.player);
        expect(map.goal).toEqual(validMap.goal);
        expect(map.walls).toEqual(validMap.walls);
    });

    test.each([
        'width', 'height', 'cellWidth', 'player', 'goal'
    ])(`throws an error if the map does not have a %s`, async (key: string) => {
        let testMap = JSON.parse(JSON.stringify(validMap));
        testMap![key] = undefined;
        expect(() => MapFromJson._validateSettings(testMap)).toThrow(Error(`map does not have a ${key}`));
    });

    //TODO Verify data is valid for type (number / number[])

    // test('throws an error if the map does not have walls', async () => {
    //     let testMap = { ...validMap };
    //     testMap.walls = [];
    //     expect(() => MapFromJson._validateSettings(testMap)).toThrow(Error(`map does not have walls`));
    // });

    test('throws an error if the map walls is not an array', async () => {
        let testMap = { ...validMap };
        testMap.walls = {} as number[];
        expect(() => MapFromJson._validateSettings(testMap)).toThrow(Error('map walls is not an array'));
    });

});
