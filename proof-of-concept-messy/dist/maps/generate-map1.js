const deletethisHW = 25;
const deletethisCW = 25;
const deletethisDifficulty = .0001;
export default class MapGenerated {
    width;
    height;
    size;
    cellWidth;
    walls;
    player;
    goal;
    constructor(playerLocation, boardWidth = deletethisHW, boardHeight = deletethisHW, cellWidth = deletethisCW, difficulty = .1) {
        this.width = boardWidth;
        this.height = boardHeight;
        this.size = boardWidth * boardHeight;
        this.cellWidth = cellWidth;
        this.walls = this.generateWalls(deletethisDifficulty ?? difficulty);
        this.player = playerLocation ?? 0;
        this.goal = this.generateGoal(this.walls, this.player);
        if (this.player === this.goal) {
            this.player = 0;
            if (this.player === this.goal) {
                this.player = boardWidth * boardHeight - 1;
            }
        }
        if (this.player > boardWidth * boardHeight - 1 || this.player < 0) {
            this.player = Math.floor(Math.random() * 10000 % (boardWidth * boardHeight));
        }
        this.walls = this.cleanupWalls(this.walls, deletethisDifficulty ?? difficulty);
    }
    cleanupWalls = (walls, difficulty) => {
        const newwalls = JSON.parse(JSON.stringify(walls));
        const cleanAttempts = 10;
        let done = false;
        for (let i = 0; i < cleanAttempts && !done; i++) {
            const wallsTouching = this.getWallsTouchingTwoEdges(newwalls).flatMap(w => w.map(wi => wi));
            if (wallsTouching.length > 0) {
                console.log('wallsTouching (removing)', wallsTouching);
                wallsTouching.forEach(w => newwalls.splice(newwalls.indexOf(w), 1));
                newwalls.push(...this.generateWalls(difficulty, wallsTouching.length / 4));
            }
            else {
                console.log('done. wallsTouchingRemaining, i: ', wallsTouching, i);
                done = true;
            }
            if (i === cleanAttempts - 1 && !done) {
                console.log('cleanAttempts reached, but not done, forcing done. wallsTouchingRemaining, i: ', wallsTouching, i);
                done = true;
            }
        }
        return newwalls;
    };
    generateWalls = (difficulty, wallCount) => {
        const floatBetweenZeroAndOne = Math.max(.01, difficulty);
        let walls = [];
        const difficultyScale = 3.6;
        const minValue = this.size / difficultyScale / 2;
        const maxValue = this.size / difficultyScale;
        console.log("size, min, max walls", this.size, minValue, maxValue);
        wallCount = wallCount ?? Math.floor((Math.random() * (maxValue * floatBetweenZeroAndOne - minValue)) + minValue);
        for (let i = 0; i < wallCount; i++) {
            let wallStartLocation = Math.floor(Math.random() * (this.size + 1));
            let wallLocations = this.convertWallGenToMapLocations(wallStartLocation, this.generateWall());
            console.log('wall locations', wallLocations);
            walls = walls.concat(wallLocations);
        }
        return [...new Set(walls)].sort((a, b) => a - b);
    };
    generateAllWallTypes = () => {
        let walls = [];
        let wallStartLocation = 26;
        for (let wallKey of this.wallOptions.keys()) {
            let wall = this.wallOptions.get(wallKey);
            wallStartLocation = Math.max(0, ...walls) + 26;
            let wallLocations = this.convertWallGenToMapLocations(wallStartLocation, wall);
            walls = walls.concat(wallLocations);
        }
        return walls;
    };
    wallOptions = new Map([
        ["o", [[0, 1], [0, 1]]],
        ["s", [[1], [0, 1], [0]]],
        ["s2", [[0, 1], [1, 2]]],
        ["z", [[0], [0, 1], [1]]],
        ["z2", [[1, 2], [0, 1]]],
        ["t", [[0], [0, 1], [0]]],
        ["t2", [[0, 1, 2], [1]]],
        ["t3", [[1], [0, 1], [1]]],
        ["t4", [[1], [0, 1, 2]]],
        ["l", [[0, 1, 2], [2]]],
        ["l1", [[0, 1], [0], [0]]],
        ["l2", [[0], [0, 1, 2]]],
        ["l3", [[1], [1], [0, 1]]],
        ["j", [[2], [0, 1, 2]]],
        ["j2", [[0, 1], [1], [1]]],
        ["j3", [[0, 1, 2], [0]]],
        ["j4", [[0], [0], [0, 1]]],
    ]);
    generateWall = () => {
        const random = Math.floor(Math.random() * (this.wallOptions.size * 10) % this.wallOptions.size);
        const key = Array.from(this.wallOptions.keys())[random];
        const wall = this.wallOptions.get(key) ?? [];
        return wall;
    };
    convertWallGenToMapLocations(start, wallGen) {
        const wallAsMapLocations = wallGen.flatMap((i, index) => i.map(j => start + index + (j * this.width)));
        const cleanedWall = wallAsMapLocations.filter(w => w >= 0 && w < this.size);
        return cleanedWall;
    }
    getWallsTouchingTwoEdges = (walls) => {
        const wallsTouchingTwoEdges = [];
        const topEdge = Array.from(Array(this.width).keys());
        const bottomEdge = Array.from(Array(this.width).keys()).map(i => i + (this.width * (this.height - 1)));
        const leftEdge = Array.from(Array(this.height).keys()).map(i => i * this.width);
        const rightEdge = Array.from(Array(this.height).keys()).map(i => i * this.width + (this.width - 1));
        leftEdge.shift();
        leftEdge.pop();
        rightEdge.shift();
        rightEdge.pop();
        const contiguousWalls = this.getContiguousWalls(walls);
        for (var cw of contiguousWalls) {
            const betweenPlayerAndGoal = cw.some(cwi => cwi > Math.min(this.player, this.goal)
                && cwi < Math.max(this.player, this.goal));
            if (betweenPlayerAndGoal) {
                const cwTop = cw.some(c => topEdge.includes(c));
                const cwBottom = cw.some(c => bottomEdge.includes(c));
                const cwLeft = cw.some(c => leftEdge.includes(c));
                const cwRight = cw.some(c => rightEdge.includes(c));
                if (cwTop && cwBottom) {
                    console.log('top and bottom', cw);
                    wallsTouchingTwoEdges.push(cw);
                    console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
                else if (cwLeft && cwRight) {
                    console.log('left and right', cw);
                    wallsTouchingTwoEdges.push(cw);
                    console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
                else if (cwTop && cwLeft) {
                    console.log('top and left', cw);
                    wallsTouchingTwoEdges.push(cw);
                    console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
                else if (cwTop && cwRight) {
                    console.log('top and right', cw);
                    wallsTouchingTwoEdges.push(cw);
                    console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
                else if (cwBottom && cwLeft) {
                    console.log('bottom and left', cw);
                    wallsTouchingTwoEdges.push(cw);
                    console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
                else if (cwBottom && cwRight) {
                    console.log('bottom and right', cw);
                    wallsTouchingTwoEdges.push(cw);
                    console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
            }
            else {
            }
        }
        return wallsTouchingTwoEdges;
    };
    getContiguousWalls = (walls) => {
        let contiguousWalls = [];
        const neighbors = walls.map(w => this.getNeighbors(walls, w));
        neighbors.forEach(n => {
            const contigLocs = contiguousWalls.map((cw, i) => cw.some(cwi => n.includes(cwi)) ? i : -1).filter(i => i >= 0);
            if (contigLocs.length > 0) {
                const newItem = [...new Set([...contiguousWalls[contigLocs[0]], ...n])];
                contiguousWalls[contigLocs[0]] = newItem;
            }
            else {
                contiguousWalls.push(n);
            }
        });
        let finalContiguousWalls = [];
        for (let cw of contiguousWalls) {
            const contigLocs = finalContiguousWalls.map((fcw, i) => fcw.some(fcwi => cw.includes(fcwi)) ? i : -1).filter(i => i >= 0);
            if (contigLocs.length > 0) {
                const newItem = [...new Set([...finalContiguousWalls[contigLocs[0]], ...cw])];
                finalContiguousWalls[contigLocs[0]] = newItem;
            }
            else {
                finalContiguousWalls.push(cw);
            }
        }
        finalContiguousWalls = finalContiguousWalls.map(cw => [...new Set(cw)].sort((a, b) => a - b)).sort((a, b) => a[0] - b[0]);
        console.log('finalContiguousWalls', finalContiguousWalls);
        return finalContiguousWalls;
    };
    getNeighbors = (walls, wall) => {
        const neighbors = [wall];
        const top = wall - this.width;
        const bottom = wall + this.width;
        const voidleft = wall % this.width === 0;
        const voidright = wall % this.width === this.width - 1;
        const left = voidleft ? -1 : wall - 1;
        const right = voidright ? -1 : wall + 1;
        const topRight = voidright ? -1 : top + 1;
        const topLeft = voidleft ? -1 : top - 1;
        const bottomRight = voidright ? -1 : bottom + 1;
        const bottomLeft = voidleft ? -1 : bottom - 1;
        const allNeighbors = [top, bottom, left, right, topRight, topLeft, bottomRight, bottomLeft]
            .filter(n => n > 0 && n < this.size);
        allNeighbors.forEach(n => {
            if (walls.includes(n)) {
                neighbors.push(n);
            }
        });
        return neighbors;
    };
    generateGoal = (walls, player) => {
        let goalLocation = Math.floor(Math.random() * this.size);
        while (walls.includes(goalLocation) || goalLocation === player) {
            goalLocation = Math.floor(Math.random() * this.size);
        }
        return goalLocation;
    };
}
//# sourceMappingURL=generate-map1.js.map