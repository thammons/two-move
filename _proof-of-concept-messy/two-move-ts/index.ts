import { MapSimple, MapBigSimple, MapWalledPlayerBox, MapWalledPlayerUnEvenBox } from './_proof-of-concept-messy/two-move-ts/maps/openMap.js';
import { MapFromJson } from './_proof-of-concept-messy/two-move-ts/maps/map-from-json.js';
// import Maps1 from './maps/maps.json' assert {type: "json"};
import Maps1 from "./_proof-of-concept-messy/two-move-ts/maps/maps.json" assert { type: "json" };
import MapGenerated from './_proof-of-concept-messy/two-move-ts/maps/generate-map1.js';
import Board from './_proof-of-concept-messy/two-move-ts/board.js';
import Player from './_proof-of-concept-messy/two-move-ts/player.js';
import BoardHooksHtml from './_proof-of-concept-messy/two-move-ts/board-hooks-html.js';
import { Direction, IBoard, IBoardBuilderOption, IBoardHooks, IMap, IMover, IPlayer, ItemLocation } from './_proof-of-concept-messy/two-move-ts/types.js';
import { InitializeMap, LightsOut } from './_proof-of-concept-messy/two-move-ts/board-logic/board-builders/index.js';
import { PaceMover } from './_proof-of-concept-messy/two-move-ts/player-movers/pace.js';
import * as utils from "./_proof-of-concept-messy/two-move-ts/ui-utils-html.js";
import { saveMap, getNextMap } from './_proof-of-concept-messy/two-move-ts/maps/save-map.js';

let MAP: IMap;
let MAP_FROM_JSON: MapFromJson;

//TODO: Dad
// prep highschore board for the ui
// set up css for highscore: div.score1, div.score2
// prep html file
//  Create file (highscore.txt)
//  Add a button to the homepage
//  add styles/site.css link
//  link simple js file with:
//      loadScores()

//TODO: Lucas
// add a highscore board to the UI
//set your HTML tag
// Add a header>title
// add a body
// put in a div with class="score1" atribute for the high score
// put in a div with class="score1" atribute for the high score 

// add prompt to get the players name
// call a [save method] to store it with their score



/*
Programming is all about algorythms
You ask just a few questions:
How does it start?
How does it finish?
How does it change?

all loops is this, plus a sentery
*/

//GAME:

//NEW MAPS: 
// Map 1: Snake, lights on
// Map 2: Snake, lights off
// Map 3: Snake, lights off, goal not visible


// let MAP:IMap = new Map0();
//  let MAP:IMap = new Map1();
// let MAP:IMap = new MapGenerated();

let HOOKS: IBoardHooks;
let BOARD: Board;

let PLAYER: Player;
let LIGHTSOUT: LightsOut<Board>;

const nextMap = () => {
    const isFirstRun = MAP === undefined;
    console.log('nextMap()');
    if (isFirstRun) {
        // MAP = new MapSimple();
        // MAP = new MapBigSimple();
        // MAP = new MapWalledPlayerBox();

        MAP = new MapGenerated(PLAYER?.getPlayerLocation() ?? 0);
        // MAP.player = 0;
    }
    else {
        // MAP = new MapBigSimple();

        MAP = new MapGenerated(PLAYER?.getPlayerLocation() ?? 0);
        // MAP = MAP_FROM_JSON.getNext()
        //     ?? new MapGenerated(PLAYER?.getPlayerLocation() ?? 0);
    }
    BOARD = buildBoard();
    startMover();
};

const buildBoard = () => {
    HOOKS = new BoardHooksHtml([
        //TODO convert to event handler
        { cellType: 'goal', event: nextMap },
        //TODO offer save option
        { cellType: 'goal', event: () => saveMap(MAP) },
        //TODO: On Goal, if autogen'd, save map
        //  MAP is a json file, with an array of objects, in level order
    ]);

    let board = new Board(MAP, HOOKS);
    const create = new InitializeMap<Board>(MAP);
    LIGHTSOUT = new LightsOut<Board>(2, ['goal', 'player'])

    board = create.init(board);

    //TODO: fix for going from a big map to a smaller map (will currently place them off playable area)
    PLAYER = new Player(MAP.player, MAP.width, PLAYER?.direction ?? 'east');
    board.update(PLAYER);

    // board = LIGHTSOUT.init(board);

    utils.paintBoard(board, 100);
    return board;
};

function reRenderBoard(current: ItemLocation, destination: ItemLocation, loadFade: number = 0) {
    if (current !== destination)
        BOARD = LIGHTSOUT.update(BOARD, destination);
    BOARD.update(PLAYER);
    utils.paintBoard(BOARD, loadFade);

}


let mover: IMover;

const startMover = () => {
    mover = new PaceMover();
    setTimeout(() => {
        //  autoPlay(PLAYER, BOARD);
        // screenSweeper(PLAYER, BOARD);
        // followRightWall();
        // followLeftWall();
        // alternateLeftAndRightWall();

        // randomWalker(); // also walks toward goal

        // makeMoves(mover);
    }, 2000);
}

window.onload = () => {
    // console.log(Maps1);
    // MAP_FROM_JSON = new MapFromJson(Maps1);
    nextMap();
}


function turnRight(player: Player, board: Board) {
    player.turnRight();
    board.updatePlayer(player);
    reRenderBoard(player.location, player.location);
}


document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    switch (keyName) {
        case 'e':
            BOARD = LIGHTSOUT.lightsOff(BOARD, PLAYER);
            reRenderBoard(PLAYER.location, PLAYER.location);
            break;
        case 'f':
            BOARD = LIGHTSOUT.lightsOff(BOARD, PLAYER);
            reRenderBoard(PLAYER.location, PLAYER.location);
            break;
    }
});

document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    switch (keyName) {
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'a':
        case 'd':
            PLAYER.turnRight();
            BOARD.updatePlayer(PLAYER);
            reRenderBoard(PLAYER.location, PLAYER.location);
            break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'w':
        case 's':
            const lastLocation = PLAYER.getPlayerLocation();
            BOARD.move(PLAYER, PLAYER.getPlayerLocation(), PLAYER.getNextMove());
            reRenderBoard(lastLocation, PLAYER.location);
            break;
        case 'e':
            BOARD = LIGHTSOUT.lightsOn(BOARD, PLAYER);
            reRenderBoard(PLAYER.location, PLAYER.location);
            break;
        case 'f':
            //TODO: make this based on the board dimentions
            const radius = 10;
            console.log('flashlight on', radius);
            BOARD = LIGHTSOUT.lightsOn(BOARD, PLAYER, radius);
            reRenderBoard(PLAYER.location, PLAYER.location);
            break;
        case 'r':
            nextMap();
            break;
        case "!":
            saveMap(MAP);
            break;
    }
});



//MOVERs
let makeMoveTimeout: NodeJS.Timeout | undefined = undefined;

function makeMoves(mover: IMover) {
    const move = mover.getNextMove(PLAYER, BOARD);
    // console.log(move);
    PLAYER.direction = move.direction;
    PLAYER.indicator = PLAYER.getIndicator(PLAYER.direction);
    const lastLocation = PLAYER.getPlayerLocation();

    if (move.isMove)
        BOARD.move(PLAYER, PLAYER.getPlayerLocation(), PLAYER.getNextMove());

    reRenderBoard(lastLocation, PLAYER.location);

    if (!!makeMoveTimeout)
        clearTimeout(makeMoveTimeout);

    makeMoveTimeout = setTimeout(() => {
        makeMoves(mover);
    }, 500);
}

//TODO: make these based on events, add listeners for UI to subscribe to
function move(player: Player, board: Board) {
    const lastLocation = player.getPlayerLocation();
    const isValid = board.move(player, player.getPlayerLocation(), player.getNextMove());
    reRenderBoard(lastLocation, player.location);
    return isValid;

}

function autoPlay(player: Player, board: IBoard) {
    autoPlayStep(player, board);
};

function autoPlayStep(player: Player, board: IBoard, steps: ItemLocation[] = [], stepCount: number = 0) {
    if (board.isAtGoal(player.location) || stepCount > 100)
        return;

    setTimeout(() => {
        // console.log(steps)
        if (steps.includes(player.getNextMove())) {
            player.turnRight();
            BOARD.updatePlayer(PLAYER);
        }
        else {
            steps.push(player.getPlayerLocation());
            const isValid = BOARD.move(PLAYER, PLAYER.getPlayerLocation(), PLAYER.getNextMove());;
            if (!isValid) {
                player.turnRight();
                BOARD.updatePlayer(PLAYER);
            }
        }

        autoPlayStep(player, board, steps, stepCount + 1);
    }, 100);
}


function screenSweeper(player: Player, board: Board, steps: ItemLocation[] = [], stepCount: number = 0, wallIsWest: boolean = false) {
    if (board.isAtGoal(player.location) || stepCount > 100)
        return;


    setTimeout(() => {
        let lastLocation = player.getPlayerLocation();
        steps.push(lastLocation);
        let isValid = move(player, board);

        if (!isValid) {

            if (wallIsWest) {
                turnRight(player, board);

                turnRight(player, board);
            }

            turnRight(player, board);

            lastLocation = player.getPlayerLocation();
            steps.push(player.getPlayerLocation());
            move(player, board);

            turnRight(player, board);

            if (wallIsWest) {
                turnRight(player, board);

                turnRight(player, board);
            }

            wallIsWest = !wallIsWest;
        }
        reRenderBoard(lastLocation, player.location);
        screenSweeper(player, board, steps, stepCount + 1, wallIsWest);
    }, 500);
}


function randomTurns() {
    let moves: (() => void)[] = [];
    const randomTurns = Math.floor(Math.random() * 10 % 6);
    console.log('randomTurns', randomTurns);
    for (let i = 0; i < randomTurns; i++) {
        moves.push(() => turnRight(PLAYER, BOARD));
    }
    return moves;
}

function randomSteps() {
    let moves: (() => boolean)[] = [];
    const randomSteps = Math.floor(Math.random() * 100 % (BOARD.width / 4));
    console.log('randomSteps', randomSteps);
    for (let i = 0; i < randomSteps; i++) {
        moves.push(() => {
            const isValid = move(PLAYER, BOARD);
            if (!isValid)
                randomTurns().forEach(t => t());
            return isValid;
        });
    }
    return moves;
}

function getDistanceToGoal() {
    const lastLocation = PLAYER.getPlayerLocation();
    const goalLocation = MAP.goal;
    const goalHoriz = goalLocation % MAP.width;
    const goalVert = Math.floor(goalLocation / MAP.width);
    const playerHoriz = lastLocation % MAP.width;
    const playerVert = Math.floor(lastLocation / MAP.width);

    let movesHoriz = 0;
    let horizDirection = "east";
    if (goalHoriz > playerHoriz) {
        horizDirection = 'east';
        movesHoriz = goalHoriz - playerHoriz;
    }
    else if (goalHoriz < playerHoriz) {
        horizDirection = 'west';
        movesHoriz = playerHoriz - goalHoriz;
    }

    let movesVert = 0;
    let vertDirection = "north";
    if (goalVert > playerVert) {
        vertDirection = 'south';
        movesVert = goalVert - playerVert;
    }
    else if (goalVert < playerVert) {
        vertDirection = 'north';
        movesVert = playerVert - goalVert;
    }

    return {
        horizontal: { moves: movesHoriz, direction: horizDirection },
        vertical: { moves: movesVert, direction: vertDirection }
    };
};

function turnToGoal(player: Player) {
    const distanceToGoal = getDistanceToGoal();

    let move = distanceToGoal.vertical;

    if (distanceToGoal.horizontal.moves > distanceToGoal.vertical.moves) {
        move = distanceToGoal.horizontal;
    }

    player.direction = move.direction as Direction;
    player.indicator = player.getIndicator(player.direction);

    return move;
};

function randomWalker(steps: ItemLocation[] = [], stepCount: number = 0) {
    if (stepCount > 100)
        return;

    const moves = randomSteps();
    //take some random steps
    randomTurns().forEach(t => moves.push(() => { t(); return true as boolean; }));

    /* STEP TOWARD GOAL WITH A BIT OF RANDOM */
    // const movesToGoal = turnToGoal(PLAYER);
    // //Take 1/4 of the steps toward the goal
    // [...Array(movesToGoal.moves % 4).keys()].forEach(i => moves.push(() => {
    //     //move fowarward toward goal
    //     const isValid = move(PLAYER, BOARD);
    //     //if the move isn't valid, make some turns
    //     if (!isValid)
    //         randomTurns().forEach(t => t());
    //     return isValid;
    // }));

    setTimeout(() => {
        moves.forEach((step) => {
            setTimeout(() => {
                const lastLocation = PLAYER.getPlayerLocation();
                steps.push(lastLocation);
                if (step())
                    stepCount++;
            }, 250);
        });

        randomWalker(steps, stepCount + 1);
    }, 250);

}


function followRightWall(steps: ItemLocation[] = [], stepCount: number = 0, turnCounter: number = 0) {
    if (stepCount > 1000)
        return;


    //take a valid step foward
    //turn right
    //test if valid step
    //if not, turn left

    setTimeout(() => {
        steps.push(PLAYER.getPlayerLocation());
        let isValid = move(PLAYER, BOARD);
        stepCount++;
        if (isValid) {
            turnRight(PLAYER, BOARD);
            steps.push(PLAYER.getPlayerLocation());
            isValid = move(PLAYER, BOARD);
            stepCount++;
        }

        if (!isValid) {
            turnRight(PLAYER, BOARD);
            turnRight(PLAYER, BOARD);
            turnRight(PLAYER, BOARD);
        }
        else if (PLAYER.direction === 'east') {
            while (isValid) {
                steps.push(PLAYER.getPlayerLocation());
                isValid = move(PLAYER, BOARD);
                stepCount++;
            }

        }

        followRightWall(steps, stepCount + 1);
    }, 250);
}

function followLeftWall(steps: ItemLocation[] = [], stepCount: number = 0) {
    if (stepCount > 10_000)
        return;

    setTimeout(() => {
        steps.push(PLAYER.getPlayerLocation());
        let isValid = move(PLAYER, BOARD);
        stepCount++;
        if (isValid) {
            turnRight(PLAYER, BOARD);
            turnRight(PLAYER, BOARD);
            turnRight(PLAYER, BOARD);
            steps.push(PLAYER.getPlayerLocation());
            isValid = move(PLAYER, BOARD);
            stepCount++;
        }

        if (!isValid) {
            turnRight(PLAYER, BOARD);
        }
        else if (PLAYER.direction === 'west') {
            //     while (isValid) {
            steps.push(PLAYER.getPlayerLocation());
            isValid = move(PLAYER, BOARD);
            stepCount++;
            //     }

        }

        followLeftWall(steps, stepCount + 1);
    }, 250);
}

function alternateLeftAndRightWall(steps: ItemLocation[] = [], stepCount: number = 0, directionLeft: boolean = true) {
    if (stepCount > 10_000)
        return;

    //TODO: if target is visible, go to it

    //TODO: figure out if boxed in, and if so, reset map


    if (steps.length > 10) {
        const lastStep = steps.slice(-1)[0];
        // const isLooping = allStepsAsString.includes(stepsAsString);
        const isLooping = steps.filter(s => s == lastStep).length > 25;
        if (isLooping) {
            steps = [];
            directionLeft = !directionLeft;
        }
    }


    setTimeout(() => {
        steps.push(PLAYER.getPlayerLocation());
        let isValid = move(PLAYER, BOARD);
        stepCount++;
        if (isValid) {
            if (directionLeft) {
                turnRight(PLAYER, BOARD);
                turnRight(PLAYER, BOARD);
            }
            turnRight(PLAYER, BOARD);
            steps.push(PLAYER.getPlayerLocation());
            isValid = move(PLAYER, BOARD);
            stepCount++;
        }

        if (!isValid) {
            if (!directionLeft) {
                turnRight(PLAYER, BOARD);
                turnRight(PLAYER, BOARD);
            }
            turnRight(PLAYER, BOARD);
        }
        else if (PLAYER.direction === (directionLeft ? 'south' : 'north')) {
            //     while (isValid) {
            [...Array(10).keys()].forEach(i => {
                if (directionLeft) {
                    turnRight(PLAYER, BOARD);
                    turnRight(PLAYER, BOARD);
                }
                turnRight(PLAYER, BOARD);
                steps.push(PLAYER.getPlayerLocation());
                isValid = move(PLAYER, BOARD);
                stepCount++;
                if (!isValid)
                    turnRight(PLAYER, BOARD);
            });
            //     }
        }

        alternateLeftAndRightWall(steps, stepCount, directionLeft);
    }, 250);
}