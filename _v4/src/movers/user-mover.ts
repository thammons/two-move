import { BoardEventHandler } from "board/board-events";
import { IBoard, IPlayer } from "board/types";
import { UserEventHandler } from "infrastructure/events/user-events";

export class UserMover {
    board: IBoard;
    player: IPlayer;

    constructor(board: IBoard, player: IPlayer) {
        this.board = board;
        this.player = player;
    }

    setupEvents(handlers: UserEventHandler) {
        handlers.subscribeMoveForward(this, this.moveForward)
            .subscribeTurn(this, this.turn);
    }

    clearEvents(handlers: UserEventHandler) {
        handlers.unsubscribe(this);
    }

    moveForward() {
    }

    turn() {

    }
}