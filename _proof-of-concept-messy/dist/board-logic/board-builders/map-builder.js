export class InitializeMap {
    map;
    constructor(map) {
        this.map = map;
    }
    init(board) {
        board.setCells(this.updateCells(this.map, board));
        return board;
    }
    update(board, targetLocation) {
        board.setCells(this.updateCells(this.map, board));
        return board;
    }
    updateCells(map, board) {
        const itemLocations = BuildMap(map);
        const cells = [...Array(board.height * board.width)].map(i => {
            return {
                indicator: ' ',
                classes: ['unseen'],
                mapItems: []
            };
        });
        let playerLocation = undefined;
        itemLocations.forEach((cell, index) => {
            cells[index] = cell;
            if (cell.mapItems.map(m => m.cellType).includes('player')) {
                playerLocation = index;
            }
        });
        return cells;
    }
}
function BuildMap(boardMap) {
    const map = new Map();
    boardMap.walls.forEach(w => {
        map.set(w, {
            classes: ['unseen', 'wall'],
            indicator: ' ',
            mapItems: [
                {
                    cellType: 'wall',
                    indicator: ' ',
                    location: w
                }
            ]
        });
    });
    map.set(boardMap.goal, {
        classes: ['goal'],
        indicator: ' ',
        mapItems: [
            {
                cellType: 'goal',
                indicator: ' ',
                location: boardMap.goal
            }
        ]
    });
    map.set(boardMap.player, {
        classes: ['player'],
        indicator: '>',
        mapItems: [
            {
                cellType: 'player',
                indicator: '>',
                location: boardMap.player
            }
        ]
    });
    return map;
}
//# sourceMappingURL=map-builder.js.map