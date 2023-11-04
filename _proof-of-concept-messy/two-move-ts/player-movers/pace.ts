import { Direction, IBoard, IMap, IMove, IMover, IPlayer, ItemLocation } from "../types.js";



// function pace(player: Player, board: IBoard, steps: ItemLocation[] = [], stepCount: number = 0) {
//     if (//board.isAtGoal(player.location) || 
//         stepCount > 100)
//         return;

//     setTimeout(() => {
//         const lastLocation = PLAYER.getPlayerLocation();
//         steps.push(lastLocation);
//         const isValid = BOARD.move(PLAYER, PLAYER.getPlayerLocation(), PLAYER.getNextMove());
//         if (!isValid) {
//             player.turnRight();
//             BOARD.updatePlayer(PLAYER);
//             player.turnRight();
//             BOARD.updatePlayer(PLAYER);
//         }
//         reRenderBoard(lastLocation, PLAYER.location);
//         pace(player, board, steps, stepCount + 1);
//     }, 500);
// }

export class PaceMover implements IMover {
    directionMap: Map<Direction, Direction> = new Map([
        ['east', 'west'],
        ['west', 'east'],
        ['north', 'south'],
        ['south', 'north']
    ]);
    moves: IMove[] = [];
    previousMove: IMove | undefined = undefined;

    getNextMove(player: IPlayer, board: IBoard): IMove {
        if (this.moves.length > 0) {
            if (!!this.previousMove
                && this.previousMove.desitnationLocation === player.location
                && this.previousMove.direction === player.direction) {
                return this.moves.shift()!;
            }
        }

        this.moves = this.generateMoves(player, board.map, 10);
        return this.moves.shift()!;
    }
    
    generateMoves(player: IPlayer, map: IMap, numberToGenerate: number): IMove[] {
        const moves: IMove[] = [];

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
    };    

    //these are generic 
    //TODO Move to a place where these can be reused. Mover utiltiy class? Mover baseClass?
    //TODO Also Grab StartMover from index

    getNextLocation(currentLocation: ItemLocation, direction: Direction, boardWidth: number) {
        let nextLocation = currentLocation;
        if (direction === 'east') {
            nextLocation = currentLocation + 1;
        } else if (direction === 'west') {
            nextLocation = currentLocation - 1;
        } else if (direction === 'north') {
            nextLocation = currentLocation - boardWidth;
        } else if (direction === 'south') {
            nextLocation = currentLocation + boardWidth;
        }
        return nextLocation;
    }

    getNextDirection(direction: Direction): Direction {
        let nextDirection = direction;
        if (this.directionMap.has(direction)) {
            nextDirection = this.directionMap.get(direction)!;
        }
        return nextDirection;
    }

    getNextValidMove(location: ItemLocation, direction: Direction, map: IMap): IMove {
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

    isValidMove(direction: Direction, startLocation: ItemLocation, desiredLocation: ItemLocation, map: IMap): boolean {

        const moveIsAtEdgeWest = direction == 'west' && startLocation % map.width === 0;
        const moveIsAtEdgeEast = direction == 'east' && startLocation % map.width === map.width - 1;
        const moveIsOffTheBoard = desiredLocation < 0 || desiredLocation > map.width * map.height - 1;
        const moveIsBlocked = () => map.walls.includes(desiredLocation);

        return !(moveIsOffTheBoard || moveIsAtEdgeWest || moveIsAtEdgeEast || moveIsBlocked());

    };
}