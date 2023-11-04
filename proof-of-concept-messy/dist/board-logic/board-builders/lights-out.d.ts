import { CellType, IBoard, IBoardBuilderOption, IMapItem, ItemLocation } from "../../types.js";
export declare class LightsOut<T extends IBoard> implements IBoardBuilderOption<T> {
    lightRadius: number;
    iluminate: (CellType | string)[];
    constructor(lightRadius?: number, iluminate?: CellType[]);
    init(board: T): T;
    update(board: T, targetLocation: ItemLocation): T;
    lightsOn(board: T, item: IMapItem, lightPower?: number): T;
    lightsOff(board: T, item: IMapItem): T;
    getUpdatedBoard(board: T, targetLocation: ItemLocation, override?: number, markSeen?: boolean): T;
}
//# sourceMappingURL=lights-out.d.ts.map