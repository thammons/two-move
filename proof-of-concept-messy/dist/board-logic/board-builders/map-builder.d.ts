import { ItemLocation, ICell, IMap, IBoardBuilderOption, IBoard } from "../../types.js";
export declare class InitializeMap<T extends IBoard> implements IBoardBuilderOption<T> {
    map: IMap;
    constructor(map: IMap);
    init(board: T): T;
    update(board: T, targetLocation: ItemLocation): T;
    updateCells(map: IMap, board: T): ICell[];
}
//# sourceMappingURL=map-builder.d.ts.map