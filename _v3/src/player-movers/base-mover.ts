import { Move } from "../board/move";
import { Direction, IBoard, IMove, IMover, IPlayer } from "../types";


export class BaseMover implements IMover {
    speed: number = 250;
    private moves: Move[] = [];
    private pause = false;
    directionMap?: Map<Direction, Direction>;
    turnCondition?: (lastMove: IMove, nextMove: IMove, board: IBoard) => boolean;

    constructor(speed: number, turnCondition: (lastMove: IMove, nextMove: IMove, board: IBoard) => boolean, directionMap?: Map<Direction, Direction>) {
        this.speed = speed;
        this.directionMap = directionMap;
        this.turnCondition = turnCondition;
    }

    clear() {
        //This is causing problems on blockly
        // should just remove invalid moves based on player position
        //this.moves = [];

        //should self heal now
    }

    getNextMove(player: IPlayer, board: IBoard): IMove {
        const lastPosition = new Move(player.direction, player.location, player.location);
        //if paused, just wait
        if (this.pause)
            return lastPosition;

        if (!this.moves.length) {
            const move = this.move(player, board);
            //broken // the pacer just keeps running into the east or west wall, never turns
            const turnForCondition = !!this.turnCondition && this.turnCondition(lastPosition, move, board);
            const isValid = move.isValidMove(board.map, player.location);
            console.log('move', move, !!this.turnCondition, turnForCondition, isValid)
            if (turnForCondition || !isValid) {
                this.turnRight(player, board);
                console.log("push turn");
            }
            else {
                this.moves.push(move);
                console.log("push move")
            }


        }
        return this.moves.shift()!;
    }

    move(player: IPlayer, board: IBoard) {
        if (this.pause)
            return new Move(player.direction, player.location, player.location);

        const lastMove = this.getLastMove(player);
        let nextMove = lastMove.getNextMove(board.map.width);

        //one invalid move is allowed
        if (!lastMove.isValidMove(board.map, player.location)) {
            this.clearInvalidMoves(board, player);
            this.clearDuplicateMoves();
            nextMove = Move.init(lastMove);
        }

        return nextMove;
    }

    turnRight(player: IPlayer, board: IBoard) {
        if (this.pause)
            return;

        const lastMove = this.getLastMove(player);

        const nextMove = lastMove.getNextDirection(this.directionMap);
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
                && move.destinationLocation === nextMove.destinationLocation
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

}