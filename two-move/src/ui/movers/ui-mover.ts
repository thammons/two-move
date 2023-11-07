import { KeyboardInteractions } from "..";
import { Move } from "../../board/move";
import { IBoard, IMove, IMover, IPlayer } from "../../types";
import { IUIEvents } from "../ui-user-events";
import { IUIUserInteractions } from "../user-interactions/types";


export interface IUIMover extends IMover {
    speed: number;
    move(player: IPlayer): void;
    turnRight(player: IPlayer, board: IBoard): void;
    restart(): void;
    wireEventHandlers(player: IPlayer, board: IBoard, createEventer: (events: IUIEvents) => IUIUserInteractions): IUIEvents;
}

//nearly identical to PlayerMovers/index's Mover.makeMoves
export class UIMoverRunner {
    private makeMoveTimeout: NodeJS.Timeout | undefined = undefined;
    private halted: boolean = false;
    runQueue = (mover: IUIMover, player: IPlayer, board: IBoard) => {
        if (this.halted)
            return;

        const move = mover.getNextMove(player, board);
        // console.log(move);
        player.direction = move.direction;
        player.indicator = player.getIndicator();

        if (move.isMove)
            board.move(player, player.getPlayerLocation(), player.getNextMove());

        if (!!this.makeMoveTimeout)
            clearTimeout(this.makeMoveTimeout);

        this.makeMoveTimeout = setTimeout(() => {
            this.runQueue(mover, player, board);
            // console.log('makeMoves', move)
        }, mover.speed);
    }
}

export class UIMover implements IUIMover {
    speed: number = 250;
    private moves: IMove[] = [];
    private eventer: IUIUserInteractions | undefined = undefined;

    constructor(speed: number) {
        this.speed = speed;
    }

    getNextMove(player: IPlayer, board: IBoard): IMove {

        //if no moves, just wait
        if (!this.moves.length)
            return new Move(player.direction, player.location, player.location);
        return this.moves.shift()!;
    }

    move(player: IPlayer) {
        this.moves.push(new Move(player.direction, player.location, player.getNextMove()));
    }

    turnRight(player: IPlayer, board: IBoard) {
        let lastMove = Move.init(this.moves[this.moves.length - 1]);
        if (!lastMove)
            lastMove = new Move(player.direction, player.location, player.location);

        const nextMove = lastMove.getNextDirection();
        this.moves.push(nextMove);
    }

    restart() {
        this.moves = [];
    }

    wireEventHandlers(player: IPlayer, board: IBoard, createEventer: (events: IUIEvents) => IUIUserInteractions): IUIEvents {
        const userEvents: IUIEvents = {
            moveHandlers: [() => this.move(player)],
            turnHandlers: [() => this.turnRight(player, board)],
            lightHandlers: [],
            resetHandlers: [() => this.restart()],
            saveMapHandlers: [],

        }
        this.eventer = createEventer(userEvents);
        return userEvents;
    }


}


export function getKeyboardMover(speed: number, player: IPlayer, board: IBoard): IUIMover {
    const mover = new UIMover(speed);
    const createEventer = (events: IUIEvents) => new KeyboardInteractions(events);
    mover.wireEventHandlers(player, board, createEventer);
    return mover;
}