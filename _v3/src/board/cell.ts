import { ICell, IMapItem, Indicator } from "../types";

export class Cell implements ICell {
    indicator: Indicator = ' ';
    classes: string[] = [];
    mapItems: IMapItem[] = [];

    static create(cell: ICell) {
        const newCell = new Cell();
        newCell.indicator = JSON.parse(JSON.stringify(cell.indicator));
        newCell.mapItems = JSON.parse(JSON.stringify(cell.mapItems));
        newCell.classes = JSON.parse(JSON.stringify(cell.classes));
        // console.log('newCell', newCell);
        return newCell;
    }

    getClasses(): string[] {
        const classes = [...this.mapItems.map(i => i.cellType), ...this.classes];
        const classesSet = [...new Set(classes)];
        // console.log('classes', classesSet, this.mapItems, this.classes);
        return classesSet;
    }

    getIndicator(): Indicator {
        const indicators = this.mapItems.filter(i => i.indicator !== ' ').reverse();
        if (indicators.length > 0) return indicators[0].indicator;
        return this.indicator;
    }
}
