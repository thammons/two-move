import { ItemLocation, Direction, IBoard, ICell, IPlayer, IMap, IMapItem, CellType, IBoardEvents } from "../types.js";
import { MoveValidation } from "./move-validation.js";
import { BoardEvents } from "./events.js";


class Board implements IBoard {
    width: number = 10;
    height: number = 10;
    cellWidth: number = 50;
    size: number = this.width * this.height;
    map: IMap;
    _board: ICell[] = [];
    _events: BoardEvents;

    constructor(map: IMap) {
        this.width = map.width;
        this.height = map.height;
        this.cellWidth = map.cellWidth;
        this.size = this.width * this.height;
        this.map = map;
        this._events = new BoardEvents();
    }

    addEventListeners(events: IBoardEvents) {
        this._events.boardUpdateHandlers.push(...events.boardUpdateHandlers);
        this._events.cellUpdateHandlers.push(...events.cellUpdateHandlers);
        this._events.movedHandlers.push(...events.movedHandlers);
        this._events.invalidStepHandlers.push(...events.invalidStepHandlers);
        this._events.goalReachedHandlers.push(...events.goalReachedHandlers);
    }

    updateCell(index: ItemLocation): void {
        this._events.triggerCellUpdate({ cell: this._board[index], index: index, isTemporary: false });
    }

    getCells(): ICell[] {
        //TODO deep copy instead of returning the reference
        return this._board;
    }

    getCell(position: ItemLocation): ICell {
        //TODO deep copy instead of returning the reference
        return this._board[position];
    }

    setCells(cells: ICell[]): void {
        //TODO validate
        this._board = JSON.parse(JSON.stringify(cells));
    }

    setCell(position: ItemLocation, cell: ICell): void {
        //TODO validate
        this._board[position] = JSON.parse(JSON.stringify(cell));
    }

    getItemLocations(itemType: CellType | string): ItemLocation[] {
        const mappedItems = this._board.flatMap(c => c.mapItems).filter(c => c.cellType === itemType);
        return mappedItems.map(m => m.location);
    }

    getDirection(startLocation: ItemLocation, desiredLocation: ItemLocation) {
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

        const isNextMoveOffMap = desiredLocation < 0 || desiredLocation > this.size - 1;
        const isCurrentLocationOnMap = startLocation >= 0 && startLocation < this.size;
        if (isNextMoveOffMap) {
            if (isCurrentLocationOnMap) {
                this.indicateInvalidMove(startLocation, direction);
                const player = this._board[startLocation].mapItems.find(mi => mi.cellType == 'player') as IPlayer;
                this._events.triggerInvalidStep({
                    player: player,
                    newLocation: this._board[startLocation],
                    direction: direction!
                });
            }
            //    console.log("board > isValidMove > desiredLocation out of bounds", desiredLocation);
            return false;
        }

        else if (MoveValidation.isWall(desiredLocation, this.map)) {
            isValidMove = false;
        }

        else {
            if (!MoveValidation.isNextCellOnBoard(startLocation, direction!, this.width, this.height)) {
                isValidMove = false;
            }
        }

        if (!isValidMove) {
            this.indicateInvalidMove(startLocation, direction);
            const player = this._board[startLocation].mapItems.find(mi => mi.cellType == 'player') as IPlayer;
            this._events.triggerInvalidStep({
                player: player,
                newLocation: this._board[startLocation],
                direction: direction!
            });
        }
        // console.log('board > isValidMove', isValidMove, startLocation, direction, desiredLocation);

        return isValidMove;
    }

    indicateInvalidMove(position: ItemLocation, direction: Direction) {
        // console.trace('board > indicateInvalidMove', position, direction)
        const invalidClassName = `error-${direction}`;
        this._board[position].classes.push(invalidClassName);
        this._events.triggerCellUpdate({ cell: this._board[position], index: position, isTemporary: true });

        setTimeout(() => {
            this._board[position].classes = this._board[position].classes.filter(c => c !== invalidClassName);
            this._events.triggerCellUpdate({ cell: this._board[position], index: position, isTemporary: false });
        }, 1000);
    };

    updateItem(item: IMapItem) {
        this._board[item.location] = {
            indicator: item.indicator,
            classes: [...new Set([...this._board[item.location].classes, item.cellType])],
            mapItems: [...new Set([...this._board[item.location].mapItems, item])],
        };

        this._events.triggerCellUpdate({ cell: this._board[item.location], index: item.location, isTemporary: false });
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
        this.updateItem(player);

        this._events.triggerMoved({ cell: this._board[startLocation], index: startLocation, isTemporary: false });
        if (MoveValidation.isAtGoal(desiredLocation, this)) {
            this._events.triggerGoalReached();
        }

        return true;
    }

    isAtGoal(desiredLocation: number): boolean {
        return MoveValidation.isAtGoal(desiredLocation, this);
    }
}

export default Board;