import { IBoardCell } from "board/types";

export class CellComponent extends HTMLElement {
    private _cell: IBoardCell = {
        items: [],
        attributes: []
    };
    private _needsRender = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set cellData(data: IBoardCell) {
        this._cell = data;
        if (this.shadowRoot) {
            this.render();
        }
        else {
            this._needsRender = true;
        }
        // console.log('set cell data', data, this._needsRender)
    }

    connectedCallback() {
        // console.log('connected', "needs render", this._needsRender)
        if (this._needsRender) {
            this.render();
        }
    }

    buildCell(): string {
        const cellElement = document.createElement('div');
        cellElement.classList.add('board-cell');
        cellElement.classList.add('cell-' + this._cell.items[0].location);
        cellElement.classList.add('cell');
        let isPlayer = false;
        this._cell.items.forEach((item) => {
            cellElement.classList.add(item.type);
            if (item.type === 'player') {
                isPlayer = true;
            }
        });
        if (isPlayer) {
            cellElement.innerHTML = ">";
        }
        this._cell.attributes.forEach((attribute: string) => {
            cellElement.classList.add(attribute);
        });
        console.log(cellElement.outerHTML)
        return cellElement.outerHTML;
    }

    render() {
        const renderThis = `
        <link rel="stylesheet" href="/src/_web/components/board/cell.css">
        ${this.buildCell()}`;
        console.log(renderThis)
        this.shadowRoot!.innerHTML = renderThis;
    }

}

customElements.define('two-move-cell', CellComponent);