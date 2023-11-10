import { describe, expect, test } from 'vitest';

import MapGenerated from '../generate-map1';

let map: MapGenerated = new MapGenerated(0, 25, 25, 25, 1);

describe('MapGenerated generateWall', async () => {

    test('should generate a wall', async () => {
        const result = map!.generateWall();
        expect(result?.length).toBeTruthy();
    });
});

describe('MapGenerated structural integrity checks', async () => {

    test('should have a width', async () => {
        expect(map.width).toEqual(25);
    });

    test('should have a height', async () => {
        expect(map.height).toEqual(25);
    });

    test('should have a cellWidth', async () => {
        expect(map.cellWidth).toEqual(25);
    });

    test('should have walls', async () => {
        expect(map.walls.length).toBeTruthy();
    });

    test('should have a player', async () => {
        expect(map.player).toBeGreaterThanOrEqual(0);
        expect(map.player).toBeLessThanOrEqual(25 * 25);
    });

    test('should have a goal', async () => {
        expect(map.goal).toBeGreaterThanOrEqual(0);
        expect(map.goal).toBeLessThanOrEqual(25 * 25);
    });

    test('should have a player that is not the goal', async () => {
        expect(map.player).not.toEqual(map.goal);
    });
});