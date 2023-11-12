import { IMap } from '../types.js';

export class MapBigSimple implements IMap {
    width = 50;
    height = 50;
    cellWidth = 15;
    walls = [
    ];
    player = (this.height * this.width / 2) + this.width / 2;
    goal = this.height * this.width - 1;
}

export class MapWalledPlayerBox implements IMap {
    width = 50;
    height = 50;
    cellWidth = 15;
    walls: number[] = [
    ];
    player = (this.height * this.width / 2) + this.width / 2;
    goal = this.height * this.width - 1;

    constructor() {
        //push walls relative to player.location -5, -5 to 5, 5, skip 0,5

        const radius = 2;
        const wallSectionLength = radius * 2 + 1;
        const wallSection = [...Array(wallSectionLength).keys()]
        const currentRow = this.width * radius;
        const northWalls = wallSection.map(i => this.player - currentRow - radius + i);
        let southWalls = wallSection.map(i => this.player + currentRow - radius + i);
        southWalls.splice(radius, 1);
        const westWalls = wallSection.map(i => this.player - radius - currentRow + (i * this.width));
        const eastWalls = wallSection.map(i => this.player + radius - currentRow + (i * this.width));

        let allWalls = [...northWalls, ...southWalls, ...westWalls, ...eastWalls];
        allWalls.forEach(w => this.walls.push(w));
    }
}

export class MapWalledPlayerUnEvenBox implements IMap {
    width = 50;
    height = 50;
    cellWidth = 15;
    walls: number[] = [
    ];
    player = (this.height * this.width / 2) + this.width / 2;
    goal = this.height * this.width - 1;

    constructor() {
        //push walls relative to player.location -5, -5 to 5, 5, skip 0,5

        const radius = 2;
        const wallSectionLength = radius * 2 + 1;
        const wallSection = [...Array(wallSectionLength).keys()]
        const currentRow = this.width * radius;
        let northWalls = wallSection.map(i => this.player - currentRow - radius + i);
        let southWalls = wallSection.map(i => this.player + currentRow - radius + i);
        //South Exit
        southWalls.splice(radius, 1);
        let westWalls = wallSection.map(i => this.player - radius - currentRow + (i * this.width));
        let eastWalls = wallSection.map(i => this.player + radius - currentRow + (i * this.width));

        let allWalls = [...northWalls, ...southWalls, ...westWalls, ...eastWalls];

        //TODO: offest walls
        // | w     w     w |
        // |    w     w    |
        allWalls.forEach(w => {
            // if (w % 2 == 1) 
            if ((w * this.width) % 2 == 1)
                this.walls.push(w)
        });
    }

}