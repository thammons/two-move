import { IMap, ItemLocation } from '../types.js';

export class CustomMap implements IMap {
    width = 10;
    height = 10;
    cellWidth = 50;
    walls: ItemLocation[] = [
    ];
    player = 44;
    // player = 40;
    goal = 99;

    constructor(map: IMap) {
        this.width = map.width;
        this.height = map.height;
        this.cellWidth = map.cellWidth;
        this.walls = map.walls;
        this.player = map.player;
        this.goal = map.goal;
    }
}