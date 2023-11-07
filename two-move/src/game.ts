import Board from "./board/board";
import { BoardEvents } from "./board/events";
import MapGenerated from "./maps/generate-map1";
import { MapWalledPlayerBox } from "./maps/open-map";
import Player from "./player";
import { IMap } from "./types";
import { UI, UIUserEvents, UIUserInteractions } from "./ui";

import { InitializeMap, LightsOut } from './board-builders/index';
import { saveMap, getNextMap } from './maps/save-map';

import { Mover, MoverTypes } from './player-movers/index';


//TODO make this an object so blockly and use it differently than free play mode


const moverType: MoverTypes = 'random-walker';
const moverSpeed = 150;

function nextMap() {
    MAP = new MapGenerated(PLAYER?.getPlayerLocation() ?? 0);
    //  MAP = new MapWalledPlayerBox();
}

var MOVER: Mover;
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

function setupBoard() {

    const boardEvents = new BoardEvents();

    boardEvents.subscribeToBoardUpdate((eventArgs) => {
        UI.paintBoard(eventArgs.board);
    });

    boardEvents.subscribeToCellUpdate((eventArgs) => {
        //UI.paintBoard(BOARD);
        //console.log('cell update', JSON.stringify(eventArgs))
        UI.updateCell(eventArgs.cell, eventArgs.index, eventArgs.isTemporary);
    });

    boardEvents.subscribeToMoved(() => {
        LIGHTSOUT.update(BOARD, BOARD.getItemLocations('player')[0]);
        //UI.updateCell(eventArgs.cell, eventArgs.index, eventArgs.isTemporary);
        UI.paintBoard(BOARD);
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

    BOARD = LIGHTSOUT.init(BOARD);
    
    if (!!MOVER) MOVER.stop();
    MOVER = new Mover(moverType);
    MOVER.runMover(PLAYER, BOARD, moverSpeed);
    
    UI.paintBoard(BOARD, 100);
}

function setupUI() {
    const uiEvents = new UIUserEvents();

    uiEvents.subscribeToMove(() => {
        BOARD.move(PLAYER, PLAYER.getPlayerLocation(), PLAYER.getNextMove());
        LIGHTSOUT.update(BOARD, BOARD.getItemLocations('player')[0]);
    });

    uiEvents.subscribeToTurn(() => {
        PLAYER.turnRight();
        BOARD.updateItem(PLAYER);
    });

    uiEvents.subscribeToLight((eventArgs) => {

        if (!eventArgs.lightsOn) {
            LIGHTSOUT.lightsOff(BOARD, PLAYER);
        }
        else {
            if (eventArgs.showWholeBoard) {
                LIGHTSOUT.lightsOn(BOARD, PLAYER);
            }
            else {
                //TODO: make this based on the board dimentions
                const radius = 10;
                LIGHTSOUT.lightsOn(BOARD, PLAYER, radius);
            }
        }
        console.log('lights', eventArgs)
        LIGHTSOUT.update(BOARD, PLAYER.getPlayerLocation());
        UI.paintBoard(BOARD);
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
