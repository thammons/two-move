import { IBoard, IMover, IPlayer } from "../types";
import { PaceMover } from "./pace";
import { RandomWalkerMover } from "./random-walker";
import { ScreenSweeperMover } from "./screen-sweeper";
import { WallFollowerMover } from "./wall-follower";

export type MoverTypes = 'none' | 'pacer' | 'random-walker' | 'screen-sweeper' | 'wall-follower';

export class Mover {
    private moverType: MoverTypes = 'none';
    private mover: IMover | undefined = undefined;

    private halted: boolean = false;
    private makeMoveTimeout: NodeJS.Timeout | undefined = undefined;

    constructor(moverType: MoverTypes) {
        this.moverType = moverType;
    }

    stop() {
        this.halted = true;
        if (!!this.makeMoveTimeout)
            clearTimeout(this.makeMoveTimeout);
    }

    runMover(player: IPlayer, board: IBoard, speed: number = 500) {

        switch (this.moverType) {
            case 'pacer':
                this.mover = new PaceMover();
                break;
            case 'screen-sweeper':
                this.mover = new ScreenSweeperMover();
                break;
            case 'wall-follower':
                this.mover = new WallFollowerMover();
                break;
            case 'random-walker':
                this.mover = new RandomWalkerMover();
                break;
        }

        if (!!this.mover)
            this.makeMoves(this.mover, player, board, speed);
    }

    private makeMoves(mover: IMover, player: IPlayer, board: IBoard, speed: number = 500) {
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
            this.makeMoves(mover, player, board, speed);
            // console.log('makeMoves', move)
        }, speed);
    }

}
