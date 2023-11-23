import { IMap, IMapItem } from "./types";
import * as Utils from "./map-utils";
import { PlayerMotionMap } from "./map-player-motions";

export function movePlayer(map: IMap): IMap {
    const newMap = Utils.cloneMap(map);

    const player = Utils.getPlayer(newMap);
    if (player !== undefined && player.direction !== undefined) {
        player.location = PlayerMotionMap.get(player.direction)!.nextMove(
            player.location,
            newMap.width
        );
    }

    return newMap;
}

export function turnPlayer(map: IMap): IMap {
    const newMap = Utils.cloneMap(map);

    const player = Utils.getPlayer(newMap);
    if (player !== undefined && player.direction !== undefined) {
        player.direction = PlayerMotionMap.get(player.direction)!.nextDirection;
    }

    return newMap;
}

export function checkPlayerGoal(map: IMap): boolean {
    const player = Utils.getPlayer(map);
    const goal = Utils.getGoal(map);
    let isGoal = false;

    if (player !== undefined && goal !== undefined) {
        if (player.location === goal.location) {
            isGoal = true;
        }
    }

    return isGoal;
}

export function getMap(): IMap {
    const map: IMap = {
        width: 20,
        height: 20,
        mapItems: new Map([
            ["empty", []],
            ["player", [{ type: "player", location: 0, direction: "east" }]],
            ["goal", [{ type: "goal", location: 2 }]],
            [
                "wall",
                [
                    { type: "wall", location: 20 },
                    { type: "wall", location: 21 },
                    { type: "wall", location: 22 },
                    { type: "wall", location: 23 },
                ],
            ],
        ]),
    };
    return map;
}

function compareMapItemAttributes(attrs1?: string[], attrs2?: string[]) {
    if (attrs1 === undefined && attrs2 === undefined) return true;
    if (attrs1 === undefined || attrs2 === undefined) return false;

    if (
        attrs1.length !== attrs2.length ||
        !attrs1?.every((a) => attrs2?.includes(a))
    )
        return false;

    return attrs1.every((a) => attrs2.includes(a));
}

export function compareMapItems(mapItem1?: IMapItem, mapItem2?: IMapItem) {
    if (mapItem1 === undefined && mapItem2 === undefined) return true;
    if (mapItem1 === undefined || mapItem2 === undefined) return false;

    if (
        mapItem1.type !== mapItem2.type ||
        mapItem1.location !== mapItem2.location ||
        mapItem1.direction !== mapItem2.direction
    ) {
        return false;
    }

    if (!compareMapItemAttributes(mapItem1.attributes, mapItem2.attributes)) {
        return false;
    }

    return true;
}

export function compareMapItemsArray(
    mapItems1?: IMapItem[],
    mapItems2?: IMapItem[]
) {
    let mapItemsMatch = true;
    console.log("mapItems1", mapItems1);
    console.log("mapItems2", mapItems2);
    if (mapItems1 === undefined && mapItems2 === undefined) return true;
    if (mapItems1 === undefined || mapItems2 === undefined) return false;

    if (mapItems1.length !== mapItems2.length) {
        return false;
    } else {
        mapItems1.forEach((mapItem1) => {
            const mapItems2Match = mapItems2.some((mapItem2) =>
                compareMapItems(mapItem1, mapItem2)
            );
            mapItemsMatch = mapItemsMatch && mapItems2Match;
        });
    }

    return mapItemsMatch;
}

export function compareMaps(map1: IMap, map2: IMap): boolean {
    let mapsMatch = true;

    if (map1.width !== map2.width || map1.height !== map2.height) {
        mapsMatch = false;
    }

    map1.mapItems.forEach((mapItems1, key) => {
        const mapItems2 = map2.mapItems.get(key);
        const mapItemsMatch = compareMapItemsArray(mapItems1, mapItems2);
        mapsMatch = mapsMatch && mapItemsMatch;
    });

    return mapsMatch;
}
