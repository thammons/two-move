import { ItemLocation, Direction, IBoard, ICell, IMove, IMap } from '../types.js';


export class MoveValidation {

    static isNextMoveOnMap = (startPosition: ItemLocation, direction: Direction, boardWidth: number, boardHeight: number): boolean => {
        const width = boardWidth;
        const height = boardHeight;
        const size = width * height;

        // console.log('isNextMoveOnMap', startPosition, direction, boardWidth, boardHeight);

        const isValidEast = startPosition % width < width - 1;
        const isValidWest = startPosition % width > 0;
        const isValidNorth = startPosition >= 0;
        const isValidSouth = startPosition < size;
        // console.log('isNextMoveOnMap - validation', isValidEast, isValidWest, isValidNorth, isValidSouth);

        switch (direction) {
            case 'east':
                return isValidEast;
            case 'west':
                return isValidWest;
            case 'north':
                return isValidNorth;
            case 'south':
                return isValidSouth;
        }
    };

    static isBlocked = (currentPosition: ItemLocation, nextPosition: ItemLocation, board: IBoard): boolean => {
        if (!this.isInBounds(nextPosition, board.width, board.height)
            || this.isMaxEast(nextPosition, 0, board.width)
            || this.isMaxWest(nextPosition, 0, board.width)) {
            return true;
        }
        // console.log('nextPosition', nextPosition, BOARD[nextPosition]);
        return board.getCell(nextPosition).mapItems.map(m => m.cellType).includes('wall');
    };


    static locationsVisibleToPlayer(playerLocation: ItemLocation, distanceToPlayer: number, cells: ICell[], boardWidth: number, boardHeight: number): ItemLocation[] {
        const visibleLocations: ItemLocation[] = [];
        visibleLocations.push(playerLocation);

        const foundWall = (index: number) => {
            let foundWall = true;
            if (cells.length > index && index >= 0) {
                foundWall = cells[index].mapItems.map(m => m.cellType).includes('wall');
            }
            return foundEastWall;
        }

        let foundWestWall = false;
        let foundEastWall = false;
        let foundNorthWall = false;
        let foundSouthWall = false;

        //horizontals
        const horizVert = [...Array(distanceToPlayer + 1).keys()];
        horizVert.forEach(i => {
            const isMaxWest = this.isMaxWest(playerLocation, i, boardWidth);
            foundWestWall = foundWestWall || foundWall(playerLocation - i + 1);
            const isMaxEast = this.isMaxEast(playerLocation, i, boardWidth);
            foundEastWall = foundEastWall || foundWall(playerLocation + i - 1);

            if (!isMaxWest && !foundWestWall) {
                //west
                visibleLocations.push(playerLocation - i);
            }
            if (!isMaxEast && !foundEastWall) {
                //east
                visibleLocations.push(playerLocation + i);
            }

            foundNorthWall = foundNorthWall || foundWall(playerLocation - ((i - 1) * boardWidth));
            foundSouthWall = foundSouthWall || foundWall(playerLocation + ((i - 1) * boardWidth));
            if (!foundNorthWall) {
                //north
                visibleLocations.push(playerLocation - (i * boardWidth));
            }
            if (!foundSouthWall) {
                //south
                visibleLocations.push(playerLocation + (i * boardWidth));
            }
        });

        //diagonals
        const diag = [...Array(distanceToPlayer / 2 + 1).keys()];
        diag.unshift(); //drop the 0

        diag.forEach(horiz => {

            const isMaxWest = this.isMaxWest(playerLocation, horiz, boardWidth);
            const isMaxEast = this.isMaxEast(playerLocation, horiz, boardWidth);
            diag.forEach(vert => {
                //climbs north and south, scanning east and west
                const currentRow = boardWidth * vert;

                if (!isMaxWest) {
                    //north west
                    visibleLocations.push(playerLocation - currentRow - horiz);
                    //south west
                    visibleLocations.push(playerLocation + currentRow - horiz);
                }

                if (!isMaxEast) {
                    //north east
                    visibleLocations.push(playerLocation - currentRow + horiz);
                    //south east
                    visibleLocations.push(playerLocation + currentRow + horiz);
                }
            });
        });

        return [...new Set(visibleLocations)];
    }

    static isInBounds(desiredLocation: ItemLocation, boardWidth: number, boardHeight: number): boolean {
        return desiredLocation >= 0 && desiredLocation < boardWidth * boardHeight;
    }

    static isMaxEast(playerLocation: ItemLocation, distanceToPlayer: number, boardWidth: number): boolean {
        return Math.floor(playerLocation / boardWidth) !== Math.floor((playerLocation + distanceToPlayer) / boardWidth);
    }

    static isMaxWest(playerLocation: ItemLocation, distanceToPlayer: number, boardWidth: number): boolean {
        return (playerLocation % boardWidth) - (distanceToPlayer % boardWidth) < 0;
    }

    static isNextToPlayer(position: ItemLocation, playerLocation: ItemLocation, distanceToPlayer: number, boardWidth: number, boardHeight: number): boolean {
        let isNextToPlayer = false;

        //assume player at 50,50
        // with fog of war of 3
        //  can see 50,50 (self)
        if (position === playerLocation) {
            isNextToPlayer = true;
        }

        // console.log('isNextToPlayer', position, playerLocation, distanceToPlayer);
        const rowDiff = Math.floor(position / boardWidth) - Math.floor(playerLocation / boardWidth);
        const columnDiff = position % boardWidth - playerLocation % boardWidth;

        if (rowDiff === 0) {
            //  can see 50,49 / 50,48  (left)
            if (position <= playerLocation && position >= playerLocation - distanceToPlayer) {
                isNextToPlayer = true;
            }
            //  can see 50,51 / 50,52  (right)
            else if (position >= playerLocation && position <= playerLocation + distanceToPlayer) {
                isNextToPlayer = true;
            }
        }

        else if (columnDiff === 0) {
            //  can see 49,50 / 48,50  (up)
            if (position <= playerLocation && position >= playerLocation - (distanceToPlayer * boardWidth)) {
                isNextToPlayer = true;
            }
            //  can see 51,50 / 52,50  (down)
            else if (position >= playerLocation && position <= playerLocation + (distanceToPlayer * boardWidth)) {
                isNextToPlayer = true;
            }
        }

        // console.log('isNextToPlayer', position, playerLocation, distanceToPlayer, isNextToPlayer);

        return isNextToPlayer;
    }

    static isAtGoal(desiredLocation: ItemLocation, board: IBoard): boolean {
        return board.getCell(desiredLocation).classes.includes('goal');
    }


    //newStuff

    static isWall = (itemPosition: ItemLocation, map: IMap): boolean => {
        return map.walls.includes(itemPosition);
    };

    static getStepIndex = (startPosition: ItemLocation, distance: number, direction: Direction, boardWidth: number): ItemLocation => {
        const directionToStepMap: Map<Direction, ItemLocation> = new Map([
            ['east', startPosition + distance],
            ['west', startPosition - distance],
            ['north', startPosition - (distance * boardWidth)],
            ['south', startPosition + (distance * boardWidth)],
        ]);
        const nextIndex = directionToStepMap.get(direction);
        if (nextIndex === undefined) {
            throw new Error(`getNextStepIndex for ${startPosition}, direction ${direction} not found`);
        }
        return nextIndex;
    };

    static canAttemptStep = (move: IMove, map: IMap): boolean => {
        const isOnBoard = this.isNextCellOnBoard(move.startLocation, move.direction, map.width, map.height);
        const isWall = this.isWall(move.startLocation, map);
        return isOnBoard && !isWall;
    }

    static isMoveDestinationOnBoard = (move: IMove, map: IMap): boolean => {
        return this.isNextCellOnBoard(move.startLocation, move.direction, map.width, map.height);
    };

    static isNextCellOnBoard = (startPosition: ItemLocation, direction: Direction, boardWidth: number, boardHeight: number): boolean => {
        const width = boardWidth;
        const height = boardHeight;
        const size = width * height;

        const directionIsOnMap: Map<Direction, boolean> = new Map([
            ['east', startPosition % width < width - 1],
            ['west', startPosition % width > 0],
            ['north', startPosition - width >= 0],
            ['south', startPosition + width < size],
        ]);

        const isValidForDirection = directionIsOnMap.get(direction);
        // console.log('isNextCellOnBoard', startPosition, direction, boardWidth, boardHeight, isValidForDirection)
        return isValidForDirection ?? false;
    };
}