import { ItemLocation, Direction, IBoard, ICell, IPlayer, IMap, IBoardHooks, IMapItem, CellType } from "./types.js";
declare class Board implements IBoard {
    width: number;
    height: number;
    cellWidth: number;
    size: number;
    map: IMap;
    _board: ICell[];
    _hooks: IBoardHooks;
    constructor(map: IMap, hooks: IBoardHooks);
    getCells(): ICell[];
    getCell(position: ItemLocation): ICell;
    setCells(cells: ICell[]): void;
    setCell(position: ItemLocation, cell: ICell): void;
    getItemLocations(itemType: CellType | string): ItemLocation[];
    getDirection: (startLocation: ItemLocation, desiredLocation: ItemLocation) => "east" | "west" | "north" | "south";
    isValidMove(startLocation: ItemLocation, desiredLocation: ItemLocation): boolean;
    indicateInvalidMove(position: ItemLocation, direction: Direction): void;
    updatePlayer(player: IPlayer): void;
    update(item: IMapItem): void;
    move(player: IPlayer, startLocation: ItemLocation, desiredLocation?: ItemLocation): boolean;
    isAtGoal(desiredLocation: number): boolean;
}
export default Board;
//# sourceMappingURL=board.d.ts.map