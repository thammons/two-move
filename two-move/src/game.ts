import Board from "./board/board";
import { BoardEvents } from "./board/events";
import MapGenerated from "./maps/generate-map1";
import Player from "./player";
import { IMap } from "./types";
import { UI, UIUserEvents, UIUserInteractions } from "./ui";

import { InitializeMap, LightsOut } from './board-builders/index.js';
import { saveMap, getNextMap } from './maps/save-map.js';


let MAP: IMap;
let PLAYER: Player;
let LIGHTSOUT: LightsOut<Board>;
let BOARD: Board;

let UI_INTERACTIONS: UIUserInteractions;

init();

export function init() {
    window.onload = () => {
        setupBoard();
        setupUI();
        // console.log(Maps1);
        // MAP_FROM_JSON = new MapFromJson(Maps1);
    }
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

    PLAYER = new Player(MAP.player, MAP.width, PLAYER?.direction ?? 'east');
    BOARD.updateItem(PLAYER);

    BOARD = LIGHTSOUT.init(BOARD);

    UI.paintBoard(BOARD, 100);
}

function setupUI() {
    const uiEvents = new UIUserEvents();

    uiEvents.subscribeToMove(() => {
        BOARD.move(PLAYER, PLAYER.getPlayerLocation(), PLAYER.getNextMove());
        BOARD = LIGHTSOUT.update(BOARD, BOARD.getItemLocations('player')[0]);
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
