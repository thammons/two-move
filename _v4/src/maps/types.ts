export type MapItemType = 'empty' | 'player' | 'wall' | 'goal';
export type AttributeType = 'seen' | 'unseen' | 'fog' | 'error-west' | 'error-east' | 'error-north' | 'error-south';
export type Direction = 'north' | 'south' | 'east' | 'west';

export interface IMapItem {
    id?: string;
    type: MapItemType;
    location: number;
    direction?: Direction;
    attributes?: AttributeType[];
}

export interface IPlayer extends IMapItem {
    nextDirectionMap: Map<Direction, Direction>;
}


export interface IMap {
    width: number;
    height: number;
    // cellWidth: number;
    // walls: Set<ItemLocation>;
    mapItems: Map<MapItemType, IMapItem[]>;
}
