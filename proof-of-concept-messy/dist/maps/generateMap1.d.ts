import { IMap, ItemLocation } from '../types.js';
export default class MapGenerated implements IMap {
    width: number;
    height: number;
    cellWidth: number;
    walls: ItemLocation[];
    player: ItemLocation;
    goal: ItemLocation;
    constructor(playerLocation?: ItemLocation, boardWidth?: number, boardHeight?: number, cellWidth?: number, difficulty?: number);
    generateWalls: (difficulty: number) => ItemLocation[];
    generateGoal: (walls: ItemLocation[]) => ItemLocation;
}
//# sourceMappingURL=generateMap1.d.ts.map