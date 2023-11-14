export type BoardItemType = 'empty' | 'player' | 'wall' | 'goal';
export type AttributeType = 'seen' | 'unseen' | 'fog' | 'error-west' | 'error-east' | 'error-north' | 'error-south';
export type Direction = 'north' | 'south' | 'east' | 'west';

export type ItemLocation = number;

export interface IBoardItem {
    type: BoardItemType;
    location: ItemLocation;
    direction?: Direction;
}

export interface IPlayer extends IBoardItem {
    direction: Direction;
    getPlayerLocation(): ItemLocation;
    setNextLocation(): void;
    getNextMove(): ItemLocation;
    getNextDirection(): Direction;
    turnRight(): void;
}

export interface IBoardCell {
    items: IBoardItem[];
    attributes: AttributeType[];
}

export interface IMap {
    width: number;
    height: number;
    cellWidth: number;
    walls: ItemLocation[];
    goal: ItemLocation;
    player: ItemLocation;
}

export interface IBoard {
    width: number;
    height: number;
    cellWidth: number;
    map: IMap;
}