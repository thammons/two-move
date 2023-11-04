import { IMap } from '../types.js';
export interface ISavedMap {
    map: IMap;
    level: number;
}
export declare function saveMap(map: IMap): boolean;
export declare function getNextMap(mapId: number): ISavedMap | undefined;
//# sourceMappingURL=save-map.d.ts.map