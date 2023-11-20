export type MapItemType = "empty" | "player" | "wall" | "goal";
export type ErrorAttributes =
    | "error-west"
    | "error-east"
    | "error-north"
    | "error-south";
export type AttributeType = ErrorAttributes | "seen" | "unseen" | "fog";
export type Direction = "north" | "south" | "east" | "west";

export interface IMap {
    width: number;
    height: number;
    // cellWidth: number;
    // walls: Set<ItemLocation>;
    mapItems: Map<MapItemType, IMapItem[]>;
}

export interface IMapItem {
    id?: string;
    type: MapItemType;
    location: number;
    direction?: Direction;
    attributes?: AttributeType[];
}

// export interface IPlayer extends IMapItem {
//     nextDirectionMap: Map<Direction, Direction>;
// }
