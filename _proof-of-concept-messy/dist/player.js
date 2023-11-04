class Player {
    cellType = 'player';
    direction;
    indicator;
    location = 0;
    boardWidth;
    constructor(startLocation, boardWidth, direction) {
        this.location = startLocation;
        this.boardWidth = boardWidth;
        this.direction = direction || 'east';
        this.indicator = this.getIndicator(this.direction);
    }
    getPlayerLocation() {
        return this.location;
    }
    turnRight() {
        const playerIndex = this.getPlayerLocation();
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
    getIndicator(direction) {
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
    setNextLocation() {
        const nextMove = this.getNextMove();
        this.location = nextMove;
    }
    getNextMove() {
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
    _getEast(playerIndex) { return playerIndex + 1; }
    _getWest(playerIndex) { return playerIndex - 1; }
    _getNorth(playerIndex) { return playerIndex - this.boardWidth; }
    _getSouth(playerIndex) { return playerIndex + this.boardWidth; }
}
export default Player;
//# sourceMappingURL=player.js.map