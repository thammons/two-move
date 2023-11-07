import Board from "./board/board";
import { BoardEvents } from "./board/events";
import MapGenerated from "./maps/generate-map1";
import { MapWalledPlayerBox } from "./maps/open-map";
import Player from "./player";
import { IBoardEvents, IMap } from "./types";
import { UI, UIUserEvents, UIUserInteractions } from "./ui";

import { InitializeMap, LightsOut } from './board-builders/index';
import { saveMap, getNextMap } from './maps/save-map';

import { Mover, MoverTypes } from './player-movers/index';


//TODO make this (game.ts) an object so blockly and use it differently than free play mode
//TODO make moves a dropdown in the ui? TEST PAGE!!
//TODO add the scoreboard
//TODO make maps like mover - wraper class with a type to generate a map

//lights - pass the board to the lights out class, have it attach it's own handlers. handlers need a priority?
//ui - pass the board to the ui class, have it attach it's own handlers

//Test page:
// Set map size / cell size
// pick mover / set speed
// map builder (buttons for picking cell type, click on map to set cell's type - toggle, default to empty)

//push walls? - when you bang against it, the wall shifts one space in the direction you hit it, 
//  stopping if there is an item or edge of the map

//WallFollower mover still needs work (commented out method), gets stuck in loop if no walls to collide into
//screen sweeper needs to flip and go north when bottom of the map is swept

const useMover = false;
const moverType: MoverTypes = 'wall-follower';
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
    if (MAP === undefined) {
        nextMap();
        //TODO pull last map from localstorage?
        //pull first map from localstorage?
    }

    BOARD = new Board(MAP);
    const create = new InitializeMap<Board>(MAP);
    LIGHTSOUT = new LightsOut<Board>(2, ['goal', 'player'])

    BOARD = create.init(BOARD);

    //BLOCKLY needs a slightly different game mode...
    // PLAYER = new Player(MAP.player, MAP.width, PLAYER?.direction ?? 'east');
    PLAYER = new Player(MAP.player, MAP.width, 'east');
    BOARD.updateItem(PLAYER);

    //adds board handlers in init
    LIGHTSOUT.init(BOARD);

    const uiHandlers: IBoardEvents = {
        boardUpdateHandlers: [(eventArgs) => UI.paintBoard(eventArgs.board)],
        cellUpdateHandlers: [(eventArgs) => UI.updateCell(eventArgs.cell, eventArgs.index, eventArgs.isTemporary)],
        movedHandlers: [(eventArgs) => UI.updateCell(eventArgs.cell, eventArgs.index, eventArgs.isTemporary)],
        invalidStepHandlers: [(eventArgs) => UI.updateCell(eventArgs.newLocation, eventArgs.player.location, true)],
        goalReachedHandlers: [
            () => {
                nextMap();
                setupBoard();
            }
        ]
    };
    BOARD.addEventListeners(uiHandlers);

    if (useMover) {
        if (!!MOVER) MOVER.stop();
        MOVER = new Mover(moverType);
        MOVER.runMover(PLAYER, BOARD, moverSpeed);
    }

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
                // This will mark the cells as seen
                // LIGHTSOUT.update(BOARD, PLAYER.getPlayerLocation());
            }
        }
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
