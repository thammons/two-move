import { IBoard, IMover, IPlayer } from "../types";




let makeMoveTimeout: NodeJS.Timeout | undefined = undefined;

function makeMoves(mover: IMover, player: IPlayer, board: IBoard) {
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
