export type BoardItemType = 'empty' | 'player' | 'wall' | 'goal';
export type AttributeType = 'seen' | 'unseen' | 'fog' | 'error-west' | 'error-east' | 'error-north' | 'error-south';
export type Direction = 'north' | 'south' | 'east' | 'west';

export type ItemLocation = number;

export interface IMapItem {
    type: BoardItemType;
    location: ItemLocation;
    direction?: Direction;
}

export interface IPlayer extends IMapItem {
    nextDirectionMap: Map<Direction, Direction>;
}

export interface IMapItemCollection {
    items: IMapItem[];
    attributes: AttributeType[];
}

export interface IMap {
    width: number;
    height: number;
    cellWidth: number;
    walls: Set<ItemLocation>;
}

export interface IMapSettings extends IMap {
    goal: ItemLocation;
    player: ItemLocation;
}

export interface IMapState extends IMap {
    mapItems: Map<BoardItemType, IMapItemCollection>;
}