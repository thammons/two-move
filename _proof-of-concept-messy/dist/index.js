import MapGenerated from './maps/generate-map1.js';
import Board from './board.js';
import Player from './player.js';
import BoardHooksHtml from './board-hooks-html.js';
import { InitializeMap, LightsOut } from './board-logic/board-builders/index.js';
import { PaceMover } from './player-movers/pace.js';
import * as utils from "./ui-utils-html.js";
import { saveMap } from './maps/save-map.js';
let MAP;
let MAP_FROM_JSON;
let HOOKS;
let BOARD;
let PLAYER;
let LIGHTSOUT;
const nextMap = () => {
    const isFirstRun = MAP === undefined;
    console.log('nextMap()');
    if (isFirstRun) {
        MAP = new MapGenerated(PLAYER?.getPlayerLocation() ?? 0);
    }
    else {
        MAP = new MapGenerated(PLAYER?.getPlayerLocation() ?? 0);
    }
    BOARD = buildBoard();
    startMover();
};
const buildBoard = () => {
    HOOKS = new BoardHooksHtml([
        { cellType: 'goal', event: nextMap },
        { cellType: 'goal', event: () => saveMap(MAP) },
    ]);
    let board = new Board(MAP, HOOKS);
    const create = new InitializeMap(MAP);
    LIGHTSOUT = new LightsOut(2, ['goal', 'player']);
    board = create.init(board);
    PLAYER = new Player(MAP.player, MAP.width, PLAYER?.direction ?? 'east');
    board.update(PLAYER);
    utils.paintBoard(board, 100);
    return board;
};
function reRenderBoard(current, destination, loadFade = 0) {
    if (current !== destination)
        BOARD = LIGHTSOUT.update(BOARD, destination);
    BOARD.update(PLAYER);
    utils.paintBoard(BOARD, loadFade);
}
let mover;
const startMover = () => {
    mover = new PaceMover();
    setTimeout(() => {
    }, 2000);
};
window.onload = () => {
    nextMap();
};
function turnRight(player, board) {
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
let makeMoveTimeout = undefined;
function makeMoves(mover) {
    const move = mover.getNextMove(PLAYER, BOARD);
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
function move(player, board) {
    const lastLocation = player.getPlayerLocation();
    const isValid = board.move(player, player.getPlayerLocation(), player.getNextMove());
    reRenderBoard(lastLocation, player.location);
    return isValid;
}
function autoPlay(player, board) {
    autoPlayStep(player, board);
}
;
function autoPlayStep(player, board, steps = [], stepCount = 0) {
    if (board.isAtGoal(player.location) || stepCount > 100)
        return;
    setTimeout(() => {
        if (steps.includes(player.getNextMove())) {
            player.turnRight();
            BOARD.updatePlayer(PLAYER);
        }
        else {
            steps.push(player.getPlayerLocation());
            const isValid = BOARD.move(PLAYER, PLAYER.getPlayerLocation(), PLAYER.getNextMove());
            ;
            if (!isValid) {
                player.turnRight();
                BOARD.updatePlayer(PLAYER);
            }
        }
        autoPlayStep(player, board, steps, stepCount + 1);
    }, 100);
}
function screenSweeper(player, board, steps = [], stepCount = 0, wallIsWest = false) {
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
    let moves = [];
    const randomTurns = Math.floor(Math.random() * 10 % 6);
    console.log('randomTurns', randomTurns);
    for (let i = 0; i < randomTurns; i++) {
        moves.push(() => turnRight(PLAYER, BOARD));
    }
    return moves;
}
function randomSteps() {
    let moves = [];
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
}
;
function turnToGoal(player) {
    const distanceToGoal = getDistanceToGoal();
    let move = distanceToGoal.vertical;
    if (distanceToGoal.horizontal.moves > distanceToGoal.vertical.moves) {
        move = distanceToGoal.horizontal;
    }
    player.direction = move.direction;
    player.indicator = player.getIndicator(player.direction);
    return move;
}
;
function randomWalker(steps = [], stepCount = 0) {
    if (stepCount > 100)
        return;
    const moves = randomSteps();
    randomTurns().forEach(t => moves.push(() => { t(); return true; }));
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
function followRightWall(steps = [], stepCount = 0, turnCounter = 0) {
    if (stepCount > 1000)
        return;
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
function followLeftWall(steps = [], stepCount = 0) {
    if (stepCount > 10000)
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
            steps.push(PLAYER.getPlayerLocation());
            isValid = move(PLAYER, BOARD);
            stepCount++;
        }
        followLeftWall(steps, stepCount + 1);
    }, 250);
}
function alternateLeftAndRightWall(steps = [], stepCount = 0, directionLeft = true) {
    if (stepCount > 10000)
        return;
    if (steps.length > 10) {
        const lastStep = steps.slice(-1)[0];
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
        }
        alternateLeftAndRightWall(steps, stepCount, directionLeft);
    }, 250);
}
//# sourceMappingURL=index.js.map