import Board from "./board/board";
import Player from "./player";
import { IBoardEvents, IGameOptions, IMap, IMover, IMoverCreatorParams, IPlayer } from "./types";

import { InitializeMap, LightsOut } from './board-builders/index';
import { saveMap } from './maps/save-map';

import { IUIEvents } from "./ui/types";
import { UI } from "./ui";
import { ScoreBoard } from "./scoreing";
import { printScoreboard } from "./ui/ui-scoreing";
import { MoverRunner } from "./player-movers/move-runner";
import { showCollisionMessage, showLastMove, showWinMessage } from "./ui/ui-board";


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
    window.addEventListener('load', () => {
        const game = new TwoMoveGame(gameOptions);
        game.init();
    });
}

export class TwoMoveGame {
    private score: ScoreBoard | undefined = undefined;
    private moverSpeed: number;
    private map: IMap;
    private getNextMap: (player: IPlayer) => IMap;

    //this isn't read as it uses eventhandlers
    private movers: IMover[] = [];
    private moverCreators: ((params: IMoverCreatorParams) => IMover)[];
    private moverRunner: MoverRunner | undefined = undefined;

    private board: Board | undefined = undefined;
    private fadeOnReset: boolean = false;
    private useLightesOut: boolean = true;
    private lightsout: LightsOut<Board> | undefined = undefined;
    private flashlightRadius: number = 10;

    private player: Player | undefined = undefined;
    private preservePlayerDirection: boolean = true;

    constructor(boardOptions: IGameOptions) {
        this.fadeOnReset = boardOptions.fadeOnReset ?? this.fadeOnReset;
        this.moverSpeed = boardOptions.moverSpeed;
        this.moverCreators = boardOptions.moverCreators;
        this.getNextMap = boardOptions.getNextMap;
        this.useLightesOut = boardOptions.lightsout ?? this.useLightesOut;
        this.preservePlayerDirection = boardOptions.preservePlayerDirection ?? this.preservePlayerDirection;
        this.map = this.getNextMap(this.player!);
        this.score = new ScoreBoard(ScoreBoard.loadScore());
    }

    init() {
        this.setupBoard();
        // console.log(Maps1);
        // MAP_FROM_JSON = new MapFromJson(Maps1);
    }

    private setupBoard() {
        let boardLoadFade = 100;
        if (this.map === undefined) {
            this.map = this.getNextMap(this.player!);
            //TODO pull last map from localstorage?
            //pull first map from localstorage?
        }
        else {
            boardLoadFade = this.fadeOnReset ? boardLoadFade : 0;
        }

        this.board = new Board(this.map);
        const create = new InitializeMap<Board>(this.map);
        if (this.useLightesOut)
            this.lightsout = new LightsOut<Board>(2, ['goal', 'player'])

        this.board = create.init(this.board);

        const playerDirection = this.preservePlayerDirection ? this.player?.direction : 'east';
        this.player! = new Player(this.map.player, this.map.width, playerDirection);
        this.board.updateItem(this.player!);

        this.setupBoardHanders();

        this.setupMovers();

        UI.paintBoard(this.board!, boardLoadFade);
    }

    private setupBoardHanders() {
        if (this.lightsout && this.board)
            this.lightsout.init(this.board);

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
                        showCollisionMessage();
                    }
                }],
            goalReachedHandlers: [
                () => {
                    this.map = this.getNextMap(this.player!);
                    if (!!this.score) {
                        this.score.updateLevel();
                        ScoreBoard.saveScore(this.score);
                        printScoreboard(this.score!);
                        showWinMessage();
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
            return fn({
                speed: this.moverSpeed,
                player: this.player!,
                board: this.board!,
                attachEvents: this.getUIEvents()
            });
        });

        this.moverRunner = new MoverRunner();
        this.moverRunner.runMovers(this.movers, this.player!, this.board!);
    }

    private getUIEvents(): IUIEvents {
        const lightsHandler = this.lightsout === undefined
            ? []
            : this.lightsout.getUIEvents(this.flashlightRadius, this.board!, this.player!);
            
        const uiEvents: IUIEvents = {
            moveHandlers: [() => showLastMove(this.player?.direction ?? 'east', true)],
            turnHandlers: [() => showLastMove(this.player?.getNextDirection() ?? 'east', false)],
            lightHandlers: lightsHandler,
            saveMapHandlers: [() => {
                saveMap(this.map);
            }],
            resetHandlers: [(eventArgs) => {
                if (eventArgs.newMap) {
                    this.map = this.getNextMap(this.player!);
                }

                this.setupBoard();
            }]
        };

        return uiEvents;

    }
}