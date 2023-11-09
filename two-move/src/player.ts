import { Direction, ItemLocation, IPlayer, CellType, PlayerIndicator } from './types.js';


interface IDirectionDependencies {
    indicator: PlayerIndicator;
    nextDirection: Direction;
    nextMove: (playerLocation: ItemLocation, mapWidth: number) => ItemLocation;
}

const directionDependencies: Record<Direction, IDirectionDependencies> = {
    'east': {
        indicator: '>', nextDirection: 'south',
        nextMove: (playerLocation: ItemLocation, mapWidth: number) => playerLocation + 1
    },
    'west': {
        indicator: '<', nextDirection: 'north',
        nextMove: (playerLocation: ItemLocation, mapWidth: number) => playerLocation - 1
    },
    'north': {
        indicator: '^', nextDirection: 'east',
        nextMove: (playerLocation: ItemLocation, mapWidth: number) => playerLocation - mapWidth
    },
    'south': {
        indicator: 'v', nextDirection: 'west',
        nextMove: (playerLocation: ItemLocation, mapWidth: number) => playerLocation + mapWidth
    }
};

class Player implements IPlayer {
    cellType: CellType = 'player';
    direction: Direction;
    indicator: PlayerIndicator;
    location: ItemLocation = 0;
    boardWidth: number;

    constructor(startLocation: ItemLocation, boardWidth: number, direction?: Direction) {
        this.location = startLocation;
        this.boardWidth = boardWidth;
        this.direction = direction || 'east';
        this.indicator = this._getIndicator(this.direction);
    }

    getPlayerLocation(): ItemLocation {
        return this.location;
    }

    getNextDirection(): Direction {
        return directionDependencies[this.direction].nextDirection;
    }

    turnRight() {
        const nextDirection = directionDependencies[this.direction].nextDirection;
        this.direction = nextDirection;
        this.indicator = directionDependencies[nextDirection].indicator;
    }

    getIndicator(): PlayerIndicator {
        return this._getIndicator(this.direction);
    }

    private _getIndicator(direction: Direction): PlayerIndicator {
        return directionDependencies[direction].indicator;
    }

    setNextLocation(): void {
        const nextMove = this.getNextMove();
        this.location = nextMove;
    }

    getNextMove(): ItemLocation {
        const playerIndex = this.getPlayerLocation();
        return directionDependencies[this.direction].nextMove(playerIndex, this.boardWidth);
    }
}
export default Player;