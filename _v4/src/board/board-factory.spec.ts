import { describe, test, expect } from 'vitest';
import { IMap } from './types';
import { BoardFactory } from './board-factory';

const map: IMap = {
    width: 10,
    height: 10,
    cellWidth: 50,
    walls: new Set([10, 11, 12, 13]),
    goal: 0,
    player: 1
};


describe('board-factory', () => {
    test('create board sets boards primitive values', () => {
        const board = BoardFactory.createBoard(map);
        expect(board.width).toBe(map.width);
        expect(board.height).toBe(map.height);
        expect(board.cellWidth).toBe(map.cellWidth);
        expect(board.map).toBe(map);
    });

    describe('create cells', () => {
        test('creates the correct number of cells', () => {
            const cells = BoardFactory.createCells(map);
            expect(cells.length).toBe(map.width * map.height);
        });

        test('places walls correctly', () => {
            const cells = BoardFactory.createCells(map);
            map.walls.forEach((wall) => {
                expect(cells[wall].items.length).toBe(1);
                expect(cells[wall].items[0].type).toBe('wall');
            });
        });

        test('places the player correctly', () => {
            const cells = BoardFactory.createCells(map);
            expect(cells[map.player].items.length).toBe(1);
            expect(cells[map.player].items[0].type).toBe('player');
        });

        test('places goal correctly', () => {
            const cells = BoardFactory.createCells(map);
            expect(cells[map.goal].items.length).toBe(1);
            expect(cells[map.goal].items[0].type).toBe('goal');
        });

    });

});