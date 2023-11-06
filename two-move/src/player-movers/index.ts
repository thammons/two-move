import { IBoard, IMover, IPlayer } from "../types";


// TODO: declare types for movers
// setup a constructor for taking in a type
// factory: create a move
// makeMoves should manage the rest

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
