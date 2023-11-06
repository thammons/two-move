import { Direction, IBoard, IMap, IMove, IMover, IPlayer, ItemLocation } from "../types";

// function followRightWall(steps: ItemLocation[] = [], stepCount: number = 0, turnCounter: number = 0) {
//     if (stepCount > 1000)
//         return;


//     //take a valid step foward
//     //turn right
//     //test if valid step
//     //if not, turn left

//     setTimeout(() => {
//         steps.push(PLAYER.getPlayerLocation());
//         let isValid = move(PLAYER, BOARD);
//         stepCount++;
//         if (isValid) {
//             turnRight(PLAYER, BOARD);
//             steps.push(PLAYER.getPlayerLocation());
//             isValid = move(PLAYER, BOARD);
//             stepCount++;
//         }

//         if (!isValid) {
//             turnRight(PLAYER, BOARD);
//             turnRight(PLAYER, BOARD);
//             turnRight(PLAYER, BOARD);
//         }
//         else if (PLAYER.direction === 'east') {
//             while (isValid) {
//                 steps.push(PLAYER.getPlayerLocation());
//                 isValid = move(PLAYER, BOARD);
//                 stepCount++;
//             }

//         }

//         followRightWall(steps, stepCount + 1);
//     }, 250);
// }

// function followLeftWall(steps: ItemLocation[] = [], stepCount: number = 0) {
//     if (stepCount > 10_000)
//         return;

//     setTimeout(() => {
//         steps.push(PLAYER.getPlayerLocation());
//         let isValid = move(PLAYER, BOARD);
//         stepCount++;
//         if (isValid) {
//             turnRight(PLAYER, BOARD);
//             turnRight(PLAYER, BOARD);
//             turnRight(PLAYER, BOARD);
//             steps.push(PLAYER.getPlayerLocation());
//             isValid = move(PLAYER, BOARD);
//             stepCount++;
//         }

//         if (!isValid) {
//             turnRight(PLAYER, BOARD);
//         }
//         else if (PLAYER.direction === 'west') {
//             //     while (isValid) {
//             steps.push(PLAYER.getPlayerLocation());
//             isValid = move(PLAYER, BOARD);
//             stepCount++;
//             //     }

//         }

//         followLeftWall(steps, stepCount + 1);
//     }, 250);
// }

// function alternateLeftAndRightWall(steps: ItemLocation[] = [], stepCount: number = 0, directionLeft: boolean = true) {
//     if (stepCount > 10_000)
//         return;

//     //TODO: if target is visible, go to it

//     //TODO: figure out if boxed in, and if so, reset map


//     if (steps.length > 10) {
//         const lastStep = steps.slice(-1)[0];
//         // const isLooping = allStepsAsString.includes(stepsAsString);
//         const isLooping = steps.filter(s => s == lastStep).length > 25;
//         if (isLooping) {
//             steps = [];
//             directionLeft = !directionLeft;
//         }
//     }


//     setTimeout(() => {
//         steps.push(PLAYER.getPlayerLocation());
//         let isValid = move(PLAYER, BOARD);
//         stepCount++;
//         if (isValid) {
//             if (directionLeft) {
//                 turnRight(PLAYER, BOARD);
//                 turnRight(PLAYER, BOARD);
//             }
//             turnRight(PLAYER, BOARD);
//             steps.push(PLAYER.getPlayerLocation());
//             isValid = move(PLAYER, BOARD);
//             stepCount++;
//         }

//         if (!isValid) {
//             if (!directionLeft) {
//                 turnRight(PLAYER, BOARD);
//                 turnRight(PLAYER, BOARD);
//             }
//             turnRight(PLAYER, BOARD);
//         }
//         else if (PLAYER.direction === (directionLeft ? 'south' : 'north')) {
//             //     while (isValid) {
//             [...Array(10).keys()].forEach(i => {
//                 if (directionLeft) {
//                     turnRight(PLAYER, BOARD);
//                     turnRight(PLAYER, BOARD);
//                 }
//                 turnRight(PLAYER, BOARD);
//                 steps.push(PLAYER.getPlayerLocation());
//                 isValid = move(PLAYER, BOARD);
//                 stepCount++;
//                 if (!isValid)
//                     turnRight(PLAYER, BOARD);
//             });
//             //     }
//         }

//         alternateLeftAndRightWall(steps, stepCount, directionLeft);
//     }, 250);
// }

export class WallFollowerMover implements IMover {
    getNextMove(player: IPlayer, board: IBoard): IMove {
        throw new Error("Method not implemented.");
    }
}