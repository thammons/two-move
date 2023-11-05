import assert from 'assert/strict';
import MiniSpec, { describe, it, beforeEach } from 'minispec';

import MapGenerated from '../generate-map1';

describe('MapGenerated generateWall', async () => {
    let map: MapGenerated | undefined = undefined;

    beforeEach(async () => {
        map = new MapGenerated(0, 25, 25, 25, 1);
    });

    it('should generate a wall', async () => {
        const result = map!.generateWall();
        assert.notEqual(result, undefined);
        assert.ok(result.length);
    });
});

describe('MapGenerated structural integrity checks', async () => {
    let map: MapGenerated | undefined = undefined;

    beforeEach(async () => {
        map = new MapGenerated(0, 25, 25, 25, 1);
    });

    it('should have a width', async () => {
        assert.equal(map!.width, 25);
    });

    it('should have a height', async () => {
        assert.equal(map!.height, 25);
    });

    it('should have a cellWidth', async () => {
        assert.equal(map!.cellWidth, 25);
    });

    it('should have walls', async () => {
        assert.notEqual(map!.walls.length, undefined);
    });

    it('should have a player', async () => {
        assert.notEqual(map!.goal, undefined);
        assert.ok(map!.goal >= 0, 'goal is not greater than or equal to 0');
        assert.ok(map!.goal <= 25 * 25, 'goal is not less than or equal to map size');
    });

    it('should have a goal', async () => {
        assert.notEqual(map!.goal, undefined);
        assert.ok(map!.goal >= 0, 'goal is not greater than or equal to 0');
        assert.ok(map!.goal <= 25 * 25, 'goal is not less than or equal to map size');
    });

    it('should have a player that is not the goal', async () => {
        assert.notEqual(map!.player, map!.goal);
    });
});