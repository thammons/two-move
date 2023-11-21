import { IMap, IMapItem, MapItemType } from "@/maps";
import './cell';
import { BoardLogic, IBoardDisplay, IUpdateMapItem } from "./board-logic";

export class BoardDisplay implements IBoardDisplay {

    get BoardElement(): BoardComponent {
        return document.querySelector(
            "two-move-board"
        ) as BoardComponent;
    }

    constructor(map: IMap) {
        BoardComponent.init();
        this.BoardElement.initCells(map);
    }

    updateCells(map: IMap) {
        this.BoardElement.updateCells(map);
    }
}


//TODO this could be a lot more functional...
export class BoardComponent extends HTMLElement {

    boardLogic: BoardLogic = new BoardLogic({
        height: 10,
        width: 10,
        mapItems: new Map<MapItemType, IMapItem[]>(),
    });

    static init() {
        // Define the custom element
        customElements.define('two-move-board', BoardComponent);
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });

        this.boardLogic.updateCells();

        this.render();

        //TODO: Add event listeners
        // this.addEventListener('keydown', this.handleKeydown);
        // new KeyboardHandlers().setupHandlers();
    }

    disconnectedCallback() {
        //TODO: remove event listeners
        // this.removeEventListener('keydown', this.handleKeydown);
    }

    render() {
        let cellDisplayItems = BoardLogic.getCellUpdateDisplayItems(this.boardLogic.Cells);

        const boardWidthPx = BoardLogic.getBoardDisplayWidth(this.boardLogic.Width);
        const cellWidthPx = 50;

        const renderThis = `
        <link rel="stylesheet" href="/src/_web/components/board/cell.css">
        <style>
            .board-wrapper {
                overflow: hidden;
                max-height: 90vh;
                max-width: 50vw;
            }

            .board {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(${cellWidthPx}px, 1fr));
                grid-auto-rows: ${cellWidthPx}px;
                gap: 0px;

                width: ${boardWidthPx}px;
                min-width: ${boardWidthPx}px;
                font-size: 45px;
            }
        </style>
        <div class="board-wrapper">
            <div class="board">
            ${cellDisplayItems.map((_, index) => `
            <two-move-cell id="cell-comp-${index}"></two-move-cell>
            `).join('')}
            </div>
        </div>
    `;
        this.shadowRoot!.innerHTML = renderThis;
        this._cellUpdate(cellDisplayItems);
    }

    initCells(map:IMap){
        this.boardLogic.updateCells(map, true);
        this.render();
    }

    updateCells(map: IMap) {
        this.boardLogic.updateCells(map);
        let cellDisplayItems = BoardLogic.getCellUpdateDisplayItems(this.boardLogic.Cells);
        this._cellUpdate(cellDisplayItems);
    }


    private _cellUpdate(cells: IUpdateMapItem[][]) {
        cells.forEach((cell) => {
            const cellLocation = cell[0].location;
            const cellElement = this.shadowRoot!.getElementById(`cell-comp-${cellLocation}`) as any;
            if (!cellElement) return;
            cellElement.cellData = cell;

            //TODO: do nearest based on unfogged cells instead...?
            if (cell.some(c => c.type === 'player')) {
                cellElement.scrollIntoView({ block: "center", inline: "center" });
                // cellElement.scrollIntoView({ block: "nearest", inline: "nearest" });
                console.log('scrolling to player')
            }


        });
    }
}