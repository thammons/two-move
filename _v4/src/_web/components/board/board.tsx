import { IMap, IMapItem } from "@/maps/types";
import './cell';

interface IUpdateMapItem extends IMapItem {
    isUpdated: boolean;
}

//TODO this could be a lot more functional...
export class BoardComponent extends HTMLElement {
    cells: Map<number, IUpdateMapItem[]> = new Map();
    height: number = 10;
    width: number = 10;

    connectedCallback() {
        this.attachShadow({ mode: 'open' });


        //TODO This should be handled some other way
        this.populateCells();


        this.render();

        //TODO: Add event listeners
        // this.addEventListener('keydown', this.handleKeydown);
        // new KeyboardHandlers().setupHandlers();
    }

    disconnectedCallback() {
        //TODO: remove event listeners
        // this.removeEventListener('keydown', this.handleKeydown);
    }

    populateCells(map?: IMap) {

        //TODO: partial updates
        if (!map) return;
        if (!this.cells.size) {
            this.cells = this._createCells(map);
        }
        else {
            this.cells = this._getUpdatedCells(map, this.cells);
        }

    }

    private _createCells(map: IMap) {
        const cells = new Map<number, IUpdateMapItem[]>();
        //TODO: This needs to be replaced.. probably wire to a board event?
        [...Array(100).keys()].forEach((i) => {
            cells.set(i, [{
                type: 'empty',
                location: i,
                attributes: ['unseen'],
                isUpdated: true
            }]);
        });
        // this.cells[0].items.push({ type: 'player', location: 0 });
        // this.cells[99].items.push({ type: 'goal', location: 99 });


        for (let [key, value] of map.mapItems) {
            for (let item of value) {
                const cell = cells.get(item.location);
                const existingAttributes = cell?.flatMap(c => c.attributes) || [];
                const existingItems = cell?.filter(c => c.type !== 'empty') || [];
                cells.set(item.location, [...existingItems, {
                    id: item.id,
                    type: key,
                    location: item.location,
                    direction: item.direction,
                    attributes: [...new Set([...existingAttributes, ...(item.attributes || [])])],
                    isUpdated: true
                } as IUpdateMapItem
                ]);
            }
        }
        return cells;
    }

    private _getUpdatedCells(newMap: IMap, oldMap: Map<number, IUpdateMapItem[]>) {
        const newCells = this._createCells(newMap);
        const updatedCells = new Map<number, IUpdateMapItem[]>();

        for (let [key, value] of newCells) {
            const oldCell = oldMap.get(key);
            const newCell = value;
            if (!oldCell) {
                updatedCells.set(key, newCell);
                continue;
            }
            const oldCellItems = oldCell.filter(c => c.type !== 'empty');
            const newCellItems = newCell.filter(c => c.type !== 'empty');
            if (oldCellItems.length !== newCellItems.length) {
                updatedCells.set(key, newCell);
                continue;
            }
            newCell.forEach((item, index) => {
                const oldItem = oldCellItems[index];
                if (!oldItem) {
                    updatedCells.set(key, newCell);
                }
                else if (oldItem.location !== item.location) {
                    updatedCells.set(key, newCell);
                }
                else if (oldItem.direction !== item.direction) {
                    updatedCells.set(key, newCell);
                }
                else if (oldItem.attributes?.length !== item.attributes?.length) {
                    updatedCells.set(key, newCell);
                }
                else if (oldItem.attributes?.some(a => !item.attributes?.includes(a))) {
                    updatedCells.set(key, newCell);
                }
                else {
                    updatedCells.set(key, oldCell);
                }
            });
        }
        return updatedCells;
    }

    render() {
        let cellDisplayItems = this._getCellDisplayItems(this.cells);

        //TODO: set style based on board options (cell size, min-width, gridOptions etc)
        const renderThis = `
        <link rel="stylesheet" href="/src/_web/components/board/cell.css">
        <div class="board">
        ${cellDisplayItems.map((_, index) => `
        <two-move-cell id="cell-comp-${index}"></two-move-cell>
        `).join('')}
        </div>
    `;
        this.shadowRoot!.innerHTML = renderThis;
        this._cellUpdate(cellDisplayItems);
    }

    updateCells(map: IMap) {
        this.populateCells(map);
        let cellDisplayItems = this._getCellDisplayItems(this.cells);
        this._cellUpdate(cellDisplayItems);
    }

    private _getCellDisplayItems(cells: Map<number, IUpdateMapItem[]>) {
        let cellDisplayItems = [];
        for (let [_, value] of cells) {
            // if (value.some(v => v.isUpdated))
            cellDisplayItems.push(value);
        }
        return cellDisplayItems;
    }

    private _cellUpdate(cells: IUpdateMapItem[][]) {
        cells.forEach((cell, index) => {
            const cellElement = this.shadowRoot!.getElementById(`cell-comp-${index}`) as any;
            cellElement.cellData = cell;
        });
    }
}
// Define the custom element
customElements.define('two-move-board', BoardComponent);