export class Cell {
    indicator = ' ';
    classes = [];
    mapItems = [];
    static create(cell) {
        const newCell = new Cell();
        newCell.indicator = JSON.parse(JSON.stringify(cell.indicator));
        newCell.mapItems = JSON.parse(JSON.stringify(cell.mapItems));
        newCell.classes = JSON.parse(JSON.stringify(cell.classes));
        return newCell;
    }
    getClasses() {
        const classes = [...this.mapItems.map(i => i.cellType), ...this.classes];
        const classesSet = [...new Set(classes)];
        return classesSet;
    }
    getIndicator() {
        const indicators = this.mapItems.filter(i => i.indicator !== ' ').reverse();
        if (indicators.length > 0)
            return indicators[0].indicator;
        return this.indicator;
    }
}
//# sourceMappingURL=cell.js.map