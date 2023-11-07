import { CellType, IBoard, IBoardBuilderOption, ICell, ICellUpdateEvent, IMapItem, ItemLocation } from "../types.js";
import { BoardValidation } from "../board/validation.js";

export class LightsOut<T extends IBoard> implements IBoardBuilderOption<T> {

    lightRadius: number;
    iluminate: (CellType | string)[];
    isInitialLoad: boolean = true;
    isOn: boolean = false;
    lightPower: number | undefined = undefined;
    updateSeen: boolean = true;

    constructor(lightRadius: number = 2, iluminate: CellType[] = ['goal', 'player']) {
        this.iluminate = iluminate;
        this.lightRadius = lightRadius;
    }

    init(board: T): T {
        this.isInitialLoad = true;
        board.addEventListeners({
            movedHandlers: [() => this.update(board, board.getItemLocations('player')[0])],
            boardUpdateHandlers: [],
            cellUpdateHandlers: [],
            invalidStepHandlers: [],
            goalReachedHandlers: []
        });

        this.getUpdatedBoard(board, board.getItemLocations('player')[0]);
        return board;
    }
    update(board: T, targetLocation: ItemLocation): T {
        this.getUpdatedBoard(board, targetLocation, this.lightPower || this.lightRadius, this.updateSeen);
        return board;
    }

    lightsOn(board: T, item: IMapItem, lightPower: number = 0) {
        if (!this.isOn) {
            this.isOn = true;
            this.lightPower = lightPower;
            this.updateSeen = lightPower > 0;
            return this.getUpdatedBoard(board, item.location, lightPower, false);
        }
        else
            return board;
    }

    lightsOff(board: T, item: IMapItem) {
        if (this.isOn) {
            this.isOn = false;
            this.lightPower = this.lightRadius;
            this.updateSeen = true;
            return this.getUpdatedBoard(board, item.location);
        }
        else
            return board;
    }

    getUpdatedBoard(board: T, targetLocation: ItemLocation, override?: number, markSeen: boolean = true): T {
        const cells = board.getCells();
        // for(var i = 0; i < cells.length; i++) {
        //     cells[i].classes = cells[i].classes.filter(c => c != 'fog');
        // }
        const distanceToPlayer = override !== undefined ? override : (this.lightRadius);
        const visibleLocations = BoardValidation.locationsVisibleToPlayer(targetLocation, distanceToPlayer, cells, board.width, board.height);

        let updatedCells: ItemLocation[] = []
        // console.log('prefog', cells);

        //TODO optionally narrow down cells based on target location
        cells.forEach((cell, index, array) => {
            let updated = false;
            // cell.indicator == 'X' ? cell.indicator = ' ' : cell.indicator;
            // cell.classes = cell.classes.filter(c => c != 'fog');
            const isVisibleToPlayer = visibleLocations.includes(index);
            //console.log('isvisibletoplayer', isVisibleToPlayer, index, visibleLocations, cell);
            const hasKeepIluminatedItem = cell.mapItems.map(m => m.cellType).some(c => this.iluminate.includes(c));

            if (isVisibleToPlayer && markSeen) {
                if (cell.classes.includes('unseen') || !cell.classes.includes('seen')) {
                    cell.classes.push('seen');
                    cell.classes = cell.classes.filter(c => c != 'unseen');
                    updated = true;
                    //console.log('seen')
                }
            }

            if (distanceToPlayer > 0 && !isVisibleToPlayer && !hasKeepIluminatedItem) {
                if (!cell.classes.includes('fog')) {
                    cell.classes.push('fog');
                    updated = true;
                    //console.log('fogging', index, distanceToPlayer > 0, !isVisibleToPlayer, !hasKeepIluminatedItem)
                    // cell.indicator = 'X';
                }
            }
            else {
                if (cell.classes.includes('fog')) {
                    //cell.classes.splice(cell.classes.indexOf('fog'), 1);
                    array[index].classes = cell.classes.filter(c => c != 'fog');
                    updated = true;
                    // cell.indicator = ' ';
                }
            }
            if (updated) {
                // console.log('setcell', JSON.stringify(cell));
                // board.setCell(index, JSON.parse(JSON.stringify(cell))); 
                board.updateCell(index);
                //console.log('updatedcell', index, JSON.stringify(board.getCell(index)))
            }
        });

        // for(var l of visibleLocations) {
        //     console.log('visible', l, cells[l]);
        //     cells[l].classes = cells[l].classes.filter(c => c != 'fog');
        // }

        // console.log('lightsout', JSON.stringify(cells))

        // console.log('LightsOut > fogged', distanceToPlayer, visibleLocations, cells.filter(c => c.classes.includes('fog')).map((x, i) => i));
        // board.setCells(cells);

        this.isInitialLoad = false;
        return board;

    }
}