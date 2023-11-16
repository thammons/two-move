import { IMap } from "@/maps/types";
import './cell';
import { IMapItemCollection } from "./cell";

//TODO this could be a lot more functional...
export class BoardComponent extends HTMLElement {
    cells: IMapItemCollection[] = [];

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
        //TODO: This needs to be replaced.. probably wire to a board event?
        this.cells = [];
        [...Array(100).keys()].forEach((i) => {
            this.cells.push({
                items: [{ type: 'empty', location: i }],
                attributes: ['unseen']
            });
        });
        // this.cells[0].items.push({ type: 'player', location: 0 });
        // this.cells[99].items.push({ type: 'goal', location: 99 });
        
        if (!map) return;
        console.log('populateCells', map);

        for (let [key, value] of map.mapItems) {
            for (let item of value) {
                this.cells[item.location].items = this.cells[item.location].items.filter((i) => i.type !== 'empty');
                this.cells[item.location].items.push({ type: key, location: item.location, direction: item.direction });
                this.cells[item.location].attributes = [...new Set([...(item.attributes || [])])];
            }
        }
        
    }


    render() {
        //TODO: set style based on board options (cell size, min-width, gridOptions etc)
        const renderThis = `
        <style>
        .board {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
            grid-auto-rows: 50px;
            gap: 0px;

            width: 520px;
            min-width: 520px;
            font-size: 45px;

        }
        </style>
        <div class="board">
        ${this.cells.map((cell, index) => `
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