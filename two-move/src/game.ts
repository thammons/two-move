import Board from "./board/board";
import { BoardEvents } from "./board/events";
import MapGenerated from "./maps/generate-map1";
import Player from "./player";
import { IMap } from "./types";
import { UI, UIUserEvents, UIUserInteractions } from "./ui";

import { InitializeMap, LightsOut } from './board-builders/index.js';
import { saveMap, getNextMap } from './maps/save-map.js';


var MAP: IMap;
var PLAYER: Player;
var LIGHTSOUT: LightsOut<Board>;
var BOARD: Board;

let UI_INTERACTIONS: UIUserInteractions;


window.onload = () => {
    init();
}

export function init() {
    setupBoard();
    setupUI();
    // console.log(Maps1);
    // MAP_FROM_JSON = new MapFromJson(Maps1);

    const moveBtn = document.getElementById('move-btn');
    if (!moveBtn) throw new Error('move-btn not found');
    moveBtn.onclick = move;

    const turnBtn = document.getElementById('turn-btn');
    if (!turnBtn) throw new Error('turn-btn not found');
    turnBtn.onclick = turnRight;

    const restartBtn = document.getElementById('restart-btn');
    if (!restartBtn) throw new Error('restart-btn not found');
    restartBtn.onclick = restart;
}

let moveQueue: (() => void)[] = [];
let isRunningQueue = false;
const runQueue = (forceRun: boolean = false) => {
    if (!forceRun && isRunningQueue) return;
    isRunningQueue = true;
    if (moveQueue.length > 0) {
        setTimeout(() => {
            moveQueue[0]();
            moveQueue.shift();
            UI.paintBoard(BOARD);
            console.log('queue', moveQueue.length)
            runQueue(true);
        }, 200);
    }
    else {
        isRunningQueue = false;
    }
}

//playerControls:
const move = () => {
    moveQueue.push(() => BOARD.move(PLAYER, PLAYER.getPlayerLocation(), PLAYER.getNextMove()));
    runQueue();
}

const turnRight = () => {
    moveQueue.push(() => {
        PLAYER.turnRight();
        BOARD.updateItem(PLAYER);
    });
    runQueue();
}

const restart = () => {
    moveQueue = [];
    setupBoard();
}

function nextMap() {
    MAP = new MapGenerated(PLAYER?.getPlayerLocation() ?? 0);
}

function setupBoard() {

    const boardEvents = new BoardEvents();

    boardEvents.subscribeToBoardUpdate((eventArgs) => {
        UI.paintBoard(eventArgs.board);
    });

    boardEvents.subscribeToCellUpdate((eventArgs) => {
        //UI.paintBoard(BOARD);
        //  console.log('cell update', JSON.stringify(eventArgs))
        UI.updateCell(eventArgs.cell, eventArgs.index, eventArgs.isTemporary);
    });

    boardEvents.subscribeToInvalidStep((eventArgs) => {
        UI.updateCell(eventArgs.newLocation, eventArgs.player.location, true);
    });

    boardEvents.subscribeToGoalReached(() => {
        nextMap();
        setupBoard();
    });

    if (MAP === undefined) {
        nextMap();
        //TODO pull last map from localstorage?
        //pull first map from localstorage?
    }

    BOARD = new Board(MAP, boardEvents);
    const create = new InitializeMap<Board>(MAP);
    LIGHTSOUT = new LightsOut<Board>(2, ['goal', 'player'])

    BOARD = create.init(BOARD);

    //BLOCKLY needs a slightly different game mode...
    // PLAYER = new Player(MAP.player, MAP.width, PLAYER?.direction ?? 'east');
    PLAYER = new Player(MAP.player, MAP.width, 'east');
    BOARD.updateItem(PLAYER);

    //BOARD = LIGHTSOUT.init(BOARD);

    UI.paintBoard(BOARD, 100);
}

function setupUI() {
    const uiEvents = new UIUserEvents();

    uiEvents.subscribeToMove(() => {
        BOARD.move(PLAYER, PLAYER.getPlayerLocation(), PLAYER.getNextMove());
        // BOARD = LIGHTSOUT.update(BOARD, BOARD.getItemLocations('player')[0]);
    });

    uiEvents.subscribeToTurn(() => {
        PLAYER.turnRight();
        BOARD.updateItem(PLAYER);
    });

    uiEvents.subscribeToLight((eventArgs) => {

        if (!eventArgs.lightsOn) {
            BOARD = LIGHTSOUT.lightsOff(BOARD, PLAYER);
        }
        else {
            if (eventArgs.showWholeBoard) {
                BOARD = LIGHTSOUT.lightsOn(BOARD, PLAYER);
            }
            else {
                //TODO: make this based on the board dimentions
                const radius = 10;
                BOARD = LIGHTSOUT.lightsOn(BOARD, PLAYER, radius);
            }
        }
        console.log('lights', eventArgs)
        //BOARD = LIGHTSOUT.update(BOARD, PLAYER.getPlayerLocation());
        //UI.paintBoard(BOARD);
    });

    uiEvents.subscribeToSaveMap(() => {
        saveMap(MAP);
    });

    uiEvents.subscribeToReset((eventArgs) => {
        if (eventArgs.newMap) {
            nextMap();
        }

        setupBoard();
    });

    UI_INTERACTIONS = new UIUserInteractions(uiEvents);
}
