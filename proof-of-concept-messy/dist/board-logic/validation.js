export class BoardValidation {
    static isNextMoveOnMap = (startPosition, direction, boardWidth, boardHeight) => {
        const width = boardWidth;
        const height = boardHeight;
        const size = width * height;
        switch (direction) {
            case 'east':
                return startPosition % width !== width - 1;
            case 'west':
                return startPosition % width !== 0;
            case 'north':
                return startPosition >= width;
            case 'south':
                return startPosition < size - width;
        }
    };
    static isBlocked = (currentPosition, nextPosition, board) => {
        if (!this.isInBounds(nextPosition, board.width, board.height)
            || this.isMaxEast(nextPosition, 0, board.width)
            || this.isMaxWest(nextPosition, 0, board.width)) {
            return true;
        }
        return board.getCell(nextPosition).mapItems.map(m => m.cellType).includes('wall');
    };
    static locationsVisibleToPlayer(playerLocation, distanceToPlayer, cells, boardWidth, boardHeight) {
        const visibleLocations = [];
        visibleLocations.push(playerLocation);
        const foundWall = (index) => {
            let foundWall = true;
            if (cells.length > index && index >= 0) {
                foundWall = cells[index].mapItems.map(m => m.cellType).includes('wall');
            }
            return foundEastWall;
        };
        let foundWestWall = false;
        let foundEastWall = false;
        let foundNorthWall = false;
        let foundSouthWall = false;
        const horizVert = [...Array(distanceToPlayer + 1).keys()];
        horizVert.forEach(i => {
            const isMaxWest = this.isMaxWest(playerLocation, i, boardWidth);
            foundWestWall = foundWestWall || foundWall(playerLocation - i + 1);
            const isMaxEast = this.isMaxEast(playerLocation, i, boardWidth);
            foundEastWall = foundEastWall || foundWall(playerLocation + i - 1);
            if (!isMaxWest && !foundWestWall) {
                visibleLocations.push(playerLocation - i);
            }
            if (!isMaxEast && !foundEastWall) {
                visibleLocations.push(playerLocation + i);
            }
            foundNorthWall = foundNorthWall || foundWall(playerLocation - ((i - 1) * boardWidth));
            foundSouthWall = foundSouthWall || foundWall(playerLocation + ((i - 1) * boardWidth));
            if (!foundNorthWall) {
                visibleLocations.push(playerLocation - (i * boardWidth));
            }
            if (!foundSouthWall) {
                visibleLocations.push(playerLocation + (i * boardWidth));
            }
        });
        const diag = [...Array(distanceToPlayer / 2 + 1).keys()];
        diag.unshift();
        diag.forEach(horiz => {
            const isMaxWest = this.isMaxWest(playerLocation, horiz, boardWidth);
            const isMaxEast = this.isMaxEast(playerLocation, horiz, boardWidth);
            diag.forEach(vert => {
                const currentRow = boardWidth * vert;
                if (!isMaxWest) {
                    visibleLocations.push(playerLocation - currentRow - horiz);
                    visibleLocations.push(playerLocation + currentRow - horiz);
                }
                if (!isMaxEast) {
                    visibleLocations.push(playerLocation - currentRow + horiz);
                    visibleLocations.push(playerLocation + currentRow + horiz);
                }
            });
        });
        return [...new Set(visibleLocations)];
    }
    static isInBounds(desiredLocation, boardWidth, boardHeight) {
        return desiredLocation >= 0 && desiredLocation < boardWidth * boardHeight;
    }
    static isMaxEast(playerLocation, distanceToPlayer, boardWidth) {
        return Math.floor(playerLocation / boardWidth) !== Math.floor((playerLocation + distanceToPlayer) / boardWidth);
    }
    static isMaxWest(playerLocation, distanceToPlayer, boardWidth) {
        return (playerLocation % boardWidth) - (distanceToPlayer % boardWidth) < 0;
    }
    static isNextToPlayer(position, playerLocation, distanceToPlayer, boardWidth, boardHeight) {
        let isNextToPlayer = false;
        if (position === playerLocation) {
            isNextToPlayer = true;
        }
        const rowDiff = Math.floor(position / boardWidth) - Math.floor(playerLocation / boardWidth);
        const columnDiff = position % boardWidth - playerLocation % boardWidth;
        if (rowDiff === 0) {
            if (position <= playerLocation && position >= playerLocation - distanceToPlayer) {
                isNextToPlayer = true;
            }
            else if (position >= playerLocation && position <= playerLocation + distanceToPlayer) {
                isNextToPlayer = true;
            }
        }
        else if (columnDiff === 0) {
            if (position <= playerLocation && position >= playerLocation - (distanceToPlayer * boardWidth)) {
                isNextToPlayer = true;
            }
            else if (position >= playerLocation && position <= playerLocation + (distanceToPlayer * boardWidth)) {
                isNextToPlayer = true;
            }
        }
        return isNextToPlayer;
    }
    static isAtGoal(desiredLocation, board) {
        return board.getCell(desiredLocation).classes.includes('goal');
    }
}
//# sourceMappingURL=validation.js.map