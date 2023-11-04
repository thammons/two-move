import { IMap, ItemLocation } from '../types.js';
export default class MapGenerated implements IMap {
    width: number;
    height: number;
    size: number;
    cellWidth: number;
    walls: ItemLocation[];
    player: ItemLocation;
    goal: ItemLocation;
    constructor(playerLocation?: ItemLocation, boardWidth?: number, boardHeight?: number, cellWidth?: number, difficulty?: number);
    cleanupWalls: (walls: ItemLocation[], difficulty: number) => ItemLocation[];
    generateWalls: (difficulty: number, wallCount?: number) => ItemLocation[];
    generateAllWallTypes: () => ItemLocation[];
    wallOptions: Map<string, ItemLocation[][]>;
    generateWall: () => ItemLocation[][];
    convertWallGenToMapLocations(start: number, wallGen: ItemLocation[][]): ItemLocation[];
    getWallsTouchingTwoEdges: (walls: ItemLocation[]) => ItemLocation[][];
    getContiguousWalls: (walls: ItemLocation[]) => ItemLocation[][];
    getNeighbors: (walls: ItemLocation[], wall: ItemLocation) => ItemLocation[];
    generateGoal: (walls: ItemLocation[], player: ItemLocation) => ItemLocation;
}
//# sourceMappingURL=generate-map1.d.ts.map