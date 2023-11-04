export default class MapGenerated {
    width;
    height;
    cellWidth;
    walls;
    player;
    goal;
    constructor(playerLocation, boardWidth = 25, boardHeight = 25, cellWidth = 25, difficulty = 1) {
        this.width = boardWidth;
        this.height = boardHeight;
        this.cellWidth = cellWidth;
        this.walls = this.generateWalls(difficulty);
        this.goal = this.generateGoal(this.walls);
        this.player = playerLocation ?? 0;
    }
    generateWalls = (difficulty) => {
        const walls = [];
        const size = this.width * this.width;
        const wallCount = Math.floor(Math.random() * (size) / 2) + (size / 4);
        for (let i = 0; i < wallCount; i++) {
            const wallLocation = Math.floor(Math.random() * size);
            walls.push(wallLocation);
        }
        return walls;
    };
    generateGoal = (walls) => {
        const size = this.width * this.width;
        let goalLocation = Math.floor(Math.random() * size);
        while (walls.includes(goalLocation)) {
            goalLocation = Math.floor(Math.random() * size);
        }
        return goalLocation;
    };
}
//# sourceMappingURL=map2.js.map