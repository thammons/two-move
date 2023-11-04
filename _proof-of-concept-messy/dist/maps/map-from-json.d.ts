import { IMap } from "../types.js";
export interface NullableIMapObject {
    defaultSettings?: NullableIMap;
    maps?: NullableIMap[];
}
export interface NullableIMap {
    width?: number;
    height?: number;
    cellWidth?: number;
    player?: number;
    goal?: number;
    walls?: number[];
}
export declare class MapFromJson {
    maps: IMap[];
    currentIndex: number;
    constructor(mapsObj: NullableIMapObject);
    static _validateSettings(map: NullableIMap): IMap;
    static _getSettings(map: NullableIMap, defaultSettings?: NullableIMap): NullableIMap;
    getNext(): IMap | undefined;
    get(index: number): IMap;
}
//# sourceMappingURL=map-from-json.d.ts.map