import { AttributeType, BoardItemType, Direction } from "@/board/types";

export interface IMapItem {
    id?: string;
    type: BoardItemType;
    location: number;
    direction?: Direction;
    attributes?: AttributeType[];
}

export interface IMap {
    width: number;
    height: number;
    // cellWidth: number;
    // walls: Set<ItemLocation>;
    mapItems: Map<BoardItemType, IMapItem[]>;
}
