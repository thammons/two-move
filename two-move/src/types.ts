import { IUIEvents } from "./ui/types";

export type Direction = 'east' | 'west' | 'north' | 'south';
export type PlayerIndicator = '>' | '<' | '^' | 'v';
export type Indicator = PlayerIndicator | 'X' | ' ';

export type CellType = 'wall' | 'player' | 'goal';
export type CellClass = CellType | 'fog' | 'unseen' | 'seen' | string;

export type ItemLocation = number;

export interface IMoverCreatorParams {
    speed: number;
    player: IPlayer;
    board: IBoard;
    attachEvents: IUIEvents;
}

export interface IGameOptions {
    moverCreators: ((params: IMoverCreatorParams) => IMover)[],
    moverSpeed: number,
    getNextMap: (player: IPlayer) => IMap,
    lightsout?: boolean,
    fadeOnReset?: boolean,
    preservePlayerDirection?: boolean,
}

export interface IMap {
    width: number;
    height: number;
    cellWidth: number;
    walls: ItemLocation[];
    goal: ItemLocation;
    player: ItemLocation;
}

export interface IBoardUpdateEvent {
    board: IBoard,
}

export interface ICellUpdateEvent {
    cell: ICell,
    index: number,
    isTemporary: boolean
}

export interface IInvalidStepEvent {
    direction: Direction,
    player: IPlayer,
    newLocation: ICell
}

export interface IBoardEvents {
    boardUpdateHandlers: ISimpleEventHandler<IBoardUpdateEvent>[];
    cellUpdateHandlers: ISimpleEventHandler<ICellUpdateEvent>[];
    movedHandlers: ISimpleEventHandler<ICellUpdateEvent>[];
    invalidStepHandlers: ISimpleEventHandler<IInvalidStepEvent>[];
    goalReachedHandlers: ISignalHandler[];
}

export interface IBoard {
    width: number;
    height: number;
    cellWidth: number;
    map: IMap;
    addEventListeners(events: IBoardEvents): void;
    getItemLocations(itemType: CellType | string): ItemLocation[];
    getCells(): ICell[];
    updateCell(index: ItemLocation): void;
    getCell(position: ItemLocation): ICell;
    setCells(cells: ICell[]): void;
    setCell(position: ItemLocation, cell: ICell): void;
    updateItem(item: IMapItem): void;
    isAtGoal(desiredLocation: ItemLocation): boolean;
    isValidMove(startLocation: ItemLocation, desiredLocation: ItemLocation): boolean;
    move(player: IPlayer, startLocation: ItemLocation, endLocation: ItemLocation): boolean;
}

export interface IBoardBuilderOption<T extends IBoard> {
    init(board: T): T;
    update(board: T, targetLocation: ItemLocation): T;
}

export interface IMapItem {
    cellType: CellType | string;
    indicator: Indicator;
    location: ItemLocation;
};

export class Fog implements IMapItem {
    cellType: CellType | string;
    indicator: Indicator;
    location: ItemLocation;
    constructor() {
        this.cellType = 'fog';
        this.indicator = ' ';
        this.location = 0;
    }
};

export interface IMapItemActionable extends IMapItem {
    action: (board: IBoard) => void;
}

export interface IMapItemMoveable extends IMapItem {
    direction: Direction;
    setNextLocation(): void;
    turnRight(): void;
}

export interface IMapItemDamageable extends IMapItem {
    hitPoints: number;
    doDamage(damage: number): void;
}

export interface IMapItemAttackable extends IMapItem {
    attack(mapitem: IMapItem): void;
}


export interface ICell {
    indicator: Indicator;
    mapItems: IMapItem[];
    classes: CellClass[];
}

export interface IPlayer extends IMapItem {
    direction: Direction;
    setNextLocation(): void;
    turnRight(): void;
    getPlayerLocation(): ItemLocation;
    getIndicator(): PlayerIndicator;
    getNextMove(): ItemLocation;
}

export interface IMove {
    direction: Direction;
    startLocation: ItemLocation;
    desitnationLocation: ItemLocation;
    isMove: boolean;
}

export interface IMover {
    speed: number;
    clear(): void;
    getNextMove(player: IPlayer, board: IBoard): IMove;
}

export interface IEventHandler<TSender, TArgs> {
    (sender: TSender, args: TArgs): void
}

export interface ISimpleEventHandler<TArgs> {
    (args: TArgs): void
}

export interface ISignalHandler {
    (): void;
}
