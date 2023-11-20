import { IMapItem } from "@/maps";


const directionIndicators = new Map([
    ['north', '^'],
    ['south', 'v'],
    ['east', '>'],
    ['west', '<']
]);

export class CellComponent extends HTMLElement {
    private _cell: IMapItem[] = [];
    private _needsRender = false;

    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    set cellData(data: IMapItem[]) {
        this._cell = data;
        // if (this.shadowRoot) {
        //     this.render();
        // }
        // else {
        //     this._needsRender = true;
        // }
        this.render();
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
        cellElement.classList.add('cell-' + this._cell[0].location);
        cellElement.classList.add('cell');
        let playerItem: IMapItem | undefined = undefined;
        this._cell.forEach((item) => {
            cellElement.classList.add(item.type);
            if (item.type === 'player') {
                playerItem = item;
            }

            item.attributes?.forEach((attribute: string) => {
                cellElement.classList.add(attribute);
            });
        });
        if (playerItem !== undefined) {
            let indicator = '';
            const player = playerItem as IMapItem;
            indicator = directionIndicators.get(player.direction ?? 'north') ?? '';
            cellElement.innerHTML = indicator;
        }

        // console.log(cellElement.outerHTML)
        return cellElement.outerHTML;
    }

    render() {
        const renderThis = `${this.buildCell()}`;
        // console.log(renderThis)
        // this.shadowRoot!.innerHTML = renderThis;
        this.innerHTML = renderThis;
    }

}

customElements.define('two-move-cell', CellComponent);