import { IBoard, IMover, IPlayer } from "../types";
import { PaceMover } from "./pace";
import { ScreenSweeperMover } from "./screen-sweeper";
import { WallFollowerMover } from "./wall-follower";

export type MoverTypes = 'none' | 'screen-sweeper' | 'wall-follower' | 'pacer';

// TODO:
// setup a constructor for taking in a type
// factory: create a move

//TODO - need a way to interrupt the mover, 
//  user keypress should recast the move arrays they hold internaly

let mover: IMover | undefined = undefined;

export function runMover(moverType: MoverTypes, player: IPlayer, board: IBoard) {

    switch (moverType) {
        case 'pacer':
            mover = new PaceMover();
            break;
        case 'screen-sweeper':
            mover = new ScreenSweeperMover();
            break;
        case 'wall-follower':
            mover = new WallFollowerMover();
            break;
    }

    if (!!mover)
        makeMoves(mover, player, board);
}


let makeMoveTimeout: NodeJS.Timeout | undefined = undefined;

export function makeMoves(mover: IMover, player: IPlayer, board: IBoard) {
    const move = mover.getNextMove(player, board);
    // console.log(move);
    player.direction = move.direction;
    player.indicator = player.getIndicator();

    if (move.isMove)
        board.move(player, player.getPlayerLocation(), player.getNextMove());

    if (!!makeMoveTimeout)
        clearTimeout(makeMoveTimeout);

    makeMoveTimeout = setTimeout(() => {
        makeMoves(mover, player, board);
    }, 500);
}
