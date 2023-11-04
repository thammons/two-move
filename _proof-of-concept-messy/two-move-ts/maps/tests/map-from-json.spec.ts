import assert from 'assert/strict';
import MiniSpec, { describe, it, beforeEach } from 'minispec';
import { NullableIMap, MapFromJson } from '../map-from-json';

describe('map-from-json creates a map', async () => {
    let validMap: NullableIMap | undefined = undefined;

    beforeEach(async () => {
        validMap = {
            width: 10,
            height: 10,
            cellWidth: 50,
            player: 0,
            goal: 99,
            walls: []
        };
    });

    it('creates a map from a valid script', async () => {
        const map = MapFromJson._validateSettings(validMap!);

        assert.equal(map.width, validMap!.width);
        assert.equal(map.height, validMap!.height);
        assert.equal(map.cellWidth, validMap!.cellWidth);
        assert.equal(map.player, validMap!.player);
        assert.equal(map.goal, validMap!.goal);
        assert.equal(map.walls, validMap!.walls);
    });

    it('throws an error if the map does not have a width', async () => {
        validMap!.width = undefined;
        assert.throws(() => MapFromJson._validateSettings(validMap!), Error('map does not have a width'));
    });

    it('throws an error if the map does not have a height', async () => {
        validMap!.height = undefined;
        assert.throws(() => MapFromJson._validateSettings(validMap!), Error('map does not have a height'));
    });

    it('throws an error if the map does not have a cellWidth', async () => {
        validMap!.cellWidth = undefined;
        assert.throws(() => MapFromJson._validateSettings(validMap!), Error('map does not have a cellWidth'));
    });

    it('throws an error if the map does not have a player', async () => {
        validMap!.player = undefined;
        assert.throws(() => MapFromJson._validateSettings(validMap!), Error('map does not have a player'));
    });

    it('throws an error if the map does not have a goal', async () => {
        validMap!.goal = undefined;
        assert.throws(() => MapFromJson._validateSettings(validMap!), Error('map does not have a goal'));
    });

    it('throws an error if the map does not have walls', async () => {
        validMap!.walls = undefined;
        assert.throws(() => MapFromJson._validateSettings(validMap!), Error('map does not have walls'));
    });

    it('throws an error if the map walls is not an array', async () => {
        validMap!.walls = {} as number[];
        assert.throws(() => MapFromJson._validateSettings(validMap!), Error('map walls is not an array'));
    });

});

MiniSpec.execute()
