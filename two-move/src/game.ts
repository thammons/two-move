import Board from "./board/board";
import { BoardEvents } from "./board/events";
import MapGenerated from "./maps/generate-map1";
import { MapWalledPlayerBox } from "./maps/open-map";
import Player from "./player";
import { IBoard, IBoardEvents, IMap, IMove, IMover, IPlayer } from "./types";
import { UI, type IUIEvents, Types as UITypes, KeyboardInteractions, UIEvents } from "./ui";

import { InitializeMap, LightsOut } from './board-builders/index';
import { saveMap, getNextMap } from './maps/save-map';

import { Mover, MoverTypes } from './player-movers/index';
import { IUIMover, UIMover, UIMoverRunner, getKeyboardMover } from "./ui/movers/ui-mover";


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

export interface IGameOptions {
    useMover: boolean,
    uiMoverCreators: ((speed: number, player: IPlayer, board: IBoard) => IUIMover)[],
    moverType: MoverTypes,
    moverSpeed: number,
    getNextMap: (player: IPlayer) => IMap,
}

const GameOptions: IGameOptions = {
    useMover: false,
    moverType: 'wall-follower',
    moverSpeed: 150,
    uiMoverCreators: [getKeyboardMover],
    getNextMap: (player: IPlayer) => new MapGenerated(player?.getPlayerLocation() ?? 0)
}

window.onload = () => {
    const game = new Game(GameOptions);
    game.init();

}


// var MOVER: Mover;
// var MAP: IMap;
// var PLAYER: Player;
// var LIGHTSOUT: LightsOut<Board>;
// var BOARD: Board;

// let UI_INTERACTIONS: UIUserInteractions;

class UIButtonMover implements IMover {

    moves: IMove[] = [];
    getNextMove(player: IPlayer, board: IBoard): IMove {

        //if no moves, just wait
        if (!this.moves.length)
            return {
                direction: player.direction,
                startLocation: player.location,
                desitnationLocation: player.location,
                isMove: false
            };
        return this.moves.shift()!;
    }
}

//TODO add UI mover




export class Game {

    private useMover: boolean;
    private moverType: MoverTypes;
    private moverSpeed: number;
    private map: IMap;
    private getNextMap: (player: IPlayer) => IMap;

    //this isn't read as it uses eventhandlers
    private uiMovers: IUIMover[] = [];
    private uiMoverCreators: ((speed: number, player: IPlayer, board: IBoard) => IUIMover)[];


    private board: Board | undefined = undefined;
    private lightsout: LightsOut<Board> | undefined = undefined;


    private player: Player | undefined = undefined;
    private mover: Mover | undefined = undefined;

    constructor(boardOptions: IGameOptions) {
        this.useMover = boardOptions.useMover;
        this.moverType = boardOptions.moverType;
        this.moverSpeed = boardOptions.moverSpeed;
        this.uiMoverCreators = boardOptions.uiMoverCreators;
        this.getNextMap = boardOptions.getNextMap;

        this.map = this.getNextMap(this.player!);
    }

    init() {
        this.setupBoard();
        this.setupUI();
        // console.log(Maps1);
        // MAP_FROM_JSON = new MapFromJson(Maps1);
    }

    private setupBoard() {
        if (this.map === undefined) {
            this.getNextMap(this.player!);
            //TODO pull last map from localstorage?
            //pull first map from localstorage?
        }

        this.board = new Board(this.map);
        const create = new InitializeMap<Board>(this.map);
        this.lightsout = new LightsOut<Board>(2, ['goal', 'player'])

        this.board = create.init(this.board);

        //BLOCKLY needs a slightly different game mode...
        // PLAYER = new Player(MAP.player, MAP.width, PLAYER?.direction ?? 'east');
        this.player! = new Player(this.map.player, this.map.width, 'east');
        this.board.updateItem(this.player!);

        //adds board handlers in init
        this.lightsout.init(this.board);

        const uiHandlers: IBoardEvents = {
            boardUpdateHandlers: [(eventArgs) => UI.paintBoard(eventArgs.board)],
            cellUpdateHandlers: [(eventArgs) => UI.updateCell(eventArgs.cell, eventArgs.index, eventArgs.isTemporary)],
            movedHandlers: [(eventArgs) => UI.updateCell(eventArgs.cell, eventArgs.index, eventArgs.isTemporary)],
            invalidStepHandlers: [(eventArgs) => UI.updateCell(eventArgs.newLocation, eventArgs.player.location, true)],
            goalReachedHandlers: [
                () => {
                    this.getNextMap(this.player!);
                    this.setupBoard();
                }
            ]
        };
        this.board.addEventListeners(uiHandlers);

        if (this.useMover) {
            if (!!this.mover) this.mover.stop();
            this.mover = new Mover(this.moverType);
            this.mover.runMover(this.player!, this.board, this.moverSpeed);
        }

        UI.paintBoard(this.board, 100);
    }

    private setupUI() {
        const uiEvents: IUIEvents = {
            moveHandlers: [() => {
                this.board!.move(this.player!, this.player!.getPlayerLocation(), this.player!.getNextMove());
                // this.lightsout!.update(this.board!, this.board!.getItemLocations('player')[0]);
            }],
            turnHandlers: [() => {
                this.player!.turnRight();
                this.board!.updateItem(this.player!);
            }],
            lightHandlers: [(eventArgs) => {

                if (!eventArgs.lightsOn) {
                    this.lightsout!.lightsOff(this.board!, this.player!);
                }
                else {
                    if (eventArgs.showWholeBoard) {
                        this.lightsout!.lightsOn(this.board!, this.player!);
                    }
                    else {
                        //TODO: make this based on the board dimentions
                        const radius = 10;
                        this.lightsout!.lightsOn(this.board!, this.player!, radius);
                        // This will mark the cells as seen
                        // LIGHTSOUT.update(BOARD, PLAYER.getPlayerLocation());
                    }
                }
                UI.paintBoard(this.board!);
            }],
            saveMapHandlers: [() => {
                saveMap(this.map);
            }],
            resetHandlers: [(eventArgs) => {
                if (eventArgs.newMap) {
                    this.getNextMap(this.player!);
                }

                this.setupBoard();
            }]
        }

        if (!this.uiMovers.length)
            this.uiMovers = [];
//Player has no direction?
        this.uiMovers = this.uiMoverCreators.map((fn) => {
            return fn(this.moverSpeed, this.player!, this.board!);
        });

        this.uiMovers.forEach((mover) => {
            const runner = new UIMoverRunner();
            runner.runQueue(mover, this.player!, this.board!);
            UI.paintBoard(this.board!);
        });
    }
}