import { IMap, ItemLocation } from "../types";
import MapGenerated from "./generate-map1";
import { MapBigSimple, MapSimple, MapWalledPlayerBox, MapWalledPlayerUnEvenBox } from "./simple-maps";

export type MapType = 'from-saved' | 'generated' | 'simple' | 'big-simple' | 'walled-player-box' | 'walled-player-uneven-box';

export interface IMapParams {
    boardWidth: number;
    boardHeight: number;
    cellWidth: number;
    playerLocation?: ItemLocation;
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
        case 'simple':
            map = new MapSimple();
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