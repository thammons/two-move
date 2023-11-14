import { ItemLocation, Direction, IBoard, ICell, IMap, IMove } from '../types.js';


export class MoveValidation {
    static isWall = (itemPosition: ItemLocation, map: IMap): boolean => {
        return map.walls.includes(itemPosition);
    };

    static isLocationSteppable(location: ItemLocation, map: IMap): boolean {
        const isSteppable = false;
        if (this.isInBounds(location, map.width, map.height)) {
            return !this.isWall(location, map);
        }
        return isSteppable;
    }

    static isNextLocationVisibleToPlayer(playerLocation: ItemLocation, distanceToPlayer: number, direction: Direction, map: IMap): ItemLocation | undefined {
        const location = this.getStepIndex(playerLocation, distanceToPlayer, direction as Direction, map.width);
        const nextLocation = this.getStepIndex(location, 1, direction as Direction, map.width);
        const canAttemptStep = this.canAttemptStep({ startLocation: location, destinationLocation: nextLocation, direction: direction as Direction, isMove: true }, map);
        return canAttemptStep ? nextLocation : undefined;
    }

    static locationsVisibleToPlayer(playerLocation: ItemLocation, distanceToPlayer: number, map: IMap): ItemLocation[] {
        const visibleLocations: ItemLocation[] = [];
        //player location is always visible
        visibleLocations.push(playerLocation);
        const boardWidth = map.width;

        //horizontals
        const horizVert = [...Array(distanceToPlayer + 1).keys()];

        ['west', 'east', 'north', 'south'].forEach(direction => {
            let foundWall = false;
            horizVert.forEach(i => {
                const nextMove = this.isNextLocationVisibleToPlayer(playerLocation, i, direction as Direction, map);
                foundWall = foundWall || nextMove === undefined;
                if (!foundWall) {
                    visibleLocations.push(nextMove!);
                }
            });

        });



        //diagonals
        const furthestDiagonal = Math.floor(distanceToPlayer / 2 + 1);
        const diag = [...Array(furthestDiagonal).keys()];
        let diagVisibleLocations: ItemLocation[] = [];

        [['north', 'west'], ['north', 'east'], ['south', 'west'], ['south', 'east']].forEach(directions => {
            let foundWallXY = false;
            let lastXY = playerLocation;
            diag.forEach(i => {
                const vertDirection = directions[0] as Direction;
                const horizDirection = directions[1] as Direction;

                const nextY = this.getStepIndex(playerLocation, i, vertDirection, boardWidth);
                const nextX = this.getStepIndex(playerLocation, i, horizDirection, boardWidth);
                const nextXY = this.getStepIndex(nextY, i, horizDirection, boardWidth);

                const isNextXCellOnBoard = this.isNextCellOnBoard(nextX, horizDirection, map.width, map.height);
                const isNextYCellOnBoard = this.isNextCellOnBoard(nextY, vertDirection, map.width, map.height);
                const isXYSteppable = this.isLocationSteppable(nextXY, map);
                const isXYVisible = isXYSteppable && isNextXCellOnBoard && isNextYCellOnBoard;

                if (!foundWallXY) {
                    diagVisibleLocations.push(nextXY);
                    foundWallXY = foundWallXY || !isXYVisible;
                }
                lastXY = nextXY;
            });
        });
        diagVisibleLocations = diagVisibleLocations.sort();

        console.log('diagVisibleLocations', diagVisibleLocations);
        visibleLocations.push(...new Set(diagVisibleLocations));

        [['north', 'west'], ['north', 'east'], ['south', 'west'], ['south', 'east']].forEach(directions => {

            const vertDirection = directions[0] as Direction;
            const horizDirection = directions[1] as Direction;

            for (let i = 0; i < distanceToPlayer + 1; i++) {
                const foundWall = false;
                for (let j = 0; j < distanceToPlayer + 2 - i; j++) {
                    const nextY = this.getStepIndex(playerLocation, i, vertDirection, boardWidth);
                    const nextX = this.getStepIndex(playerLocation, j, horizDirection, boardWidth);
                    const nextXY = this.getStepIndex(nextY, j, horizDirection, boardWidth);
                    if (this.isLocationSteppable(nextXY, map)) {
                        visibleLocations.push(nextXY);
                    }
                }
            }
        });


        // //make diamond shape pattern
        // ['west', 'east', 'north', 'south'].forEach(direction => {
        //     diagVisibleLocations.forEach(d => {
        //         let foundWall = false;
        //         horizVert.forEach(i => {
        //             const nextMove = this.isNextLocationVisibleToPlayer(d, i, direction as Direction, map);
        //             foundWall = foundWall || nextMove === undefined;
        //             if (!foundWall) {
        //                 visibleLocations.push(nextMove!);
        //             }
        //         });
        //     });

        // });


        // diag.forEach(horiz => {

        //     const isMaxWest = this.isMaxWest(playerLocation, horiz, boardWidth);
        //     const isMaxEast = this.isMaxEast(playerLocation, horiz, boardWidth);
        //     diag.forEach(vert => {
        //         //climbs north and south, scanning east and west
        //         const currentRow = boardWidth * vert;

        //         if (!isMaxWest) {
        //             //north west
        //             visibleLocations.push(playerLocation - currentRow - horiz);
        //             //south west
        //             visibleLocations.push(playerLocation + currentRow - horiz);
        //         }

        //         if (!isMaxEast) {
        //             //north east
        //             visibleLocations.push(playerLocation - currentRow + horiz);
        //             //south east
        //             visibleLocations.push(playerLocation + currentRow + horiz);
        //         }
        //     });
        // });
        const visibleLocationsSet = new Set(visibleLocations);
        console.log(visibleLocations, visibleLocationsSet);
        return [...visibleLocationsSet];
    }

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

    static isInBounds(desiredLocation: ItemLocation, boardWidth: number, boardHeight: number): boolean {
        return desiredLocation >= 0 && desiredLocation < boardWidth * boardHeight;
    }

    static isMaxEast(playerLocation: ItemLocation, distanceToPlayer: number, boardWidth: number): boolean {
        return Math.floor(playerLocation / boardWidth) !== Math.floor((playerLocation + distanceToPlayer) / boardWidth);
    }

    static isMaxWest(playerLocation: ItemLocation, distanceToPlayer: number, boardWidth: number): boolean {
        return (playerLocation % boardWidth) - (distanceToPlayer % boardWidth) < 0;
    }
    // static isMaxWest(direction: Direction, playerLocation: ItemLocation, boardWidth: number): boolean {
    //     return direction === 'west' && (playerLocation % boardWidth) < 0;
    // }

    // static isMaxEast(direction: Direction, playerLocation: ItemLocation, boardWidth: number): boolean {
    //     return direction === 'east' && Math.floor(playerLocation / boardWidth) !== Math.floor((playerLocation) / boardWidth);
    // }

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
            if (this.isMaxEast(playerLocation, distanceToPlayer, boardWidth)) {
                // if (position <= playerLocation && position >= playerLocation - distanceToPlayer) {
                isNextToPlayer = true;
            }
            //  can see 50,51 / 50,52  (right)
            else if (this.isMaxWest(playerLocation, distanceToPlayer, boardWidth)) {
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

        return isNextToPlayer;
    }

    static isAtGoal(desiredLocation: ItemLocation, board: IBoard): boolean {
        //TODO support multiple goals - goal should have a `get nextMap:IMap`
        return board.getCell(desiredLocation).classes.includes('goal');
    }

}