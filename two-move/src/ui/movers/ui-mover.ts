
import { Move } from "../../board/move";
import { IBoard, IMove, IPlayer } from "../../types";
import { IUIEvents, IUIMover, IUIUserInteractions } from "../types";

export class UIMover implements IUIMover {
    speed: number = 250;
    private moves: IMove[] = [];
    private eventer: IUIUserInteractions | undefined = undefined;

    constructor(speed: number) {
        this.speed = speed;
    }

    clear() {
        this.moves = [];
    }

    getNextMove(player: IPlayer, board: IBoard): IMove {

        //if no moves, just wait
        if (!this.moves.length)
            return new Move(player.direction, player.location, player.location);
        return this.moves.shift()!;
    }

    private getLastMove(player: IPlayer) {
        let lastMove = new Move(player.direction, player.location, player.location);
        if (this.moves.length > 0)
            lastMove = Move.init(this.moves[this.moves.length - 1])
        return lastMove;
    }

    move(player: IPlayer, board: IBoard) {
        const lastMove = this.getLastMove(player);
        let nextMove = lastMove.getNextMove(board.map.width);

        //one invalid move is allowed
        if (!lastMove.isValidMove(board.map)) {
            nextMove = Move.init(lastMove);
        }
        this.moves.push(nextMove);

    }

    turnRight(player: IPlayer, board: IBoard) {
        const lastMove = this.getLastMove(player);

        const nextMove = lastMove.getNextDirection();
        this.moves.push(nextMove);
    }

    restart() {
        this.moves = [];
    }

    wireEventHandlers(player: IPlayer, board: IBoard, createEventer: (events: IUIEvents) => IUIUserInteractions): IUIEvents {
        const userEvents: IUIEvents = {
            moveHandlers: [() => this.move(player, board)],
            turnHandlers: [() => this.turnRight(player, board)],
            lightHandlers: [],
            resetHandlers: [() => this.restart()],
            saveMapHandlers: [],

        }
        this.eventer = createEventer(userEvents);
        return userEvents;
    }
}