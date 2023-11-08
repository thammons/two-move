import Board from "./board/board";
import Player from "./player";
import { IBoard, IBoardEvents, IGameOptions, IMap, IMover, IPlayer } from "./types";

import { InitializeMap, LightsOut } from './board-builders/index';
import { saveMap } from './maps/save-map';

import { IUIEvents } from "./ui/types";
import { UI } from "./ui";
import { ScoreBoard } from "./scoreing";
import { printScoreboard } from "./ui/ui-scoreing";
import { MoverRunner } from "./player-movers/move-runner";


//TODO make moves a dropdown in the ui? TEST PAGE!!
//TODO make maps like mover - wraper class with a type to generate a map

//lights - pass the board to the lights out class, have it attach it's own handlers. handlers need a priority?
//ui - pass the board to the ui class, have it attach it's own handlers

//Test page:
// Set map size / cell size
// pick mover / set speed
// map builder (buttons for picking cell type, click on map to set cell's type - toggle, default to empty)

//WallFollower mover still needs work (commented out method), gets stuck in loop if no walls to collide into
//screen sweeper needs to flip and go north when bottom of the map is swept
//wallfollower types need to be in MoverTypes


export function onload(gameOptions: IGameOptions) {
    window.onload = () => {
        const game = new Game(gameOptions);
        game.init();
    }
}

export class Game {
    private score: ScoreBoard | undefined = undefined;
    private moverSpeed: number;
    private map: IMap;
    private getNextMap: (player: IPlayer) => IMap;

    //this isn't read as it uses eventhandlers
    private movers: IMover[] = [];
    private moverCreators: ((speed: number, player: IPlayer, board: IBoard) => IMover)[];
    private moverRunner: MoverRunner | undefined = undefined;

    private board: Board | undefined = undefined;
    private lightsout: LightsOut<Board> | undefined = undefined;

    private player: Player | undefined = undefined;

    constructor(boardOptions: IGameOptions) {
        this.moverSpeed = boardOptions.moverSpeed;
        this.moverCreators = boardOptions.moverCreators;
        this.getNextMap = boardOptions.getNextMap;

        this.map = this.getNextMap(this.player!);
        this.score = new ScoreBoard(ScoreBoard.loadScore())
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

        this.setupBoardHanders();

        this.setupMovers();

        UI.paintBoard(this.board!, 100);
    }

    private setupBoardHanders() {
        this.lightsout!.init(this.board!);

        const uiHandlers: IBoardEvents = {
            boardUpdateHandlers: [(eventArgs) => UI.paintBoard(eventArgs.board)],
            cellUpdateHandlers: [(eventArgs) => UI.updateCell(eventArgs.cell, eventArgs.index, eventArgs.isTemporary)],
            movedHandlers: [
                (eventArgs) => {
                    UI.updateCell(eventArgs.cell, eventArgs.index, eventArgs.isTemporary);
                    if (!!this.score) {
                        this.score.updateScore();
                        ScoreBoard.saveScore(this.score);
                        printScoreboard(this.score!);
                    }
                }],
            invalidStepHandlers: [
                (eventArgs) => {
                    UI.updateCell(eventArgs.newLocation, eventArgs.player.location, true);
                    if (!!this.score) {
                        this.score.updateCollisions();
                        ScoreBoard.saveScore(this.score);
                        printScoreboard(this.score!);
                    }
                }],
            goalReachedHandlers: [
                () => {
                    this.getNextMap(this.player!);
                    if (!!this.score) {
                        this.score.updateLevel();
                        ScoreBoard.saveScore(this.score);
                        printScoreboard(this.score!);
                    }
                    this.setupBoard();
                }
            ]
        };
        this.board!.addEventListeners(uiHandlers);
    }

    private setupMovers() {
        if (!!this.movers.length) {
            this.moverRunner?.halt();
            this.moverRunner = undefined;
            this.movers = [];
        }

        this.movers = this.moverCreators.map((fn) => {
            return fn(this.moverSpeed, this.player!, this.board!);
        });

        this.moverRunner = new MoverRunner();
        this.moverRunner.runMovers(this.movers, this.player!, this.board!);
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

    }
}