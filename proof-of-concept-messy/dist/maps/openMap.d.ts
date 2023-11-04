import { IMap } from '../types.js';
export declare class MapSimple implements IMap {
    width: number;
    height: number;
    cellWidth: number;
    walls: never[];
    player: number;
    goal: number;
}
export declare class MapBigSimple implements IMap {
    width: number;
    height: number;
    cellWidth: number;
    walls: never[];
    player: number;
    goal: number;
}
export declare class MapWalledPlayerBox implements IMap {
    width: number;
    height: number;
    cellWidth: number;
    walls: number[];
    player: number;
    goal: number;
    constructor();
}
export declare class MapWalledPlayerUnEvenBox implements IMap {
    width: number;
    height: number;
    cellWidth: number;
    walls: number[];
    player: number;
    goal: number;
    constructor();
}
//# sourceMappingURL=openMap.d.ts.map