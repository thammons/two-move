import { Move } from "../board/move";
import { IBoard, IMove, IMover, IPlayer } from "../types";

export class MoverRunner {
    private makeMoveTimeouts: NodeJS.Timeout[] = [];
    private halted: boolean = false;

    halt() {
        this.halted = true;
        this.makeMoveTimeouts.forEach(t => {
            clearTimeout(t);
        })
    }

    runMovers(movers: IMover[], player: IPlayer, board: IBoard) {
        movers.forEach(m => {
            setInterval(() => {
                this.runQueue(m, player, board);
            }, m.speed);
        });
    }

    private runQueue(mover: IMover, player: IPlayer, board: IBoard) {
        if (this.halted)
            return;

        try {
            const move = Move.init(mover.getNextMove(player, board));
            const playerMoved = move.direction !== player.direction || move.destinationLocation !== player.location;
            const playerMoveIsValid = (player.location == move.startLocation);

            if (playerMoved && playerMoveIsValid) {
                this.makeMove(move, player, board);
            }
            else {
                mover.clear();
            }

            // const makeMoveTimeout = setInterval(() => {
            //     this.runQueue(mover, player, board);
            // }, mover.speed);

            // this.makeMoveTimeouts.push(makeMoveTimeout);
        }
        catch (ex) {
            console.error('runQueue failed', ex);
        }
    }

    private makeMove(move: IMove, player: IPlayer, board: IBoard) {
        player.direction = move.direction;
        player.indicator = player.getIndicator();

        if (move.isMove)
            board.move(player, move.startLocation, move.destinationLocation);
        else
            board.updateCell(board.getItemLocations('player')[0]);
    }
}