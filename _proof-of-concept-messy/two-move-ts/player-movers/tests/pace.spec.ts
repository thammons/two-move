import assert from 'assert/strict';
import MiniSpec, { describe, it, beforeEach } from 'minispec';

import { PaceMover } from '../pace';
import { IMap, IPlayer } from '../../types';



//TODO handle way out of bounds

describe('PaceMover should generate valid moves', async () => {
    let mover: PaceMover | undefined = undefined;
    let player: IPlayer | undefined = undefined;
    let map: IMap | undefined = undefined;

    beforeEach(async () => {
        mover = new PaceMover();
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
    });

    it('generates valid moves, east/west', async () => {
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

        const actual = mover?.generateMoves(player!, map!, 10);

        assert.deepEqual(actual, expected);
    });

    it('generates valid moves, north/south', async () => {
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

        const actual = mover?.generateMoves(player!, map!, 10);

        assert.deepEqual(actual, expected);
    });
});


describe('PaceMover should generate moves', async () => {
    let mover: PaceMover | undefined = undefined;
    let player: IPlayer | undefined = undefined;
    let map: IMap | undefined = undefined;

    beforeEach(async () => {
        mover = new PaceMover();
        map = {
            width: 10,
            height: 10,
            cellWidth: 10,
            walls: [5, 10, 11, 12, 13, 14, 15],
            goal: 99,
            player: 0
        } as IMap;

        player = {
            direction: 'east',
            location: map.player,
            cellType: 'player',
            indicator: '>'
        } as IPlayer;
    });

    it('generates move with valid forward position - east', async () => {

        player!.direction = 'east';
        player!.location = 0;

        const expected = {
            direction: 'east',
            startLocation: player?.location,
            desitnationLocation: player?.location! + 1,
            isMove: true
        };

        const actual = mover?.getNextValidMove(player!.location, player!.direction, map!);

        assert.deepEqual(actual, expected);
    });

    it('generates move with valid forward position - west', async () => {

        player!.direction = 'west';
        player!.location = 1;

        const expected = {
            direction: 'west',
            startLocation: player?.location,
            desitnationLocation: player?.location! - 1,
            isMove: true
        };

        const actual = mover?.getNextValidMove(player!.location, player!.direction, map!);

        assert.deepEqual(actual, expected);
    });

    it('generates turn when blocked by wall - east', async () => {
        player!.direction = 'east';
        player!.location = 4;

        const expected = {
            direction: 'west',
            startLocation: player?.location,
            desitnationLocation: player?.location!,
            isMove: false
        };

        const actual = mover?.getNextValidMove(player!.location, player!.direction, map!);

        assert.deepEqual(actual, expected);
    });

    it('generates turn when blocked by wall - west', async () => {
        player!.direction = 'west';
        player!.location = 6;

        const expected = {
            direction: 'east',
            startLocation: player?.location,
            desitnationLocation: player?.location!,
            isMove: false
        };

        const actual = mover?.getNextValidMove(player!.location, player!.direction, map!);

        assert.deepEqual(actual, expected);
    });

    it('generates turn when at edge - east', async () => {
        player!.direction = 'east';
        player!.location = 19;

        const expected = {
            direction: 'west',
            startLocation: player?.location,
            desitnationLocation: player?.location!,
            isMove: false
        };

        const actual = mover?.getNextValidMove(player!.location, player!.direction, map!);

        assert.deepEqual(actual, expected);
    });

    it('generates turn when at edge - west', async () => {
        player!.direction = 'west';
        player!.location = 20;

        const expected = {
            direction: 'east',
            startLocation: player?.location,
            desitnationLocation: player?.location!,
            isMove: false
        };

        const actual = mover?.getNextValidMove(player!.location, player!.direction, map!);

        assert.deepEqual(actual, expected);
    });

    it('generates turn at end of the map - east', async () => {
        player!.direction = 'east';
        player!.location = 99;

        const expected = {
            direction: 'west',
            startLocation: player?.location,
            desitnationLocation: player?.location!,
            isMove: false
        };

        const actual = mover?.getNextValidMove(player!.location, player!.direction, map!);

        assert.deepEqual(actual, expected);
    });

    it('generates turn at end of the map - west', async () => {
        player!.direction = 'west';
        player!.location = 0;

        const expected = {
            direction: 'east',
            startLocation: player?.location,
            desitnationLocation: player?.location!,
            isMove: false
        };

        const actual = mover?.getNextValidMove(player!.location, player!.direction, map!);

        assert.deepEqual(actual, expected);
    });

});

describe('PaceMover move and turns work', async () => {
    let mover: PaceMover | undefined = undefined;

    beforeEach(async () => {
        mover = new PaceMover();
    });



    it('next location east', async () => {
        const expected = 11;
        const actual = mover?.getNextLocation(10, 'east', 10);

        assert.equal(actual, expected);
    });

    it('next location west', async () => {
        const expected = 9;
        const actual = mover?.getNextLocation(10, 'west', 10);

        assert.equal(actual, expected);
    });

    it('next location north', async () => {
        const expected = 10;
        const actual = mover?.getNextLocation(20, 'north', 10);

        assert.equal(actual, expected);
    });

    it('next location south', async () => {
        const expected = 30;
        const actual = mover?.getNextLocation(20, 'south', 10);

        assert.equal(actual, expected);
    });

    it('next direction east', async () => {
        const expected = 'west';
        const actual = mover?.getNextDirection('east');

        assert.equal(actual, expected);
    });

    it('next direction west', async () => {
        const expected = 'east';
        const actual = mover?.getNextDirection('west');

        assert.equal(actual, expected);
    });

    it('next direction north', async () => {
        const expected = 'south';
        const actual = mover?.getNextDirection('north');

        assert.equal(actual, expected);
    });

    it('next direction south', async () => {
        const expected = 'north';
        const actual = mover?.getNextDirection('south');

        assert.equal(actual, expected);
    });

});