
import { Move } from "../../board/move";
import { IBoard, IMove, IPlayer } from "../../types";
import { IUIEvents, IUIMover, IUIUserInteractions } from "../types";

export class UIMover implements IUIMover {
    speed: number = 250;
    private moves: Move[] = [];
    private pause = false;
    private eventer: IUIUserInteractions | undefined = undefined;

    constructor(speed: number) {
        this.speed = speed;
    }

    clear() {
        //This is causing problems on blockly
        // should just remove invalid moves based on player position
        //this.moves = [];

        //should self heal now
    }

    getNextMove(player: IPlayer, board: IBoard): IMove {
        //if no moves, just wait
        if (this.pause || !this.moves.length)
            return new Move(player.direction, player.location, player.location);
        return this.moves.shift()!;
    }

    move(player: IPlayer, board: IBoard) {
        if (this.pause)
            return;

        const lastMove = this.getLastMove(player);
        let nextMove = lastMove.getNextMove(board.map.width);

        //one invalid move is allowed
        if (!lastMove.isValidMove(board.map, player.location)) {
            this.clearInvalidMoves(board, player);
            nextMove = Move.init(lastMove);
        }

        this.moves.push(nextMove);
        this.clearDuplicateMoves();
    }

    turnRight(player: IPlayer, board: IBoard) {
        if (this.pause)
            return;

        const lastMove = this.getLastMove(player);

        const nextMove = lastMove.getNextDirection();
        this.moves.push(nextMove);
    }

    private getLastMove(player: IPlayer) {
        let lastMove = new Move(player.direction, player.location, player.location);
        if (this.moves.length > 0)
            lastMove = Move.init(this.moves[this.moves.length - 1])
        return lastMove;
    }

    private clearInvalidMoves(board: IBoard, player: IPlayer) {
        this.pause = true;
        this.moves = this.moves.filter(m => m.isValidMove(board.map));
        this.pause = false;
    }

    private clearDuplicateMoves() {
        this.pause = true;
        for (let i = 1; i < this.moves.length; i++) {
            const move = this.moves[i - 1];
            const nextMove = this.moves[i];
            if (move.startLocation === nextMove.startLocation
                && move.desitnationLocation === nextMove.desitnationLocation
                && move.direction === nextMove.direction) {
                this.moves.splice(i, 1);
                i--;
            }
        };
        this.pause = false;
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