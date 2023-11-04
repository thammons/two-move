export class PaceMover {
    directionMap = new Map([
        ['east', 'west'],
        ['west', 'east'],
        ['north', 'south'],
        ['south', 'north']
    ]);
    moves = [];
    previousMove = undefined;
    getNextMove(player, board) {
        if (this.moves.length > 0) {
            if (!!this.previousMove
                && this.previousMove.desitnationLocation === player.location
                && this.previousMove.direction === player.direction) {
                return this.moves.shift();
            }
        }
        this.moves = this.generateMoves(player, board.map, 10);
        return this.moves.shift();
    }
    generateMoves(player, map, numberToGenerate) {
        const moves = [];
        let location = player.location;
        let direction = player.direction;
        Array.from(Array(numberToGenerate).keys()).forEach(() => {
            const move = this.getNextValidMove(location, direction, map);
            location = move.desitnationLocation;
            direction = move.direction;
            moves.push(move);
        });
        const goal = moves.findIndex(m => map.goal === m.desitnationLocation);
        if (goal > -1) {
            moves.splice(goal + 1, moves.length - goal);
        }
        return moves;
    }
    ;
    getNextLocation(currentLocation, direction, boardWidth) {
        let nextLocation = currentLocation;
        if (direction === 'east') {
            nextLocation = currentLocation + 1;
        }
        else if (direction === 'west') {
            nextLocation = currentLocation - 1;
        }
        else if (direction === 'north') {
            nextLocation = currentLocation - boardWidth;
        }
        else if (direction === 'south') {
            nextLocation = currentLocation + boardWidth;
        }
        return nextLocation;
    }
    getNextDirection(direction) {
        let nextDirection = direction;
        if (this.directionMap.has(direction)) {
            nextDirection = this.directionMap.get(direction);
        }
        return nextDirection;
    }
    getNextValidMove(location, direction, map) {
        let nextMove = this.getNextLocation(location, direction, map.width);
        let nextDirection = direction;
        if (!this.isValidMove(nextDirection, location, nextMove, map)) {
            nextDirection = this.getNextDirection(direction);
            nextMove = location;
        }
        const nextIMove = {
            direction: nextDirection,
            startLocation: location,
            desitnationLocation: nextMove,
            isMove: nextMove !== location
        };
        return nextIMove;
    }
    isValidMove(direction, startLocation, desiredLocation, map) {
        const moveIsAtEdgeWest = direction == 'west' && startLocation % map.width === 0;
        const moveIsAtEdgeEast = direction == 'east' && startLocation % map.width === map.width - 1;
        const moveIsOffTheBoard = desiredLocation < 0 || desiredLocation > map.width * map.height - 1;
        const moveIsBlocked = () => map.walls.includes(desiredLocation);
        return !(moveIsOffTheBoard || moveIsAtEdgeWest || moveIsAtEdgeEast || moveIsBlocked());
    }
    ;
}
//# sourceMappingURL=pace.js.map