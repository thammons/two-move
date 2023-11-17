import { IMap, IMapItem } from "@/maps/types";
import './cell';

//TODO this could be a lot more functional...
export class BoardComponent extends HTMLElement {
    cells: Map<number, IMapItem[]> = new Map();
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

        //TODO: This needs to be replaced.. probably wire to a board event?
        [...Array(100).keys()].forEach((i) => {
            if (!this.cells)
                this.cells = new Map();

            this.cells.set(i, [{
                type: 'empty',
                location: i,
                attributes: ['unseen']
            }]);
        });
        // this.cells[0].items.push({ type: 'player', location: 0 });
        // this.cells[99].items.push({ type: 'goal', location: 99 });


        for (let [key, value] of map.mapItems) {
            for (let item of value) {
                const existingAttributes = this.cells.get(item.location)?.flatMap(c => c.attributes) || [];
                const existingItems = this.cells.get(item.location)?.filter(c => c.type !== 'empty') || [];
                this.cells.set(item.location, [...existingItems, {
                    id: item.id,
                    type: key,
                    location: item.location,
                    direction: item.direction,
                    attributes: [...new Set([...existingAttributes, ...(item.attributes || [])])]
                } as IMapItem
                ]);
            }
        }
    }


    render() {
        let cellDisplayItems = [];
        for (let [key, value] of this.cells) {
            cellDisplayItems.push({ location: key, items: value });
        }

        //TODO: set style based on board options (cell size, min-width, gridOptions etc)
        const renderThis = `
        <link rel="stylesheet" href="/src/_web/components/board/cell.css">
        <div class="board">
        ${cellDisplayItems.map((cell, index) => `
        <two-move-cell id="cell-comp-${index}"></two-move-cell>
        `).join('')}
        </div>
    `;
        this.shadowRoot!.innerHTML = renderThis;

        this.cells.forEach((cell, index) => {
            const cellElement = this.shadowRoot!.getElementById(`cell-comp-${index}`) as any;
            cellElement.cellData = cell;
        });
    }
}
// Define the custom element
customElements.define('two-move-board', BoardComponent);