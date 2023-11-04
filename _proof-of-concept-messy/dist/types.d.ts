export type Direction = 'east' | 'west' | 'north' | 'south';
export type PlayerIndicator = '>' | '<' | '^' | 'v';
export type Indicator = PlayerIndicator | 'X' | ' ';
export type CellType = 'wall' | 'player' | 'goal';
export type CellClass = CellType | 'fog' | 'unseen' | 'seen' | string;
export type ItemLocation = number;
export interface IMap {
    width: number;
    height: number;
    cellWidth: number;
    walls: ItemLocation[];
    goal: ItemLocation;
    player: ItemLocation;
}
export interface IBoardHooks {
    validStep: (player: IPlayer, previousLocation: ItemLocation, cell: ICell) => void;
    invalidStep: (player: IPlayer, cell: ICell, direction: Direction) => void;
}
export interface IBoard {
    width: number;
    height: number;
    cellWidth: number;
    map: IMap;
    getItemLocations(itemType: CellType | string): ItemLocation[];
    getCells(): ICell[];
    getCell(position: ItemLocation): ICell;
    setCells(cells: ICell[]): void;
    setCell(position: ItemLocation, cell: ICell): void;
    update(item: IMapItem): void;
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
}
export declare class Fog implements IMapItem {
    cellType: CellType | string;
    indicator: Indicator;
    location: ItemLocation;
    constructor();
}
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
}
export interface IMove {
    direction: Direction;
    startLocation: ItemLocation;
    desitnationLocation: ItemLocation;
    isMove: boolean;
}
export interface IMover {
    getNextMove(player: IPlayer, board: IBoard): IMove;
}
//# sourceMappingURL=types.d.ts.map