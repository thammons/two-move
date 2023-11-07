import { Direction, IBoard, IMap, IMove, IMover, IPlayer, ItemLocation } from "../types";
import { Move } from "../board/move";
import * as utils from './mover-utils';

export type followDirection = 'left' | 'right' | 'alternate';


export class WallFollowerMover implements IMover {
    directionMap: Map<Direction, Direction> = new Map([
        ['east', 'south'],
        ['south', 'west'],
        ['west', 'north'],
        ['north', 'east']
    ]);
    moves: IMove[] = [];
    steps: ItemLocation[] = [];
    stepCount: number = 0;
    direction: Direction = 'east';
    followDirection: followDirection = 'alternate';
    currentFollowDirection: followDirection = 'left';
    turnCounter: number = 0;

    constructor(followDirection: followDirection = 'alternate') {
        this.followDirection = followDirection;
    }

    getNextMove(player: IPlayer, board: IBoard): IMove {
        if (this.moves.length === 0)
            this.moves = this.followRightWall(player, board);

        const move = this.moves.shift()!;
        return move;
    }

    followWall(startLocation: ItemLocation, direction: Direction, map: IMap, followDirection: followDirection) {
        let lastMove = new Move(direction, startLocation, startLocation);

        if (this.moves.length > 0) {
            lastMove = Move.init(this.moves[this.moves.length - 1]);
        }
        let nextMove = lastMove.getNextMove(map.width);

        let newMoves: IMove[] = [];
        const firstMoveTurns = followDirection === 'left' ? 3 : 1;
        const secondMoveTurns = followDirection === 'left' ? 1 : 3;

        let isValid: boolean = nextMove.isValidMove(map);

        //take a step
        newMoves.push(nextMove);

        if (isValid) {
            //turn right
            newMoves.push(...this.turn(firstMoveTurns, nextMove));
            lastMove = Move.init(newMoves[newMoves.length - 1]);

            //take a step
            nextMove = lastMove.getNextMove(map.width);
            newMoves.push(nextMove);
            isValid = nextMove.isValidMove(map);
        }

        if (!isValid) {
            newMoves.push(...this.turn(secondMoveTurns, nextMove));
            lastMove = Move.init(newMoves[newMoves.length - 1]);
        }
        // else if (nextDirection == 'east') {
        //     while (isValid) {
        //         newMoves.push(utils.createMove(nextDirection, location, nextLocation));
        //         nextLocation = utils.getNextLocation(location, nextDirection, map.width)
        //         isValid = utils.isValidMove(nextDirection, location, nextLocation, map);
        //     }
        // }

        newMoves.forEach(m => {
            if (m.isMove) {
                this.stepCount++;
                this.steps.push(m.desitnationLocation);
            }
        });

        return newMoves;
    }

    //steps: ItemLocation[] = [], stepCount: number = 0, turnCounter: number = 0
    followRightWall(player: IPlayer, Board: IBoard) {
        // if (stepCount > 1000)
        //     return;


        //take a valid step foward
        //turn right
        //test if valid step
        //if not, turn left

        // setTimeout(() => {
        //     steps.push(PLAYER.getPlayerLocation());
        //     let isValid = move(PLAYER, BOARD);
        //     stepCount++;
        //     if (isValid) {
        //         turnRight(PLAYER, BOARD);
        //         steps.push(PLAYER.getPlayerLocation());
        //         isValid = move(PLAYER, BOARD);
        //         stepCount++;
        //     }

        //     if (!isValid) {
        //         turnRight(PLAYER, BOARD);
        //         turnRight(PLAYER, BOARD);
        //         turnRight(PLAYER, BOARD);
        //     }
        //     else if (PLAYER.direction === 'east') {
        //         while (isValid) {
        //             steps.push(PLAYER.getPlayerLocation());
        //             isValid = move(PLAYER, BOARD);
        //             stepCount++;
        //         }

        //     }

        //     followRightWall(steps, stepCount + 1);
        // }, 250);
        return this.followWall(player.getPlayerLocation(), player.direction, Board.map, 'right');
    }

    //steps: ItemLocation[] = [], stepCount: number = 0
    followLeftWall(player: IPlayer, Board: IBoard) {
        // if (stepCount > 10_000)
        //     return;

        // setTimeout(() => {
        //     steps.push(PLAYER.getPlayerLocation());
        //     let isValid = move(PLAYER, BOARD);
        //     stepCount++;
        //     if (isValid) {
        //         turnRight(PLAYER, BOARD);
        //         turnRight(PLAYER, BOARD);
        //         turnRight(PLAYER, BOARD);
        //         steps.push(PLAYER.getPlayerLocation());
        //         isValid = move(PLAYER, BOARD);
        //         stepCount++;
        //     }

        //     if (!isValid) {
        //         turnRight(PLAYER, BOARD);
        //     }
        //     else if (PLAYER.direction === 'west') {
        //         //     while (isValid) {
        //         steps.push(PLAYER.getPlayerLocation());
        //         isValid = move(PLAYER, BOARD);
        //         stepCount++;
        //         //     }

        //     }

        //     followLeftWall(steps, stepCount + 1);
        // }, 250);
        return this.followWall(player.getPlayerLocation(), player.direction, Board.map, 'left');
    }

    alternateLeftAndRightWall(steps: ItemLocation[] = [], stepCount: number = 0, directionLeft: boolean = true) {

        //TODO: if target is visible, go to it

        //TODO: figure out if boxed in, and if so, reset map



        // if (stepCount > 10_000)
        //     return;


        // //TODO: DO SOMETHING LIKE THIS TO SWIVEL
        // if (steps.length > 10) {
        //     const lastStep = steps.slice(-1)[0];
        //     // const isLooping = allStepsAsString.includes(stepsAsString);
        //     const isLooping = steps.filter(s => s == lastStep).length > 25;
        //     if (isLooping) {
        //         steps = [];
        //         directionLeft = !directionLeft;
        //     }
        // }
        throw new Error('Not implemented');

        // setTimeout(() => {
        //     steps.push(PLAYER.getPlayerLocation());
        //     let isValid = move(PLAYER, BOARD);
        //     stepCount++;
        //     if (isValid) {
        //         if (directionLeft) {
        //             turnRight(PLAYER, BOARD);
        //             turnRight(PLAYER, BOARD);
        //         }
        //         turnRight(PLAYER, BOARD);
        //         steps.push(PLAYER.getPlayerLocation());
        //         isValid = move(PLAYER, BOARD);
        //         stepCount++;
        //     }

        //     if (!isValid) {
        //         if (!directionLeft) {
        //             turnRight(PLAYER, BOARD);
        //             turnRight(PLAYER, BOARD);
        //         }
        //         turnRight(PLAYER, BOARD);
        //     }
        //     else if (PLAYER.direction === (directionLeft ? 'south' : 'north')) {
        //         //     while (isValid) {
        //         [...Array(10).keys()].forEach(i => {
        //             if (directionLeft) {
        //                 turnRight(PLAYER, BOARD);
        //                 turnRight(PLAYER, BOARD);
        //             }
        //             turnRight(PLAYER, BOARD);
        //             steps.push(PLAYER.getPlayerLocation());
        //             isValid = move(PLAYER, BOARD);
        //             stepCount++;
        //             if (!isValid)
        //                 turnRight(PLAYER, BOARD);
        //         });
        //         //     }
        //     }

        //     alternateLeftAndRightWall(steps, stepCount, directionLeft);
        // }, 250);
    }

    turn(count: number, lastMove: Move): IMove[] {
        let moves: IMove[] = [];

        const keys = [...this.directionMap.keys()];
        const index = keys.indexOf(this.direction);

        for (let i = 0; i < count; i++) {
            const newIndex = (index + count) % 4;
            const newDirection = keys[newIndex];
            moves.push(utils.createMove(newDirection, lastMove.desitnationLocation));
            this.direction = newDirection;
        }

        return moves;
    }
}