import { BoardValidation } from "./board-logic/validation.js";
import * as utils from "./ui-utils-html.js";
class Board {
    width = 10;
    height = 10;
    cellWidth = 50;
    size = this.width * this.width;
    map;
    _board = [];
    _hooks;
    constructor(map, hooks) {
        this.width = map.width;
        this.height = map.height;
        this.cellWidth = map.cellWidth;
        this.size = this.width * this.width;
        this.map = map;
        this._hooks = hooks;
    }
    getCells() {
        return this._board;
    }
    getCell(position) {
        return this._board[position];
    }
    setCells(cells) {
        this._board = cells;
    }
    setCell(position, cell) {
        this._board[position] = cell;
    }
    getItemLocations(itemType) {
        const mappedItems = this._board.flatMap(c => c.mapItems).filter(c => c.cellType === itemType);
        return mappedItems.map(m => m.location);
    }
    getDirection = (startLocation, desiredLocation) => {
        if (desiredLocation === startLocation) {
            return 'east';
        }
        else if (desiredLocation === startLocation + 1) {
            return 'east';
        }
        else if (desiredLocation === startLocation - 1) {
            return 'west';
        }
        else if (desiredLocation === startLocation - this.width) {
            return 'north';
        }
        else if (desiredLocation === startLocation + this.width) {
            return 'south';
        }
        console.error('Invalid direction', startLocation, desiredLocation);
        throw new Error('Invalid direction');
    };
    isValidMove(startLocation, desiredLocation) {
        let isValidMove = true;
        let direction = undefined;
        if (startLocation === desiredLocation) {
            isValidMove = true;
            return isValidMove;
        }
        direction = this.getDirection(startLocation, desiredLocation);
        if (desiredLocation < 0 || desiredLocation > this.size - 1) {
            isValidMove = false;
        }
        else if (BoardValidation.isBlocked(startLocation, desiredLocation, this)) {
            isValidMove = false;
        }
        else {
            if (!BoardValidation.isNextMoveOnMap(startLocation, direction, this.width, this.height)) {
                isValidMove = false;
            }
        }
        if (!isValidMove) {
            this.indicateInvalidMove(startLocation, direction);
            const player = this._board[startLocation].mapItems.find(mi => mi.cellType == 'player');
            this._hooks.invalidStep(player, this._board[desiredLocation], direction);
        }
        return isValidMove;
    }
    indicateInvalidMove(position, direction) {
        const invalidClassName = `error-${direction}`;
        this._board[position].classes.push(invalidClassName);
        utils.paintBoard(this);
        setTimeout(() => {
            this._board[position].classes =
                this._board[position].classes.filter(c => c !== invalidClassName);
            utils.paintBoard(this);
        }, 1000);
    }
    ;
    updatePlayer(player) {
        this.update(player);
        this._hooks.validStep(player, player.location, this._board[player.location]);
    }
    update(item) {
        this._board[item.location] = {
            indicator: item.indicator,
            classes: [...this._board[item.location].classes, item.cellType],
            mapItems: [...this._board[item.location].mapItems, item],
        };
    }
    move(player, startLocation, desiredLocation) {
        desiredLocation = desiredLocation !== undefined ? desiredLocation : startLocation;
        if (!this.isValidMove(startLocation, desiredLocation)) {
            return false;
        }
        this._board[startLocation] = {
            indicator: ' ',
            classes: this._board[startLocation].classes.filter(c => c !== player.cellType),
            mapItems: this._board[startLocation].mapItems.filter(i => i.cellType !== player.cellType),
        };
        player.setNextLocation();
        this.update(player);
        this._hooks.validStep(player, startLocation, this._board[player.location]);
        return true;
    }
    isAtGoal(desiredLocation) {
        return BoardValidation.isAtGoal(desiredLocation, this);
    }
}
export default Board;
//# sourceMappingURL=board.js.map