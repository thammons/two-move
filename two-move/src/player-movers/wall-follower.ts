import { Direction, IBoard, IMap, IMove, IMover, IPlayer, ItemLocation } from "../types";
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
    direction: Direction = 'east';
    followDirection: followDirection = 'alternate';
    currentFollowDirection: followDirection = 'left';
    turnCounter: number = 0;

    constructor(followDirection: followDirection = 'alternate') {
        this.followDirection = followDirection;
    }

    getNextMove(player: IPlayer, board: IBoard): IMove {
        throw new Error("Method not implemented.");
    }

    followWall(startLocation: ItemLocation, direction: Direction, map: IMap, followDirection: followDirection) {
        let location = startLocation;
        let nextDirection = direction;

        if (this.moves.length > 0) {
            const lastMove = this.moves[this.moves.length - 1];
            location = lastMove.desitnationLocation;
            nextDirection = lastMove.direction;
        }
        let nextLocation = utils.getNextLocation(location, nextDirection, map.width);

        let moves: IMove[] = [];
        const firstMoveTurns = followDirection === 'left' ? 3 : 1;
        const secondMoveTurns = followDirection === 'left' ? 1 : 3;

        let isValid: boolean = utils.isValidMove(nextDirection, location, nextLocation, map);
        if (isValid) {
            moves.push(...this.turn(firstMoveTurns, location));
            nextDirection = moves[moves.length - 1].direction;
            moves.push(utils.createMove(nextDirection, location, nextLocation));

            location = nextLocation;
            nextLocation = utils.getNextLocation(location, nextDirection, map.width);
            isValid = utils.isValidMove(nextDirection, location, nextLocation, map);
        }

        if (!isValid) {
            moves.push(...this.turn(secondMoveTurns, location));
            nextDirection = moves[moves.length - 1].direction;
        }
        else if (nextDirection == 'east') {
            while (isValid) {
                moves.push(utils.createMove(nextDirection, location, nextLocation));
                nextLocation = utils.getNextLocation(location, nextDirection, map.width)
                isValid = utils.isValidMove(nextDirection, location, nextLocation, map);
            }
        }

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