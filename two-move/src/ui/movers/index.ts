import { IBoard, IPlayer } from "../../types";
import { ButtonInteractions, KeyboardInteractions } from "..";
import { IUIEvents, IUIMover } from "../types";
import { UIMover } from "./ui-mover";

export function getKeyboardMover(speed: number, player: IPlayer, board: IBoard): IUIMover {
    const mover = new UIMover(speed);
    const createEventer = (events: IUIEvents) => new KeyboardInteractions(events);
    mover.wireEventHandlers(player, board, createEventer);
    return mover;
}

export function getButtonMover(speed: number, player: IPlayer, board: IBoard): IUIMover {
    const mover = new UIMover(speed);
    const createEventer = (events: IUIEvents) => new ButtonInteractions(events);
    mover.wireEventHandlers(player, board, createEventer);
    return mover;
}

//nearly identical to PlayerMovers/index's Mover.makeMoves
export class UIMoverRunner {
    private makeMoveTimeout: NodeJS.Timeout | undefined = undefined;
    private halted: boolean = false;
    runQueue = (mover: IUIMover, player: IPlayer, board: IBoard) => {
        if (this.halted)
            return;

        try {
            const move = mover.getNextMove(player, board);
            const playerMoved = move.direction !== player.direction || move.desitnationLocation !== player.location;
            if (playerMoved) {
                player.direction = move.direction;
                player.indicator = player.getIndicator();

                if (move.isMove)
                    board.move(player, move.startLocation, move.desitnationLocation);
                else
                    board.updateCell(board.getItemLocations('player')[0])

                if (!!this.makeMoveTimeout)
                    clearTimeout(this.makeMoveTimeout);
            }

            this.makeMoveTimeout = setTimeout(() => {
                this.runQueue(mover, player, board);
            }, mover.speed);
        }
        catch (ex) {
            console.error('runQueue failed', ex);
        }
    }

    halt() {
        this.halted = true;
    }
}
