import { BoardItemType } from "@/board/types";
import { IMap, IMapItem } from "./types";

export function cloneMap(map: IMap) {

    const newMap = JSON.parse(JSON.stringify(map));
    const mapItems = new Map<string, IMapItem[]>();
    for (let [key, value] of map.mapItems) {
        mapItems.set(key, JSON.parse(JSON.stringify(value)));
    };
    newMap.mapItems = mapItems;
    return newMap;
}

export function getByItemsType(map: IMap, itemType: BoardItemType): IMapItem[] {
    const items = map.mapItems.get(itemType);
    if (items !== undefined) {
        return items;
    }
    return [];
}

export function getByItemType(map: IMap, itemType: BoardItemType): IMapItem | undefined {
    const items = map.mapItems.get(itemType);
    if (items !== undefined && items.length === 1) {
        return items[0];
    }
    return undefined;
}

export function getPlayer(map: IMap): IMapItem | undefined {
    return getByItemType(map, 'player');
}

export function getGoal(map: IMap): IMapItem | undefined {
    return getByItemType(map, 'goal');
}
