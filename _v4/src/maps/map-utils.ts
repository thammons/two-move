import { IMap, IMapItem, MapItemType } from "./types";

export function cloneMap(map: IMap) {

    const newMap = JSON.parse(JSON.stringify(map));
    const mapItems = new Map<string, IMapItem[]>();
    for (let [key, value] of map.mapItems) {
        mapItems.set(key, JSON.parse(JSON.stringify(value)));
    };
    newMap.mapItems = mapItems;
    return newMap;
}

export function getItemsByType(map: IMap, itemType: MapItemType): IMapItem[] {
    const items = map.mapItems.get(itemType);
    if (items !== undefined) {
        return items;
    }
    return [];
}

export function getItemByType(map: IMap, itemType: MapItemType): IMapItem | undefined {
    const items = map.mapItems.get(itemType);
    if (items !== undefined && items.length === 1) {
        return items[0];
    }
    return undefined;
}

export function getPlayer(map: IMap): IMapItem | undefined {
    return getItemByType(map, 'player');
}

export function getGoal(map: IMap): IMapItem | undefined {
    return getItemByType(map, 'goal');
}
