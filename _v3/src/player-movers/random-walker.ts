import { Direction, IBoard, IMap, IMove, IMover, IPlayer, ItemLocation } from "../types";
import * as utils from './mover-utils';








//TODO: update to use board/move instead of utils









export class RandomWalkerMover implements IMover {
    directionMap: Map<Direction, Direction> = new Map([
        ['east', 'south'],
        ['south', 'west'],
        ['west', 'north'],
        ['north', 'east']
    ]);
    moves: IMove[] = [];
    speed:number;

    constructor(speed:number) {
        this.speed = speed;
    }

    clear(){
        this.moves = [];
    }

    getNextMove(player: IPlayer, board: IBoard): IMove {
        if (this.moves.length === 0)
            this.moves = this.randomWalker(player, board);

        return this.moves.shift()!;
    }

    randomTurns(currentDirection: Direction, location: ItemLocation): IMove[] {
        let moves: IMove[] = [];
        const randomTurns = Math.floor(Math.random() * 10 % 6);
        // console.log('randomTurns', randomTurns);
        let lastDirection = currentDirection;
        for (let i = 0; i < randomTurns; i++) {
            const nextDirection = utils.getNextDirection(lastDirection, this.directionMap);
            moves.push(utils.createMove(nextDirection, location));
            lastDirection = nextDirection;
        }
        return moves;
    }

    randomSteps(startLocation: ItemLocation, direction: Direction, map: IMap) {
        let moves: IMove[] = [];
        const randomSteps = Math.floor(Math.random() * 100 % (map.width / 2)) + 1;
        // console.log('randomSteps', randomSteps);
        let lastLocation = startLocation;
        for (let i = 0; i < randomSteps; i++) {
            const nextLocation = utils.getNextLocation(lastLocation, direction, map.width);
            if (utils.isValidMove(direction, lastLocation, nextLocation, map)) {
                moves.push(utils.createMove(direction, lastLocation, nextLocation));
            }
        }
        return moves;
    }

    getDistanceToGoal(location: ItemLocation, map: IMap) {
        const goalLocation = map.goal;
        const goalHoriz = goalLocation % map.width;
        const goalVert = Math.floor(goalLocation / map.width);
        const playerHoriz = location % map.width;
        const playerVert = Math.floor(location / map.width);

        let movesHoriz = 0;
        let horizDirection: Direction | undefined = undefined;
        if (goalHoriz > playerHoriz) {
            horizDirection = 'east';
            movesHoriz = goalHoriz - playerHoriz;
        }
        else if (goalHoriz < playerHoriz) {
            horizDirection = 'west';
            movesHoriz = playerHoriz - goalHoriz;
        }

        let movesVert = 0;
        let vertDirection: Direction | undefined = undefined;
        if (goalVert > playerVert) {
            vertDirection = 'south';
            movesVert = goalVert - playerVert;
        }
        else if (goalVert < playerVert) {
            vertDirection = 'north';
            movesVert = playerVert - goalVert;
        }

        return {
            horizontal: { moves: movesHoriz, direction: horizDirection as Direction | undefined },
            vertical: { moves: movesVert, direction: vertDirection as Direction | undefined }
        };
    };

    turnToGoal(location: ItemLocation, map: IMap) {
        const distanceToGoal = this.getDistanceToGoal(location, map);

        let move = distanceToGoal.vertical;

        if (distanceToGoal.horizontal.moves > distanceToGoal.vertical.moves || distanceToGoal.horizontal.direction === undefined) {
            move = distanceToGoal.horizontal;
        }

        const direction = move.direction ?? 'east';
        return utils.createMove(direction, location);
    };

    getSquaresToGoal(startLocation: ItemLocation, startDirection: Direction, map: IMap, isSecondCall: boolean = false): IMove[] {
        if (startDirection === undefined)
            return [];

        const distanceToGoal = this.getDistanceToGoal(startLocation, map);

        let moves: IMove[] = [];

        let direction = startDirection;
        let nextDirection: Direction | undefined = startDirection;
        let movesToGoal = 0;

        if (startDirection !== distanceToGoal.horizontal.direction) {
            movesToGoal = distanceToGoal.horizontal.moves;
            nextDirection = distanceToGoal.vertical.direction;
        }
        else if (startDirection !== distanceToGoal.vertical.direction) {
            movesToGoal = distanceToGoal.vertical.moves;
            nextDirection = distanceToGoal.horizontal.direction;
        }
        else {
            direction = this.turnToGoal(startLocation, map).direction;
            if (['north', 'south'].includes(direction)) {
                movesToGoal = distanceToGoal.vertical.moves;
                nextDirection = distanceToGoal.horizontal.direction;
            }
            else {
                movesToGoal = distanceToGoal.horizontal.moves;
                nextDirection = distanceToGoal.vertical.direction;
            }
        }

        if (startDirection != direction) {
            moves.push(utils.createMove(direction, startLocation));
        }

        let location = startLocation;
        for (let i = 0; i < movesToGoal; i++) {
            const nextLocation = utils.getNextLocation(location, direction, map.width);
            moves.push(utils.createMove(direction, location, nextLocation));
        }

        if (!!nextDirection && !isSecondCall) {
            moves.push(...this.getSquaresToGoal(location, nextDirection!, map, true));
        }

        return moves;
    }

    randomWalker(player: IPlayer, board: IBoard): IMove[] {
        let location = player.getPlayerLocation();
        let direction = player.direction;

        if (this.moves.length > 0) {
            const lastMove = this.moves[this.moves.length - 1];
            location = lastMove.destinationLocation;
            direction = lastMove.direction;
        }

        let moves = this.randomSteps(location, direction, board.map);
        if (moves.length > 0) {
            const lastMove = moves[moves.length - 1];
            location = lastMove.destinationLocation;
            direction = lastMove.direction;
        }

        moves.push(...this.randomTurns(direction, location));
        if (moves.length > 0) {
            const lastMove = moves[moves.length - 1];
            location = lastMove.destinationLocation;
            direction = lastMove.direction;
        }

        /* STEP TOWARD GOAL WITH A BIT OF RANDOM */
        const movesToGoal = this.getSquaresToGoal(location, direction, board.map);
        if (movesToGoal.length > 0) {
            //Take 1/4 of the steps toward the goal
            movesToGoal.slice(0, Math.floor(movesToGoal.length / 4) + 1).forEach(m => {
                const isValidGoalStep = utils.isValidMove(m.direction, m.startLocation, m.destinationLocation, board.map);
                if (isValidGoalStep)
                    moves.push(m);
                else
                    moves.push(...this.randomTurns(direction, location));
            });
        }

        if (moves.length === 0) {
            return this.randomWalker(player, board);
        }

        return moves;
    }


}