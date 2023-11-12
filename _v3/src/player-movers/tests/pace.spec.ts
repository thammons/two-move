import { describe, expect, test } from 'vitest';

import { PaceMover } from '../pace-2';
import { IMap, IPlayer } from '../../types';

let mover: PaceMover | undefined = undefined;
let player: IPlayer | undefined = undefined;
let map: IMap | undefined = undefined;

mover = new PaceMover(120);
map = {
    width: 10,
    height: 5,
    cellWidth: 10,
    walls: [5, 10, 11, 12, 13, 14, 15],
    goal: 49,
    player: 0
} as IMap;

player = {
    direction: 'east',
    location: map.player,
    cellType: 'player',
    indicator: '>'
} as IPlayer;

//TODO Speed

//TODO handle way out of bounds

//TODO 

describe('PaceMover should generate valid moves', async () => {

    test('FIX generates valid moves, east/west', async () => {
        player!.location = 25;

        const expected = [
            {
                direction: 'east',
                startLocation: 25,
                desitnationLocation: 26,
                isMove: true
            },
            {
                direction: 'east',
                startLocation: 26,
                desitnationLocation: 27,
                isMove: true
            },
            {
                direction: 'east',
                startLocation: 27,
                desitnationLocation: 28,
                isMove: true
            },
            {
                direction: 'east',
                startLocation: 28,
                desitnationLocation: 29,
                isMove: true
            },
            {
                direction: 'west',
                startLocation: 29,
                desitnationLocation: 29,
                isMove: false
            },
            {
                direction: 'west',
                startLocation: 29,
                desitnationLocation: 28,
                isMove: true
            },
            {
                direction: 'west',
                startLocation: 28,
                desitnationLocation: 27,
                isMove: true
            },
            {
                direction: 'west',
                startLocation: 27,
                desitnationLocation: 26,
                isMove: true
            },
            {
                direction: 'west',
                startLocation: 26,
                desitnationLocation: 25,
                isMove: true
            },
            {
                direction: 'west',
                startLocation: 25,
                desitnationLocation: 24,
                isMove: true
            }
        ];


        //TODO: fix this test
        // const actual = mover?.generateMoves(player!, map!, 10);

        // expect(actual).toMatchObject(expected);
    });

    test('FIX generates valid moves, north/south', async () => {
        player!.direction = 'north';
        player!.location = 30;

        const expected = [
            {
                direction: 'north',
                startLocation: 30,
                desitnationLocation: 20,
                isMove: true
            },
            {
                direction: 'south',
                startLocation: 20,
                desitnationLocation: 20,
                isMove: false
            },
            {
                direction: 'south',
                startLocation: 20,
                desitnationLocation: 30,
                isMove: true
            },
            {
                direction: 'south',
                startLocation: 30,
                desitnationLocation: 40,
                isMove: true
            },
            {
                direction: 'north',
                startLocation: 40,
                desitnationLocation: 40,
                isMove: false
            },
            {
                direction: 'north',
                startLocation: 40,
                desitnationLocation: 30,
                isMove: true
            },
            {
                direction: 'north',
                startLocation: 30,
                desitnationLocation: 20,
                isMove: true
            },
            {
                direction: 'south',
                startLocation: 20,
                desitnationLocation: 20,
                isMove: false
            },
            {
                direction: 'south',
                startLocation: 20,
                desitnationLocation: 30,
                isMove: true
            },
            {
                direction: 'south',
                startLocation: 30,
                desitnationLocation: 40,
                isMove: true
            }
        ];

        // const actual = mover?.generateMoves(player!, map!, 10);

        // expect(actual).toMatchObject(expected);
    });
});


describe('PaceMover should generate moves', async () => {
    test('FIX generates move with valid forward position - east', async () => {

        // player!.direction = 'east';
        // player!.location = 0;

        // const expected = {
        //     direction: 'east',
        //     startLocation: player?.location,
        //     desitnationLocation: player?.location! + 1,
        //     isMove: true
        // };

        // const actual = mover?.getNextMove(player!, );

        // assert.deepEqual(actual, expected);
    });

    test('FIX generates turn when blocked by wall - east', async () => {
        // player!.direction = 'east';
        // player!.location = 4;

        // const expected = {
        //     direction: 'west',
        //     startLocation: player?.location,
        //     desitnationLocation: player?.location!,
        //     isMove: false
        // };

        // const actual = mover?.getNextValidMove(player!.location, player!.direction, map!);

        // assert.deepEqual(actual, expected);
    });

    test('FIX generates turn when at edge - east', async () => {
        // player!.direction = 'east';
        // player!.location = 19;

        // const expected = {
        //     direction: 'west',
        //     startLocation: player?.location,
        //     desitnationLocation: player?.location!,
        //     isMove: false
        // };

        // const actual = mover?.getNextValidMove(player!.location, player!.direction, map!);

        // assert.deepEqual(actual, expected);
    });

    test('FIX generates turn at end of the map - east', async () => {
        // player!.direction = 'east';
        // player!.location = 99;

        // const expected = {
        //     direction: 'west',
        //     startLocation: player?.location,
        //     desitnationLocation: player?.location!,
        //     isMove: false
        // };

        // const actual = mover?.getNextValidMove(player!.location, player!.direction, map!);

        // assert.deepEqual(actual, expected);
    });

  

});

// describe('PaceMover move and turns work', async () => {

// });