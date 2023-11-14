import { range } from "../infrastructure/helpers";
import { IBoard, IBoardCell, IMap } from "./types";


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

        boardCells = range(map.height * map.width).map((i) => getNextCell(i, map));

        return boardCells;
    }
}