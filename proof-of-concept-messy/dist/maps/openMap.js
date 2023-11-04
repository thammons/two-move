export class MapSimple {
    width = 10;
    height = 10;
    cellWidth = 50;
    walls = [];
    player = 44;
    goal = 99;
}
export class MapBigSimple {
    width = 50;
    height = 50;
    cellWidth = 15;
    walls = [];
    player = (this.height * this.width / 2) + this.width / 2;
    goal = this.height * this.width - 1;
}
export class MapWalledPlayerBox {
    width = 50;
    height = 50;
    cellWidth = 15;
    walls = [];
    player = (this.height * this.width / 2) + this.width / 2;
    goal = this.height * this.width - 1;
    constructor() {
        const radius = 2;
        const wallSectionLength = radius * 2 + 1;
        const wallSection = [...Array(wallSectionLength).keys()];
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
export class MapWalledPlayerUnEvenBox {
    width = 50;
    height = 50;
    cellWidth = 15;
    walls = [];
    player = (this.height * this.width / 2) + this.width / 2;
    goal = this.height * this.width - 1;
    constructor() {
        const radius = 2;
        const wallSectionLength = radius * 2 + 1;
        const wallSection = [...Array(wallSectionLength).keys()];
        const currentRow = this.width * radius;
        let northWalls = wallSection.map(i => this.player - currentRow - radius + i);
        let southWalls = wallSection.map(i => this.player + currentRow - radius + i);
        southWalls.splice(radius, 1);
        let westWalls = wallSection.map(i => this.player - radius - currentRow + (i * this.width));
        let eastWalls = wallSection.map(i => this.player + radius - currentRow + (i * this.width));
        let allWalls = [...northWalls, ...southWalls, ...westWalls, ...eastWalls];
        allWalls.forEach(w => {
            if ((w * this.width) % 2 == 1)
                this.walls.push(w);
        });
    }
}
//# sourceMappingURL=openMap.js.map