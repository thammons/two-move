import { describe, test, expect } from 'vitest';
import * as Validator from './map-validator';
import * as Utils from './map-utils';

import * as MapValidator from './map-validator';
import { IMap } from './types';

const mapSetting: IMap = {
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

describe('map-validator', () => {
    
    test('returns a copy of a valid map', () => {
        const result = MapValidator.validateMap(mapSetting);
        expect(result).toBeDefined();
        expect(result).not.toBe(mapSetting);
    });

    test('returns undefined if player is out of bounds', () => {   
        const invalidMap = Utils.cloneMap(mapSetting);
        invalidMap.mapItems.get('player')![0].location = -1;

        const result = MapValidator.validateMap(invalidMap);
        expect(result).toBeUndefined();
    });
    
    test('returns undefined if goal is out of bounds', () => {   
        const invalidMap = Utils.cloneMap(mapSetting);
        invalidMap.mapItems.get('goal')![0].location = -1;

        const result = MapValidator.validateMap(invalidMap);
        expect(result).toBeUndefined();
    });

    test('returns undefined if walls are out of bounds', () => {
        const invalidMap = Utils.cloneMap(mapSetting);
        invalidMap.mapItems.get('wall')![0].location = -1;

        const result = MapValidator.validateMap(invalidMap);
        expect(result).toBeUndefined();
    });

    test('returns undefined if player overlaps any walls', () => {
        const invalidMap = Utils.cloneMap(mapSetting);
        invalidMap.mapItems.get('player')![0].location = invalidMap.mapItems.get('wall')![0].location;

        const result = MapValidator.validateMap(invalidMap);
        expect(result).toBeUndefined();
    });

    test('returns undefined if goal overlaps any walls', () => {
        const invalidMap = Utils.cloneMap(mapSetting);
        invalidMap.mapItems.get('goal')![0].location = invalidMap.mapItems.get('wall')![0].location;

        const result = MapValidator.validateMap(invalidMap);
        expect(result).toBeUndefined();
    });


});

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

describe('check for collisions', () => {

    test('isMaxEast returns true when the player is beyond the map width', () => {
        const result = Validator.isMaxEast(9, 10);

        expect(result).toBeDefined();
        expect(result).toBe(true);
    });

    test('isMaxEast returns false when the player is not beyond the map width', () => {
        const result = Validator.isMaxEast(8, 10);

        expect(result).toBeDefined();
        expect(result).toBe(false);
    });

    test('isMaxWest returns true when the player is beyond the map width', () => {
        const result = Validator.isMaxWest(10, 10);

        expect(result).toBeDefined();
        expect(result).toBe(true);
    });

    test('isMaxWest returns false when the player is not beyond the map width', () => {
        const result = Validator.isMaxWest(9, 10);

        expect(result).toBeDefined();
        expect(result).toBe(false);
    });

    test('the next move is valid when next move is in bounds', () => {
        const result = Validator.isNextMoveValid(map, 1);

        expect(result).toBeDefined();
        expect(result).toBe(true);
    });

    test('the next move is not valid when next move is out of bounds (-1)', () => {
        const result = Validator.isNextMoveValid(map, -1);

        expect(result).toBeDefined();
        expect(result).toBe(false);
    });

    test('the next move is not valid when next move is out of bounds (100)', () => {
        const result = Validator.isNextMoveValid(map, 100);

        expect(result).toBeDefined();
        expect(result).toBe(false);
    });

    test('the next move is not valid when next move is out of bounds (next position 10)', () => {
        const result = Validator.isNextMoveValid(map, 10);

        expect(result).toBeDefined();
        expect(result).toBe(false);
    });

    test('the next move is not valid when next move is out of bounds (next position 9)', () => {
       
        const newMap = Utils.cloneMap(map);
        newMap.mapItems.get('player')![0].direction = 'west';
        newMap.mapItems.get('player')![0].location = 0;
        const result = Validator.isNextMoveValid(newMap, 9);

        expect(result).toBeDefined();
        expect(result).toBe(false);
    });

    test('isNextMoveWall returns true when next move is a wall', () => {
        const result = Validator.isNextMoveWall(map, 20);

        expect(result).toBeDefined();
        expect(result).toBe(true);
    });

    test('isNextMoveWall returns false when next move is not a wall', () => {
        const result = Validator.isNextMoveWall(map, 1);

        expect(result).toBeDefined();
        expect(result).toBe(false);
    });

    test('negative value, player west, add attribute error-west', () => {
        const newMap = Utils.cloneMap(map);
        newMap.mapItems.get('player')![0].direction = 'west';
        newMap.mapItems.get('player')![0].location = 0;

        const expectedPlayer = { type: "player", location: 0, direction: 'west', attributes: ['error-west'] };
        const result = Validator.checkPlayerCollision(newMap);

        expect(result).toBeDefined();
        expect(result.isCollision).toBe(true);
        expect(result.map.mapItems.get('player')![0].attributes).toEqual(['error-west']);
        expect(result.map.mapItems.get('player')![0]).toEqual(expectedPlayer);
    });

    test('> 100 value, player east, add attribute error-east', () => {
        const newMap = Utils.cloneMap(map);
        newMap.mapItems.get('player')![0].direction = 'east';
        newMap.mapItems.get('player')![0].location = 99;

        const expectedPlayer = { type: "player", location: 99, direction: 'east', attributes: ['error-east'] };
        const result = Validator.checkPlayerCollision(newMap);

        expect(result).toBeDefined();
        expect(result.isCollision).toBe(true);
        expect(result.map.mapItems.get('player')![0].attributes).toEqual(['error-east']);
        expect(result.map.mapItems.get('player')![0]).toEqual(expectedPlayer);
    });

    test('next column, player east, add attribute error-east', () => {
        const newMap = Utils.cloneMap(map);
        newMap.mapItems.get('player')![0].direction = 'east';
        newMap.mapItems.get('player')![0].location = 9;

        const expectedPlayer = { type: "player", location: 9, direction: 'east', attributes: ['error-east'] };
        const result = Validator.checkPlayerCollision(newMap);

        expect(result).toBeDefined();
        expect(result.isCollision).toBe(true);
        expect(result.map.mapItems.get('player')![0].attributes).toEqual(['error-east']);
        expect(result.map.mapItems.get('player')![0]).toEqual(expectedPlayer);
    });
    
    test('next row, player south, add attribute error-south', () => {
        const newMap = Utils.cloneMap(map);
        newMap.mapItems.get('player')![0].direction = 'south';
        newMap.mapItems.get('player')![0].location = 95;

        const expectedPlayer = { type: "player", location: 95, direction: 'south', attributes: ['error-south'] };
        const result = Validator.checkPlayerCollision(newMap);

        expect(result).toBeDefined();
        expect(result.isCollision).toBe(true);
        expect(result.map.mapItems.get('player')![0].attributes).toEqual(['error-south']);
        expect(result.map.mapItems.get('player')![0]).toEqual(expectedPlayer);
    });

    test('previous column, player west, add attribute error-west', () => {
        const newMap = Utils.cloneMap(map);
        newMap.mapItems.get('player')![0].direction = 'west';
        newMap.mapItems.get('player')![0].location = 10;

        const expectedPlayer = { type: "player", location: 10, direction: 'west', attributes: ['error-west'] };
        const result = Validator.checkPlayerCollision(newMap);

        expect(result).toBeDefined();
        expect(result.isCollision).toBe(true);
        expect(result.map.mapItems.get('player')![0].attributes).toEqual(['error-west']);
        expect(result.map.mapItems.get('player')![0]).toEqual(expectedPlayer);
    });

    test('previous row, player north, add attribute error-north', () => {
        const newMap = Utils.cloneMap(map);
        newMap.mapItems.get('player')![0].direction = 'north';
        newMap.mapItems.get('player')![0].location = 5;

        const expectedPlayer = { type: "player", location: 5, direction: 'north', attributes: ['error-north'] };
        const result = Validator.checkPlayerCollision(newMap);

        expect(result).toBeDefined();
        expect(result.isCollision).toBe(true);
        expect(result.map.mapItems.get('player')![0].attributes).toEqual(['error-north']);
        expect(result.map.mapItems.get('player')![0]).toEqual(expectedPlayer);
    });


});