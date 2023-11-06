import { Direction, ItemLocation, IPlayer, CellType, PlayerIndicator } from './types.js';

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

    turnRight() {
        // const playerIndex = this.getPlayerLocation();

        switch (this.direction) {
            case 'east':
                this.direction = 'south';
                this.indicator = 'v';
                break;
            case 'south':
                this.direction = 'west';
                this.indicator = '<';
                break;
            case 'west':
                this.direction = 'north';
                this.indicator = '^';
                break;
            case 'north':
                this.direction = 'east';
                this.indicator = '>';
                break;
        }
    }

    getIndicator(): PlayerIndicator {
        return this._getIndicator(this.direction);
    }
    _getIndicator(direction: Direction): PlayerIndicator {
        switch (direction) {
            case 'east':
                return '>';
            case 'west':
                return '<';
            case 'north':
                return '^';
            case 'south':
                return 'v';
        }
    }

    setNextLocation(): void {
        const nextMove = this.getNextMove();
        this.location = nextMove;
    }

    getNextMove(): ItemLocation {
        const playerIndex = this.getPlayerLocation();
        let nextMove = playerIndex;

        switch (this.direction) {
            case 'east':
                nextMove = this._getEast(playerIndex);
                break;
            case 'west':
                nextMove = this._getWest(playerIndex);
                break;
            case 'north':
                nextMove = this._getNorth(playerIndex);
                break;
            case 'south':
                nextMove = this._getSouth(playerIndex);
                break;
        }

        return nextMove;
    }


    _getEast(playerIndex: ItemLocation): ItemLocation { return playerIndex + 1; }

    _getWest(playerIndex: ItemLocation): ItemLocation { return playerIndex - 1; }

    _getNorth(playerIndex: ItemLocation): ItemLocation { return playerIndex - this.boardWidth; }

    _getSouth(playerIndex: ItemLocation): ItemLocation { return playerIndex + this.boardWidth; }


}
export default Player;