import { range } from "@/infrastructure/helpers";
import {
    Direction,
    IMap,
    IMapGeneratorSettings,
    IMapItem,
    MapItemType,
} from "../index";

export function getNextMap(settings: IMapGeneratorSettings): IMap {
    let map = {
        height: settings.height,
        width: settings.width,
        mapItems: new Map<MapItemType, IMapItem[]>(),
    } as IMap;

    const playerItem = createMapItem(
        "player",
        settings.playerStartLocation || 0,
        settings.playerStartDirection || "east"
    );

    map.mapItems.set(playerItem.type, [playerItem]);

    const goalItem = createMapItem("goal", getNextLocation(settings.height * settings.width));
    map.mapItems.set(goalItem.type, [goalItem]);

    //TODO: check walls touching 2 walls and regen if true
    const invalidWallLocations = [playerItem.location, goalItem.location];
    map.mapItems.set("wall", createWalls(settings, invalidWallLocations));

    return map;
}

function createMapItem(
    type: MapItemType,
    location: number,
    direction?: Direction
): IMapItem {
    return { type, location, direction };
}

function createWalls(
    settings: IMapGeneratorSettings,
    occupiedLocations: number[]
): IMapItem[] {
    const invalidWallLocations = [...occupiedLocations];
    const defaultWallCount = Math.floor(settings.height * settings.width * 0.3);
    const wallCount = settings.wallCount || defaultWallCount;
    const size = settings.height * settings.width;

    const wallLocations: number[] = [];
    range(wallCount).forEach((_) => {
        let randomLocation = getNextLocation(size);

        while (invalidWallLocations.includes(randomLocation)) {
            randomLocation = getNextLocation(size);
        }

        invalidWallLocations.push(randomLocation);
        wallLocations.push(randomLocation);
    });

    return wallLocations.map((location) => createMapItem("wall", location));
}

function getNextLocation(size: number): number {
    return Math.floor(Math.random() * (size - 1) + 1);
}
