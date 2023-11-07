import { Direction, IBoard, IMap, IMove, IMover, IPlayer, ItemLocation } from "../types";
import * as utils from './mover-utils';

export class ScreenSweeperMover implements IMover {
    directionMap: Map<Direction, Direction> = new Map([
        ['east', 'south'],
        ['south', 'west'],
        ['west', 'north'],
        ['north', 'east']
    ]);
    moves: IMove[] = [];
    steps: ItemLocation[] = [];
    stepCount: number = 0;
    stepLimit: number = 100;
    direction: Direction = 'east';

    getNextMove(player: IPlayer, board: IBoard): IMove {
        if (this.moves.length === 0)
            this.moves = this.getNextMoves(player, board);

        return this.moves.shift()!;
    }

    getNextMoves(player: IPlayer, board: IBoard): IMove[] {
        if (board.isAtGoal(player.location) || this.stepCount > this.stepLimit)
            throw new Error('ScreenSweeperMover: Reached goal or step limit');

        const moves: IMove[] = [];

        this.direction = player.direction;
        let location = player.location;
        let desiredLocation = player.location;

        if (this.moves.length > 0) {
            const lastMove = this.moves[this.moves.length - 1];
            this.direction = lastMove.direction;
            location = lastMove.desitnationLocation;
            desiredLocation = lastMove.desitnationLocation;
        }

        const startDirection = this.direction;

        let lastLocation = player.getPlayerLocation();
        this.steps.push(lastLocation);

        const isValid = board.isValidMove(player.getPlayerLocation(), player.getNextMove());
        if (!isValid) {

            if (startDirection === 'west') {
                moves.push(...this.turn(3, location));
            }
            else if (startDirection === 'east') {
                moves.push(...this.turn(1, location));
            }
            
            location = desiredLocation;
            desiredLocation = utils.getNextLocation(location, this.direction, board.map.width);
            moves.push(utils.createMove(this.direction, location, desiredLocation));
    
            if (startDirection === 'west') {
                moves.push(...this.turn(3, location));
            }
            else if (startDirection === 'east') {
                moves.push(...this.turn(1, location));
            }
        }

        let isValidMove = true;
        while (isValidMove) {
            location = desiredLocation;
            desiredLocation = utils.getNextLocation(location, this.direction, board.map.width);
            isValidMove = utils.isValidMove(this.direction, location, desiredLocation, board.map);

            if (isValidMove) {
                moves.push(utils.createMove(this.direction, location, desiredLocation));
            }
        }


        moves.forEach(m => {
            if (m.isMove) {
                this.stepCount++;
                this.steps.push(m.desitnationLocation);
            }
        });

        console.log('screen-sweeper moves', moves)
        return moves;
    }

    

    turn(count: number, location: ItemLocation): IMove[] {
        let moves: IMove[] = [];

        const keys = [...this.directionMap.keys()];
        const index = keys.indexOf(this.direction);

        for (let i = 0; i < count; i++) {
            const newIndex = (index + count) % 4;
            const newDirection = keys[newIndex];
            moves.push(utils.createMove(newDirection, location));
            this.direction = newDirection;
        }

        return moves;
    }

}