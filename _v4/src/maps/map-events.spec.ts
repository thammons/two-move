import { describe, test, expect } from 'vitest';
import { BoardEventHandler } from './map-events';
import { IMap, IPlayer } from './types';

const mapState: IMap = {
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

const player: IPlayer = {
    type: "player",
    location: 0,
    nextDirectionMap: new Map(),
    direction: "east"
};


describe('board-events', () => {

    describe('boardUpdate', () => {
        test('subscribes and triggers with arg', () => {
            let triggered = false;
            let boardArg: IMap | undefined = undefined;
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToMapStateUpdate(this, (args) => {
                boardArg = args.mapState;
                triggered = true;
                return args;
            });
            boardEventHandler.triggerMapStateUpdate({ mapState: mapState });

            expect(triggered).toBe(true);
            expect(boardArg).toBeDefined();
            expect(boardArg).toBe(mapState);

        });

        test('unsubscribe "board-update" unsubscribes and no longer responds to trigger', () => {
            let triggered = false;
            const object = { id: Date.now() };
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToMapStateUpdate(object, (args) => {
                triggered = true;
                return args;
            });
            boardEventHandler.unsubscribe(object, "map-state-update");
            boardEventHandler.triggerMapStateUpdate({ mapState: mapState });

            expect(triggered).toBe(false);
        });
    });

    describe('cellUpdate', () => {
        test('subscribes and triggers with arg', () => {
            let triggered = false;
            let cellArg: number | undefined = undefined;
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToCellUpdate(this, (args) => {
                cellArg = args.index;
                triggered = true;
                return args;
            });
            boardEventHandler.triggerCellUpdate({ cell: mapState.mapItems.get('player')!, index: 0, isTemporary: false });

            expect(triggered).toBe(true);
            expect(cellArg).toBeDefined();
            expect(cellArg).toBe(0);

        });
        test('unsubscribe "cell-update" unsubscribes and no longer responds to trigger', () => {
            let triggered = false;
            const object = { id: Date.now() };
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToCellUpdate(object, (args) => {
                triggered = true;
                return args;
            });
            boardEventHandler.unsubscribe(object, "cell-update");
            boardEventHandler.triggerCellUpdate({ cell: mapState.mapItems.get('player')!, index: 0, isTemporary: false });

            expect(triggered).toBe(false);
        });

    });

    describe('moved', () => {
        test('subscribes and triggers with arg', () => {
            let triggered = false;

            let playerArg: number | undefined = undefined;
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToMoved(this, (args) => {
                playerArg = args.location;
                triggered = true;
                return args;
            });
            boardEventHandler.triggerMoved(player);

            expect(triggered).toBe(true);
            expect(playerArg).toBeDefined();
            expect(playerArg).toBe(0);

        });
        test('unsubscribe "moved" unsubscribes and no longer responds to trigger', () => {
            let triggered = false;
            const object = { id: Date.now() };
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToMoved(object, (args) => {
                triggered = true;
                return args;
            });
            boardEventHandler.unsubscribe(object, "moved");
            boardEventHandler.triggerMoved(player);

            expect(triggered).toBe(false);
        });

    });

    describe('invalidStep', () => {
        test('subscribes and triggers with arg', () => {
            let triggered = false;

            let playerArg: IPlayer | undefined = undefined;
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToInvalidStep(this, (args) => {
                playerArg = args.player;
                triggered = true;
                return args;
            });
            boardEventHandler.triggerInvalidStep({ direction: "north", player, newLocation: mapState.mapItems.get('player')! });

            expect(triggered).toBe(true);
            expect(playerArg).toBeDefined();
            expect(playerArg).toBe(player);

        });
        test('unsubscribe "invalid-step" unsubscribes and no longer responds to trigger', () => {
            let triggered = false;
            const object = { id: Date.now() };
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToInvalidStep(object, (args) => {
                triggered = true;
                return args;
            });
            boardEventHandler.unsubscribe(object, "invalid-step");
            boardEventHandler.triggerInvalidStep({ direction: "north", player, newLocation: mapState.mapItems.get('player')! });

            expect(triggered).toBe(false);
        });

    });

    describe('winCondition', () => {
        test('subscribes and triggers with arg', () => {
            let triggered = false;
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToWinCondition(this, () => {
                triggered = true;
            });
            boardEventHandler.triggerWinCondition();

            expect(triggered).toBe(true);
        });
        test('unsubscribe "win-condition" unsubscribes and no longer responds to trigger', () => {
            let triggered = false;
            const object = { id: Date.now() };
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToWinCondition(object, () => {
                triggered = true;
            });
            boardEventHandler.unsubscribe(object, "win-condition");
            boardEventHandler.triggerWinCondition();

            expect(triggered).toBe(false);
        });

    });

    //TODO: test Unsubscribe - should not fire events for object, should fire other events
    describe('unsubscribe', () => {
        test('unsubscribe "board-update" unsubscribes and no longer responds to trigger, but "cell-update" triggers still respond', () => {
            let triggeredBoard = false;
            let triggeredCell = false;
            const object = { id: Date.now() };
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToMapStateUpdate(object, (args) => {
                triggeredBoard = true;
                return args;
            });
            boardEventHandler.subscribeToCellUpdate(object, (args) => {
                triggeredCell = true;
                return args;
            });
            boardEventHandler.unsubscribe(object, "map-state-update");
            boardEventHandler.triggerMapStateUpdate({ mapState: mapState });
            boardEventHandler.triggerCellUpdate({ cell: mapState.mapItems.get('player')!, index: 0, isTemporary: false });

            expect(triggeredBoard).toBe(false);
            expect(triggeredCell).toBe(true);
        });

        test('unsubscribe by owner unsubscribes and no longer responds to trigger, but other handlers still respond', () => {
            let triggeredBoard1 = false;
            let triggeredBoard2 = false;
            const object1 = { id: Date.now() };
            const object2 = { id: Date.now() };
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToMapStateUpdate(object1, (args) => {
                triggeredBoard1 = true;
                return args;
            });
            boardEventHandler.subscribeToMapStateUpdate(object2, (args) => {
                triggeredBoard2 = true;
                return args;
            });
            boardEventHandler.unsubscribe(object1);
            boardEventHandler.triggerMapStateUpdate({ mapState: mapState });

            expect(triggeredBoard1).toBe(false);
            expect(triggeredBoard2).toBe(true);
        });

        test('unsubscribe by non-existing owner does nothing', () => {
            let triggeredBoard1 = false;
            let triggeredBoard2 = false;
            const object1 = { id: Date.now() };
            const object2 = { id: Date.now() };
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToMapStateUpdate(object1, (args) => {
                triggeredBoard1 = true;
                return args;
            });
            boardEventHandler.subscribeToMapStateUpdate(object2, (args) => {
                triggeredBoard2 = true;
                return args;
            });
            boardEventHandler.unsubscribe({ id: 0 });
            boardEventHandler.triggerMapStateUpdate({ mapState: mapState });

            expect(triggeredBoard1).toBe(true);
            expect(triggeredBoard2).toBe(true);
        });
    });

    //TODO TEST args passthrough (handler A returns args to handler B)
    //TODO TEST priority (handler B with a higher priority than handler A)
});