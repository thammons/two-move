import { IMapItem, IMapItemCollection } from "@/board/types";

const directionIndicators = new Map([
    ['north', '^'],
    ['south', 'v'],
    ['east', '>'],
    ['west', '<']
]);

export class CellComponent extends HTMLElement {
    private _cell: IMapItemCollection = {
        items: [],
        attributes: []
    };
    private _needsRender = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set cellData(data: IMapItemCollection) {
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
        let playerItem: IMapItem | undefined = undefined;
        this._cell.items.forEach((item) => {
            cellElement.classList.add(item.type);
            if (item.type === 'player') {
                playerItem = item;
            }
        });
        if (playerItem !== undefined) {
            console.log(playerItem)
            let indicator = '';
            const player = playerItem as IMapItem;
                indicator = directionIndicators.get(player.direction ?? 'north') ?? '';
            cellElement.innerHTML = indicator;
        }

        this._cell.attributes.forEach((attribute: string) => {
            cellElement.classList.add(attribute);
        });
        
        // console.log(cellElement.outerHTML)
        return cellElement.outerHTML;
    }

    render() {
        const renderThis = `
        <link rel="stylesheet" href="/src/_web/components/board/cell.css">
        ${this.buildCell()}`;
        // console.log(renderThis)
        this.shadowRoot!.innerHTML = renderThis;
    }

}

customElements.define('two-move-cell', CellComponent);