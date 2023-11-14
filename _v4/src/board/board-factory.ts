import { BoardItemType, IBoard, IBoardCell, IBoardItem, IMap } from "./types";


function getNextCell(index: number, map: IMap): IBoardCell {
    let item: IBoardCell | undefined = undefined;
    if (map.player === index) {
        item = { items: [{ type: 'player', location: map.player }], attributes: [] };
    }
    else if (map.goal === index) {
        item = { items: [{ type: 'goal', location: map.goal }], attributes: [] };
    }
    else if (map.walls.has(index)) {
        item = { items: [{ type: 'wall', location: index }], attributes: [] };
    }
    else {
        item = { items: [{ type: 'empty', location: index }], attributes: [] };
    }

    return item;
}


class BoardCellsBuilder {
    private _buildSteps: ((cells: IBoardCell[]) => IBoardCell[])[] = [];
    constructor() { }

    private _fill(size: number): IBoardCell[] {
        return [...Array(size).keys()].map((i) => {
            let item: IBoardItem = { type: 'empty', location: i };
            return { items: [item], attributes: [] }
        });
    }

    private addBuildStep(step: (cells: IBoardCell[]) => IBoardCell[]) {
        this._buildSteps.push(step);
    }

    addItem(item: BoardItemType, index: number) {
        this.addBuildStep((cells) => {
            const newCells = [...cells];
            newCells[index].items = newCells[index].items.filter((i) => i.type !== 'empty');
            newCells[index].items.push({ type: item, location: index });
            return newCells;
        });
        return this;
    }

    addItems(item: BoardItemType, indexes: number[]) {
        this.addBuildStep((cells) => {
            const newCells = [...cells];
            indexes.forEach((i) => {
                newCells[i].items = newCells[i].items.filter((i) => i.type !== 'empty');
                newCells[i].items.push({ type: item, location: i });
            });
            return newCells;
        });
        return this;
    }

    build(size: number) {
        return this._buildSteps.reduce((cells, step) => step(cells), this._fill(size));
    }


}

//functor approach (uses the fluent interface)
class BoardCellFunctor {
    constructor(private _cells: IBoardCell[]) { }

    bind(func: (cells: IBoardCell[]) => IBoardCell[]) {
        return new BoardCellFunctor(func(this._cells));
    }

    get value() {
        return this._cells;
    }
}


//fluent interface
function initBoardCells(size: number) {
    return (cells: IBoardCell[] = []) => {
        return [...Array(size).keys()].map((i) => {
            let item: IBoardItem = { type: 'empty', location: i };
            return { items: [item], attributes: [] }
        });
    }
}

function removeItemFromCells(type: BoardItemType, index: number) {
    return (cells: IBoardCell[]) => {
        const newCells = [...cells];
        cells[index].items = cells[index].items.filter((i) => i.type !== type);
        return newCells;
    }
}

function addItemToCells(item: BoardItemType, index: number) {
    return (cells: IBoardCell[]) => {
        const newCells = [...cells];
        newCells[index].items = newCells[index].items.filter((i) => i.type !== 'empty');
        newCells[index].items.push({ type: item, location: index });
        return newCells;
    }
}

function addItemsToCells(item: BoardItemType, indexes: number[]) {
    return (cells: IBoardCell[]) => {
        const newCells = [...cells];
        indexes.forEach((i) => {
            newCells[i].items = newCells[i].items.filter((i) => i.type !== 'empty');
            newCells[i].items.push({ type: item, location: i });
        });
        return newCells;
    }
}

class BoardCellsObject {
    private _cells: IBoardCell[];
    [index: number]: IBoardCell;

    constructor(cells: IBoardCell[]) {
        this._cells = cells;
    }

    get cells() {
        return this._cells;
    }

    static init(size: number) {
        return new BoardCellsObject([...Array(size).keys()].map((i) => {
            let item: IBoardItem = { type: 'empty', location: i };
            return { items: [item], attributes: [] }
        }));
    }

    removeItem(index: number, type: BoardItemType) {
        this._cells[index].items = this._cells[index].items.filter((i) => i.type !== type);
        return this;
    }

    addItem(index: number, item: IBoardItem) {
        this._cells[index].items.push(item);
        return this;
    }

    addPlayer(index: number) {
        return this.removeItem(index, 'empty')
            .addItem(index, { type: 'player', location: index });
    }

    addGoal(index: number) {
        return this.removeItem(index, 'empty')
            .addItem(index, { type: 'goal', location: index });
    }

    addWalls(indexes: number[]) {
        indexes.forEach((i) => {
            this.removeItem(i, 'empty')
                .addItem(i, { type: 'wall', location: i });
        });
        return this;
    }

}

export class BoardFactory {
    static createBoard(map: IMap): IBoard {
        const board: IBoard = {
            width: map.width,
            height: map.height,
            cellWidth: map.cellWidth,
            map
        };

        return board;
    }

    static createCells(map: IMap): IBoardCell[] {
        let boardCells: IBoardCell[] = [];

        // boardCells = BoardCellsObject.init(map.width * map.height)
        //     .addWalls(map.walls)
        //     .addGoal(map.goal)
        //     .addPlayer(map.player)
        //     .cells;

        // boardCells = addItemToCells("player", map.player)
        //     (addItemToCells("goal", map.goal)
        //         (addItemsToCells("wall", map.walls)
        //             (initBoardCells(map.width * map.height)())));

        // boardCells = new BoardCellFunctor(initBoardCells(map.width * map.height)())
        //     .bind(addItemsToCells("wall", map.walls))
        //     .bind(addItemToCells("goal", map.goal))
        //     .bind(addItemToCells("player", map.player))
        //     .value;


        // boardCells = new BoardCellsBuilder()
        //     .addItems("wall", map.walls)
        //     .addItem("goal", map.goal)
        //     .addItem("player", map.player)
        //     .build(map.width * map.height);

        boardCells = [...Array(map.width * map.height).keys()].map((i) => getNextCell(i, map));

        return boardCells;
    }
}