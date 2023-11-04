import assert from 'assert/strict';
import MiniSpec, { describe, it, beforeEach } from 'minispec';

import MapGenerated from '../generate-map1';

describe('Save Maps - ', async () => {
    let map: MapGenerated | undefined = undefined;

    beforeEach(async () => {
        map = new MapGenerated(0, 25, 25, 25, 1);
    });

    it('', async () => {
        const result = map!.generateWall();
        assert.notEqual(result, undefined);
        assert.ok(result.length);
    });
});

describe('reads in a map and saves the it with the level number', async () => {
    let map: MapGenerated | undefined = undefined;

    beforeEach(async () => {
        map = new MapGenerated(0, 25, 25, 25, 1);
    });

});
