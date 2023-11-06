import { Direction, IBoard, IMap, IMove, IMover, IPlayer, ItemLocation } from "../types";


// function randomTurns() {
//     let moves: (() => void)[] = [];
//     const randomTurns = Math.floor(Math.random() * 10 % 6);
//     console.log('randomTurns', randomTurns);
//     for (let i = 0; i < randomTurns; i++) {
//         moves.push(() => turnRight(PLAYER, BOARD));
//     }
//     return moves;
// }

// function randomSteps() {
//     let moves: (() => boolean)[] = [];
//     const randomSteps = Math.floor(Math.random() * 100 % (BOARD.width / 4));
//     console.log('randomSteps', randomSteps);
//     for (let i = 0; i < randomSteps; i++) {
//         moves.push(() => {
//             const isValid = move(PLAYER, BOARD);
//             if (!isValid)
//                 randomTurns().forEach(t => t());
//             return isValid;
//         });
//     }
//     return moves;
// }

// function getDistanceToGoal() {
//     const lastLocation = PLAYER.getPlayerLocation();
//     const goalLocation = MAP.goal;
//     const goalHoriz = goalLocation % MAP.width;
//     const goalVert = Math.floor(goalLocation / MAP.width);
//     const playerHoriz = lastLocation % MAP.width;
//     const playerVert = Math.floor(lastLocation / MAP.width);

//     let movesHoriz = 0;
//     let horizDirection = "east";
//     if (goalHoriz > playerHoriz) {
//         horizDirection = 'east';
//         movesHoriz = goalHoriz - playerHoriz;
//     }
//     else if (goalHoriz < playerHoriz) {
//         horizDirection = 'west';
//         movesHoriz = playerHoriz - goalHoriz;
//     }

//     let movesVert = 0;
//     let vertDirection = "north";
//     if (goalVert > playerVert) {
//         vertDirection = 'south';
//         movesVert = goalVert - playerVert;
//     }
//     else if (goalVert < playerVert) {
//         vertDirection = 'north';
//         movesVert = playerVert - goalVert;
//     }

//     return {
//         horizontal: { moves: movesHoriz, direction: horizDirection },
//         vertical: { moves: movesVert, direction: vertDirection }
//     };
// };

// function turnToGoal(player: Player) {
//     const distanceToGoal = getDistanceToGoal();

//     let move = distanceToGoal.vertical;

//     if (distanceToGoal.horizontal.moves > distanceToGoal.vertical.moves) {
//         move = distanceToGoal.horizontal;
//     }

//     player.direction = move.direction as Direction;
//     player.indicator = player.getIndicator(player.direction);

//     return move;
// };

// function randomWalker(steps: ItemLocation[] = [], stepCount: number = 0) {
//     if (stepCount > 100)
//         return;

//     const moves = randomSteps();
//     //take some random steps
//     randomTurns().forEach(t => moves.push(() => { t(); return true as boolean; }));

//     /* STEP TOWARD GOAL WITH A BIT OF RANDOM */
//     // const movesToGoal = turnToGoal(PLAYER);
//     // //Take 1/4 of the steps toward the goal
//     // [...Array(movesToGoal.moves % 4).keys()].forEach(i => moves.push(() => {
//     //     //move fowarward toward goal
//     //     const isValid = move(PLAYER, BOARD);
//     //     //if the move isn't valid, make some turns
//     //     if (!isValid)
//     //         randomTurns().forEach(t => t());
//     //     return isValid;
//     // }));

//     setTimeout(() => {
//         moves.forEach((step) => {
//             setTimeout(() => {
//                 const lastLocation = PLAYER.getPlayerLocation();
//                 steps.push(lastLocation);
//                 if (step())
//                     stepCount++;
//             }, 250);
//         });

//         randomWalker(steps, stepCount + 1);
//     }, 250);

// }

export class RandomWalkerMover implements IMover {

    getNextMove(player: IPlayer, board: IBoard): IMove {
        throw new Error("Method not implemented.");
    }


}