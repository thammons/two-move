import { describe, test, expect } from 'vitest';
import { BoardEventHandler } from './board-events';
import { IBoard, IPlayer } from './types';

const board: IBoard = {
    width: 1,
    height: 1,
    cellWidth: 1,
    map: {
        width: 1,
        height: 1,
        cellWidth: 1,
        walls: [],
        goal: 0,
        player: 0
    }
};

const player: IPlayer = {
    type: "player",
    location: 0,
    direction: "north",
    getPlayerLocation: () => 0,
    setNextLocation: () => { },
    getNextMove: () => 0,
    getNextDirection: () => "north",
    turnRight: () => { }
};


describe('board-events', () => {

    describe('boardUpdate', () => {
        test('subscribes and triggers with arg', () => {
            let triggered = false;
            let boardArg: IBoard | undefined = undefined;
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToBoardUpdate(this, (args) => {
                boardArg = args.board;
                triggered = true;
            });
            boardEventHandler.triggerBoardUpdate({ board });

            expect(triggered).toBe(true);
            expect(boardArg).toBeDefined();
            expect(boardArg).toBe(board);

        });

        test('unsubscribe "board-update" unsubscribes and no longer responds to trigger', () => {
            let triggered = false;
            const object = { id: Date.now() };
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToBoardUpdate(object, (args) => {
                triggered = true;
            });
            boardEventHandler.unsubscribe(object, "board-update");
            boardEventHandler.triggerBoardUpdate({ board });

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
            });
            boardEventHandler.triggerCellUpdate({ cell: board.map[0], index: 0, isTemporary: false });

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
            });
            boardEventHandler.unsubscribe(object, "cell-update");
            boardEventHandler.triggerCellUpdate({ cell: board.map[0], index: 0, isTemporary: false });

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
            });
            boardEventHandler.triggerInvalidStep({ direction: "north", player, newLocation: board.map[0] });

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
            });
            boardEventHandler.unsubscribe(object, "invalid-step");
            boardEventHandler.triggerInvalidStep({ direction: "north", player, newLocation: board.map[0] });

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
            boardEventHandler.subscribeToBoardUpdate(object, (args) => {
                triggeredBoard = true;
            });
            boardEventHandler.subscribeToCellUpdate(object, (args) => {
                triggeredCell = true;
            });
            boardEventHandler.unsubscribe(object, "board-update");
            boardEventHandler.triggerBoardUpdate({ board });
            boardEventHandler.triggerCellUpdate({ cell: board.map[0], index: 0, isTemporary: false });

            expect(triggeredBoard).toBe(false);
            expect(triggeredCell).toBe(true);
        });

        test('unsubscribe by owner unsubscribes and no longer responds to trigger, but other handlers still respond', () => {
            let triggeredBoard1 = false;
            let triggeredBoard2 = false;
            const object1 = { id: Date.now() };
            const object2 = { id: Date.now() };
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToBoardUpdate(object1, (args) => {
                triggeredBoard1 = true;
            });
            boardEventHandler.subscribeToBoardUpdate(object2, (args) => {
                triggeredBoard2 = true;
            });
            boardEventHandler.unsubscribe(object1);
            boardEventHandler.triggerBoardUpdate({ board });

            expect(triggeredBoard1).toBe(false);
            expect(triggeredBoard2).toBe(true);
        });

        test('unsubscribe by non-existing owner does nothing', () => {
            let triggeredBoard1 = false;
            let triggeredBoard2 = false;
            const object1 = { id: Date.now() };
            const object2 = { id: Date.now() };
            const boardEventHandler = new BoardEventHandler();
            boardEventHandler.subscribeToBoardUpdate(object1, (args) => {
                triggeredBoard1 = true;
            });
            boardEventHandler.subscribeToBoardUpdate(object2, (args) => {
                triggeredBoard2 = true;
            });
            boardEventHandler.unsubscribe({ id: 0 });
            boardEventHandler.triggerBoardUpdate({ board });

            expect(triggeredBoard1).toBe(true);
            expect(triggeredBoard2).toBe(true);
        });
});
});