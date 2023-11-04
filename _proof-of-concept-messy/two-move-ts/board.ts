import { ItemLocation, Direction, IBoard, ICell, IPlayer, IMap, IBoardHooks, IMapItem, CellType } from "./types.js";
import { BoardValidation } from "./board-logic/validation.js";
import * as utils from "./ui-utils-html.js";


class Board implements IBoard {
    width: number = 10;
    height: number = 10;
    cellWidth: number = 50;
    size: number = this.width * this.width;
    map: IMap;
    _board: ICell[] = [];
    _hooks: IBoardHooks;

    constructor(map: IMap, hooks: IBoardHooks) {
        this.width = map.width;
        this.height = map.height;
        this.cellWidth = map.cellWidth;
        this.size = this.width * this.width;
        this.map = map;
        this._hooks = hooks;
    }

    getCells(): ICell[] {
        //TODO deep copy instead of returning the reference
        return this._board;
    }

    getCell(position: ItemLocation): ICell {
        //TODO deep copy instead of returning the reference
        return this._board[position];
    }
    
    setCells(cells:ICell[]) :void {
        //TODO validate
       this._board = cells;
    }

    setCell(position: ItemLocation, cell:ICell): void {
        //TODO validate
        this._board[position] = cell;
    }

    getItemLocations(itemType: CellType | string): ItemLocation[] {
        const mappedItems = this._board.flatMap(c => c.mapItems).filter(c => c.cellType === itemType);
        return mappedItems.map(m => m.location);
    }

    getDirection = (startLocation: ItemLocation, desiredLocation: ItemLocation) => {
        if (desiredLocation === startLocation) {
            return 'east';
        } else if (desiredLocation === startLocation + 1) {
            return 'east';
        } else if (desiredLocation === startLocation - 1) {
            return 'west';
        } else if (desiredLocation === startLocation - this.width) {
            return 'north';
        } else if (desiredLocation === startLocation + this.width) {
            return 'south';
        }
        console.error('Invalid direction', startLocation, desiredLocation);
        throw new Error('Invalid direction');
    };

    isValidMove(startLocation: ItemLocation, desiredLocation: ItemLocation): boolean {
        let isValidMove = true;
        let direction: Direction | undefined = undefined;

        if (startLocation === desiredLocation) {
            isValidMove = true;
            return isValidMove;
        }

        direction = this.getDirection(startLocation, desiredLocation);

        if (desiredLocation < 0 || desiredLocation > this.size - 1) {
            //    console.log("board > isValidMove > desiredLocation out of bounds", desiredLocation);
            isValidMove = false;
        }

        else if (BoardValidation.isBlocked(startLocation, desiredLocation, this)) {
            // console.log("board > isValidMove > desiredLocation blocked", desiredLocation);
            isValidMove = false;
        }

        else {
            if (!BoardValidation.isNextMoveOnMap(startLocation, direction!, this.width, this.height)) {
                // console.log("board > isValidMove > desiredLocation off map", desiredLocation);
                isValidMove = false;
            }
        }

        if (!isValidMove) {
            this.indicateInvalidMove(startLocation, direction);
            const player = this._board[startLocation].mapItems.find(mi => mi.cellType == 'player') as IPlayer;
            this._hooks.invalidStep(player, this._board[desiredLocation], direction!);
        }
        // console.log('board > isValidMove', isValidMove, startLocation, direction, desiredLocation);

        return isValidMove;
    }

    indicateInvalidMove(position: ItemLocation, direction: Direction) {
        const invalidClassName = `error-${direction}`;
        this._board[position].classes.push(invalidClassName);
        //TODO Play Negative Sound
        utils.paintBoard(this);

        setTimeout(() => {
            this._board[position].classes =
                this._board[position].classes.filter(c => c !== invalidClassName);
            utils.paintBoard(this);
        }, 1_000);
    };

    updatePlayer(player: IPlayer) {
        this.update(player);
        this._hooks.validStep(player, player.location, this._board[player.location]);
    }

    update(item: IMapItem) {
        this._board[item.location] = {
            indicator: item.indicator,
            classes: [...this._board[item.location].classes, item.cellType],
            mapItems: [...this._board[item.location].mapItems, item],
        };
        //utils.paintBoard(this);
    }

    move(player: IPlayer, startLocation: ItemLocation, desiredLocation?: ItemLocation): boolean {
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

    isAtGoal(desiredLocation: number): boolean {
        return BoardValidation.isAtGoal(desiredLocation, this);
    }
}

export default Board;