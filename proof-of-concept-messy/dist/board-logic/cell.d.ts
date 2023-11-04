import { ICell, IMapItem, Indicator } from "../types";
export declare class Cell implements ICell {
    indicator: Indicator;
    classes: string[];
    mapItems: IMapItem[];
    static create(cell: ICell): Cell;
    getClasses(): string[];
    getIndicator(): Indicator;
}
//# sourceMappingURL=cell.d.ts.map