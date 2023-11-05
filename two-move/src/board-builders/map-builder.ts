import { ItemLocation, ICell, IMap, IBoardBuilderOption, IBoard } from "../types.js";


export class InitializeMap<T extends IBoard> implements IBoardBuilderOption<T> {
    map: IMap;

    constructor(map: IMap) {
        this.map = map;
    }


    init(board: T): T {
        board.setCells(this.updateCells(this.map, board));
        return board;
    }
    update(board: T, targetLocation: ItemLocation): T {
        //need the arg for the interface, but not using it
        targetLocation;

        board.setCells(this.updateCells(this.map, board));
        return board;
    }

    updateCells(map: IMap, board: T): ICell[] {
        const itemLocations = BuildMap(map);

        //THIS CREATES A REFERENCE TO THE SAME OBJECT IN EACH CELL
        // const cells: ICell[] = Array(board.height * board.width).fill({ indicator: ' ', classes: [], mapItems: [] });

        const cells: ICell[] = [...Array(board.height * board.width)].map(() => {
            return {
                indicator: ' ',
                classes: ['unseen'],
                mapItems: []
            }
        });

        let playerLocation: ItemLocation | undefined = undefined;

        itemLocations.forEach((cell, index) => {
            cells[index] = cell;
            if (cell.mapItems.map(m => m.cellType).includes('player')) {
                playerLocation = index;
            }
        });

        return cells;
    }
}

function BuildMap(boardMap: IMap): Map<ItemLocation, ICell> {
    const map = new Map<ItemLocation, ICell>();
    boardMap.walls.forEach(w => {
        map.set(w,
            {
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

    map.set(boardMap.goal,
        {
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

    map.set(boardMap.player,
        {
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
