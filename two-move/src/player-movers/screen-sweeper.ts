import { Direction, IBoard, IMap, IMove, IMover, IPlayer, ItemLocation } from "../types";


export class ScreenSweeperMover implements IMover {
    directionMap: Map<Direction, Direction> = new Map([
        ['east', 'south'],
        ['south', 'west'],
        ['west', 'north'],
        ['north', 'east']
    ]);
    moves: IMove[] = [];
    steps: ItemLocation[] = [];
    stepCount: number = 0;
    stepLimit: number = 100;
    direction: Direction = 'east';

    getNextMove(player: IPlayer, board: IBoard): IMove {
        if(this.moves.length === 0)
            this.moves = this.getNextMoves(player, board);

        return this.moves.shift()!;
    }

    getNextMoves(player: IPlayer, board: IBoard): IMove[] {
        if (board.isAtGoal(player.location) || this.stepCount > this.stepLimit)
            throw new Error('ScreenSweeperMover: Reached goal or step limit');

        const moves: IMove[] = [];

        this.direction = player.direction;
        let location = player.location;
        let desiredLocation = player.location;

        if(this.moves.length > 0){
            const lastMove = this.moves[this.moves.length - 1];
            this.direction = lastMove.direction;
            location = lastMove.desitnationLocation;
            desiredLocation = lastMove.desitnationLocation;
        }

        let lastLocation = player.getPlayerLocation();
        this.steps.push(lastLocation);

        const isValid = board.isValidMove(player.getPlayerLocation(), player.getNextMove());
        if (!isValid) {

            if (this.isMaxWest(this.direction, location, board.map)) {
                moves.push(...this.turn(3, location));
            }
            else if (this.isMaxEast(this.direction, location, board.map)) {
                moves.push(...this.turn(1, location));
            }
        }

        let isValidMove = true;
        while (isValidMove) {
            location = desiredLocation;
            desiredLocation = this.getNextLocation(location, this.direction, board.map.width);
            isValidMove = this.isValidMove(this.direction, location, desiredLocation, board.map);

            if (isValidMove) {
                moves.push(this.createMove(this.direction, location, desiredLocation));
            }
        }

        if (this.isMaxWest(this.direction, location, board.map)) {
            moves.push(...this.turn(3, location));
        }
        else if (this.isMaxEast(this.direction, location, board.map)) {
            moves.push(...this.turn(1, location));
        }


        moves.forEach(m => {
            if (m.isMove) {
                this.stepCount++;
                this.steps.push(m.desitnationLocation);
            }
        });

        return moves;
    }

    turn(count: number, location: ItemLocation): IMove[] {
        let moves: IMove[] = [];

        const keys = [...this.directionMap.keys()];
        const index = keys.indexOf(this.direction);

        for (let i = 0; i < count; i++) {
            const newIndex = (index + count) % 4;
            const newDirection = keys[newIndex];
            moves.push(this.createMove(newDirection, location));
            this.direction = newDirection;
        }

        return moves;
    }


    //these are generic 
    //TODO Move to a place where these can be reused. Mover utiltiy class? Mover baseClass?
    //TODO Also Grab StartMover from index

    createMove(direction: Direction, startLocation: ItemLocation, desitnationLocation?: ItemLocation): IMove {
        return {
            direction: direction,
            startLocation: startLocation,
            desitnationLocation: desitnationLocation ?? startLocation,
            isMove: startLocation != (desitnationLocation ?? startLocation)
        };
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

    getNextDirection(direction: Direction): Direction {
        let nextDirection = direction;
        if (this.directionMap.has(direction)) {
            nextDirection = this.directionMap.get(direction)!;
        }
        return nextDirection;
    }

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

    isValidMove(direction: Direction, startLocation: ItemLocation, desiredLocation: ItemLocation, map: IMap): boolean {
        const moveIsAtEdgeWest = this.isMaxWest(direction, startLocation, map);
        const moveIsAtEdgeEast = this.isMaxEast(direction, startLocation, map);
        const moveIsOffTheBoard = desiredLocation < 0 || desiredLocation > map.width * map.height - 1;
        const moveIsBlocked = () => map.walls.includes(desiredLocation);

        return !(moveIsOffTheBoard || moveIsAtEdgeWest || moveIsAtEdgeEast || moveIsBlocked());

    };

    isMaxWest(direction: Direction, location: ItemLocation, map: IMap): boolean {
        return direction === 'west' && location % map.width === 0;
    }

    isMaxEast(direction: Direction, location: ItemLocation, map: IMap): boolean {
        return direction === 'east' && location % map.width === map.width - 1;
    }
}