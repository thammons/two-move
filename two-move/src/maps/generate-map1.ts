import { IMap, ItemLocation } from '../types.js';

//delete this
const deletethisHW = 10;
const deletethisCW = 50;
const deletethisDifficulty = .0001;

export default class MapGenerated implements IMap {
    width: number;
    height: number;
    size: number;
    cellWidth: number;
    walls: ItemLocation[];
    player: ItemLocation;
    goal: ItemLocation;

    //difficulty should be a float between 0 and 1

    constructor(playerLocation?: ItemLocation, boardWidth = deletethisHW, boardHeight = deletethisHW, cellWidth = deletethisCW, difficulty = .1) {
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

        //if player is out of bounds, replace him on the board
        if (this.player > boardWidth * boardHeight - 1 || this.player < 0) {
            this.player = Math.floor(Math.random() * 10_000 % (boardWidth * boardHeight));
        }

        this.walls = this.cleanupWalls(this.walls, deletethisDifficulty ?? difficulty);
    }

    cleanupWalls = (walls: ItemLocation[], difficulty: number): ItemLocation[] => {
        const newwalls = JSON.parse(JSON.stringify(walls));
        const cleanAttempts = 10;
        let done = false;
        for (let i = 0; i < cleanAttempts && !done; i++) {

            //if walls span from one wall to another, remove them
            //TODO count the squares removed
            // generateWalls = squresRemoved / 4
            // loop until wallcount to remove is < 2?

            const wallsTouching = this.getWallsTouchingTwoEdges(newwalls).flatMap(w => w.map(wi => wi));
            if (wallsTouching.length > 0) {
                // console.log('wallsTouching (removing)', wallsTouching);
                wallsTouching.forEach(w => newwalls.splice(newwalls.indexOf(w), 1));
                newwalls.push(...this.generateWalls(difficulty, wallsTouching.length / 4));
            }
            else {
                // console.log('done. wallsTouchingRemaining, i: ', wallsTouching, i)
                done = true;
            }

            if(i === cleanAttempts - 1 && !done) {
                // console.log('cleanAttempts reached, but not done, forcing done. wallsTouchingRemaining, i: ', wallsTouching, i)
                done = true;
            }
        }
        return newwalls;
    }

    generateWalls = (difficulty: number, wallCount?: number): ItemLocation[] => {

        //default to super easy
        const floatBetweenZeroAndOne = Math.max(.01, difficulty);

        let walls: ItemLocation[] = [];

        //todo: something with difficulty
        //todo: make sure goal is walkable

        //With 
        //Math.floor(Math.random() * (max - min +1)) + min 
        //you have a perfectly even distribution.
        //Math.floor(Math.random() * 10) + 1 will give you a random number from 1 to 10.

        //TODO: Difficulty needs work

        const difficultyScale = 3.6; //finetune this
        const minValue = this.size / difficultyScale / 2;
        const maxValue = this.size / difficultyScale;
        // console.log("size, min, max walls", this.size, minValue, maxValue)
        wallCount = wallCount ?? Math.floor((Math.random() * (maxValue * floatBetweenZeroAndOne - minValue)) + minValue);
        // wallCount = wallCount ?? Math.floor((Math.random() * (maxValue * floatBetweenZeroAndOne)) + 1);
        // console.log('wallCount', wallCount)
        for (let i = 0; i < wallCount; i++) {
            let wallStartLocation = Math.floor(Math.random() * (this.size + 1));
            let wallLocations = this.convertWallGenToMapLocations(wallStartLocation, this.generateWall());
            // console.log('wall locations', wallLocations);
            walls = walls.concat(wallLocations);
        }
        // return this.generateAllWalls();
        return [...new Set(walls)].sort((a, b) => a - b);
    };

    generateAllWallTypes = (): ItemLocation[] => {
        let walls: ItemLocation[] = [];

        let wallStartLocation = 26;
        for (let wallKey of this.wallOptions.keys()) {
            let wall = this.wallOptions.get(wallKey);
            wallStartLocation = Math.max(0, ...walls) + 26;
            // console.log(wallStartLocation);
            let wallLocations = this.convertWallGenToMapLocations(wallStartLocation, wall!);
            // console.log(wallLocations);
            walls = walls.concat(wallLocations);
        }
        return walls;
    };

    wallOptions: Map<string, ItemLocation[][]> = new Map([
        /*
            Tetris Peices 
            o is a square:
                [ ][ ]
                [ ][ ]
            s is
                [ ][ ]
                    [ ][ ]
            z is
                    [ ][ ]
                [ ][ ]
            T is
                [ ][ ][ ]
                   [ ]
            L is
                [ ]
                [ ]
                [ ][ ]
        */
        ["o", [[0, 1], [0, 1]]],
        // ["i", [[0], [0], [0], [0]]],
        // ["i3", [[0, 1, 2, 3]]],
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

    generateWall = (): ItemLocation[][] => {
        const random = Math.floor(Math.random() * (this.wallOptions.size * 10) % this.wallOptions.size);
        const key = Array.from(this.wallOptions.keys())[random];
        const wall = this.wallOptions.get(key) ?? [];
        return wall;
    }

    convertWallGenToMapLocations(start: number, wallGen: ItemLocation[][]): ItemLocation[] {
        const wallAsMapLocations = wallGen.flatMap((i, index) => i.map(j => start + index + (j * this.width) as ItemLocation));
        const cleanedWall = wallAsMapLocations.filter(w => w >= 0 && w < this.size);
        return cleanedWall;
    }

    getWallsTouchingTwoEdges = (walls: ItemLocation[]): ItemLocation[][] => {
        const wallsTouchingTwoEdges: ItemLocation[][] = [];

        const topEdge = Array.from(Array(this.width).keys());
        const bottomEdge = Array.from(Array(this.width).keys()).map(i => i + (this.width * (this.height - 1)));
        const leftEdge = Array.from(Array(this.height).keys()).map(i => i * this.width);
        const rightEdge = Array.from(Array(this.height).keys()).map(i => i * this.width + (this.width - 1));

        //remove first and last item, already handled by top and bottom row
        leftEdge.shift();
        leftEdge.pop();
        rightEdge.shift();
        rightEdge.pop();

        // console.log('edges', topEdge, bottomEdge, leftEdge, rightEdge)

        const contiguousWalls = this.getContiguousWalls(walls);

        for (var cw of contiguousWalls) {

            const betweenPlayerAndGoal =
                cw.some(cwi => cwi > Math.min(this.player, this.goal)
                    && cwi < Math.max(this.player, this.goal));

            // console.log('betweenPlayerAndGoal', betweenPlayerAndGoal, Math.min(this.player, this.goal), Math.max(this.player, this.goal), cw)

            if (betweenPlayerAndGoal) {

                const cwTop = cw.some(c => topEdge.includes(c));
                const cwBottom = cw.some(c => bottomEdge.includes(c));
                const cwLeft = cw.some(c => leftEdge.includes(c));
                const cwRight = cw.some(c => rightEdge.includes(c));

                // console.log('top, bottom, left, right', cwTop, cwBottom, cwLeft, cwRight);

                if (cwTop && cwBottom) {
                    // console.log('top and bottom', cw);
                    wallsTouchingTwoEdges.push(cw);
                    // console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
                else if (cwLeft && cwRight) {
                    // console.log('left and right', cw);
                    wallsTouchingTwoEdges.push(cw);
                    // console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
                else if (cwTop && cwLeft) {
                    // console.log('top and left', cw);
                    wallsTouchingTwoEdges.push(cw);
                    // console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
                else if (cwTop && cwRight) {
                    // console.log('top and right', cw);
                    wallsTouchingTwoEdges.push(cw);
                    // console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
                else if (cwBottom && cwLeft) {
                    // console.log('bottom and left', cw);
                    wallsTouchingTwoEdges.push(cw);
                    // console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
                else if (cwBottom && cwRight) {
                    // console.log('bottom and right', cw);
                    wallsTouchingTwoEdges.push(cw);
                    // console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
                }
            }
            else {
                // console.log('not between start and end', cw);
            }

        }

        // console.log('wallsTouchingTwoEdges', wallsTouchingTwoEdges);
        return wallsTouchingTwoEdges;
    }

    getContiguousWalls = (walls: ItemLocation[]): ItemLocation[][] => {
        let contiguousWalls: ItemLocation[][] = [];
        //for each item in walls
        //  if any of the neighbors are in walls, get their neighbors (recurse)
        //  return the list of neighbors

        const neighbors = walls.map(w => this.getNeighbors(walls, w));
        neighbors.forEach(n => {
            const contigLocs = contiguousWalls.map((cw, i) => cw.some(cwi => n.includes(cwi)) ? i : -1).filter(i => i >= 0);
            if (contigLocs.length > 0) {
                const newItem = [...new Set([...contiguousWalls[contigLocs[0]], ...n])] as ItemLocation[];
                contiguousWalls[contigLocs[0]] = newItem;
            } else {
                contiguousWalls.push(n);
            }
        });

        // console.log('contiguousWalls', contiguousWalls)

        //second pass to condense, sometimes the items are not in the array yet, this should give a better chance of condensing everything
        let finalContiguousWalls: ItemLocation[][] = [];
        for (let cw of contiguousWalls) {
            const contigLocs = finalContiguousWalls.map((fcw, i) => fcw.some(fcwi => cw.includes(fcwi)) ? i : -1).filter(i => i >= 0);
            if (contigLocs.length > 0) {
                const newItem = [...new Set([...finalContiguousWalls[contigLocs[0]], ...cw])] as ItemLocation[];
                finalContiguousWalls[contigLocs[0]] = newItem;
            } else {
                finalContiguousWalls.push(cw);
            }
        }

        //remove dupes and sort
        finalContiguousWalls = finalContiguousWalls.map(cw => ([...new Set(cw)] as number[]).sort((a, b) => a - b)).sort((a, b) => a[0] - b[0]);

        // console.log('finalContiguousWalls', finalContiguousWalls)
        return finalContiguousWalls;
    }

    getNeighbors = (walls: ItemLocation[], wall: ItemLocation): ItemLocation[] => {
        const neighbors: ItemLocation[] = [wall];
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
        // console.log('neighbors', neighbors);
        return neighbors;
    }

    generateGoal = (walls: ItemLocation[], player: ItemLocation): ItemLocation => {
        //TODO: Move goal based on player and difficulty (lower difficulty means closer to player)

        let goalLocation = Math.floor(Math.random() * this.size);
        while (walls.includes(goalLocation) || goalLocation === player) {
            goalLocation = Math.floor(Math.random() * this.size);
        }
        return goalLocation as ItemLocation;
    }
}