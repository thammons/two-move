import { IMap, ItemLocation } from "../types";
import MapGenerated from "./generate-map1";
import { CustomMap } from "./custom-map";
import { MapBigSimple, MapWalledPlayerBox, MapWalledPlayerUnEvenBox } from "./simple-maps";

export const MapNames = ['from-saved', 'generated', 'custom', 'simple', 'big-simple', 'walled-player-box', 'walled-player-uneven-box'];
export type MapType = 'from-saved' | 'generated' | 'custom' | 'simple' | 'big-simple' | 'walled-player-box' | 'walled-player-uneven-box';

export interface IMapParams {
    boardWidth: number;
    boardHeight: number;
    cellWidth: number;
    walls?: ItemLocation[];
    playerLocation?: ItemLocation;
    goalLocation?: ItemLocation;
    difficulty?: number;
}

export function getMap(mapType: MapType, mapParams?: IMapParams): IMap | undefined {
    let map: IMap | undefined = undefined;

    switch (mapType) {
        case 'from-saved':
            //TODO
            break;
        case 'generated':
            if (!mapParams)
                throw new Error("Generated map requires mapParams");
            map = new MapGenerated(mapParams.playerLocation, mapParams.boardWidth, mapParams.boardHeight, mapParams.cellWidth, mapParams.difficulty);
            break;
        case 'custom':
            if (!mapParams)
                throw new Error("Custom map requires mapParams");
            map = new CustomMap({
                width: mapParams.boardWidth,
                height: mapParams.boardHeight,
                cellWidth: mapParams.cellWidth,
                walls: mapParams.walls ?? [],
                player: mapParams.playerLocation ?? 0,
                goal: mapParams.goalLocation ?? 1,
            });
            break;
        case 'simple':
            map = new CustomMap({
                width: 10,
                height: 10,
                cellWidth: 50,
                walls: [],
                player: 44,
                goal: 99,
            });
            break;
        case 'big-simple':
            map = new MapBigSimple();
            break;
        case 'walled-player-box':
            map = new MapWalledPlayerBox();
            break;
        case 'walled-player-uneven-box':
            map = new MapWalledPlayerUnEvenBox();
            break;
    }

    return map;
}