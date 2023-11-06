import { Direction, IBoard, IMove, IMover, IPlayer, ItemLocation } from "../types";


export class RandomMoverv1 implements IMover {
    directionMap: Map<Direction, Direction> = new Map([
        ['east', 'south'],
        ['south', 'west'],
        ['west', 'north'],
        ['north', 'east']
    ]);
    steps: ItemLocation[] = [];
    stepCount: number = 0;
    stepLimit: number = 100;
    getNextMove(player: IPlayer, board: IBoard): IMove {
        if (board.isAtGoal(player.location) || this.stepCount > this.stepLimit)
            throw new Error('RandomMoverv1: Reached goal or step limit');

        const location = player.location;
        let nextDirection = player.direction;
        let desiredLocation = player.location;

        if (this.steps.includes(player.getNextMove())) {
            nextDirection = this.directionMap.get(player.direction)!;
        }
        else {
            nextDirection = this.directionMap.get(player.direction)!;

            this.steps.push(player.getPlayerLocation());
            const isValid = board.isValidMove(player.getPlayerLocation(), player.getNextMove());
            if (!isValid) {
                player.turnRight();
            }
            else {
                desiredLocation = player.getNextMove();
            }
        }
        this.stepCount++;

        const nextIMove = {
            direction: nextDirection,
            startLocation: location,
            desitnationLocation: desiredLocation,
            isMove: desiredLocation !== location
        };
        return nextIMove;

    }
}