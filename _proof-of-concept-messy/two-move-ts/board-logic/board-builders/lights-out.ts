import { CellType, IBoard, IBoardBuilderOption, ICell, IMapItem, IPlayer, ItemLocation } from "../../types.js";
import { BoardValidation } from "../validation.js";

export class LightsOut<T extends IBoard> implements IBoardBuilderOption<T> {

    lightRadius: number;
    iluminate: (CellType | string)[];

    constructor(lightRadius: number = 2, iluminate: CellType[] = ['goal', 'player']) {
        this.iluminate = iluminate;
        this.lightRadius = lightRadius;
    }

    init(board: T): T {
        this.getUpdatedBoard(board, board.getItemLocations('player')[0]);
        return board;
    }
    update(board: T, targetLocation: ItemLocation): T {
        this.getUpdatedBoard(board, targetLocation);
        return board;
    }

    lightsOn(board: T, item: IMapItem, lightPower: number = 0) {
        return this.getUpdatedBoard(board, item.location, lightPower, false);
        // utils.paintBoard(this);
    }

    lightsOff(board: T, item: IMapItem) {
        // FOG_OF_WAR = 4;
        return this.getUpdatedBoard(board, item.location);
        // utils.paintBoard(this);
    }

    getUpdatedBoard(board: T, targetLocation: ItemLocation, override?: number, markSeen: boolean = true): T {

        /*
            TODO: Visited squares should appear different than unvisited squares
        */


        const cells = board.getCells();
        // for(var i = 0; i < cells.length; i++) {
        //     cells[i].classes = cells[i].classes.filter(c => c != 'fog');
        // }

        const distanceToPlayer = override !== undefined ? override : (this.lightRadius);
        const visibleLocations = BoardValidation.locationsVisibleToPlayer(targetLocation, distanceToPlayer, cells, board.width, board.height);

        // console.log('prefog', cells);

        //TODO optionally narrow down cells based on target location
        cells.forEach((cell, index) => {
            // cell.indicator == 'X' ? cell.indicator = ' ' : cell.indicator;
            cell.classes = cell.classes.filter(c => c != 'fog');
            const isVisibleToPlayer = visibleLocations.includes(index);
            //console.log('isvisibletoplayer', isVisibleToPlayer, index, visibleLocations, cell);
            const hasKeepIluminatedItem = cell.mapItems.map(m => m.cellType).some(c => this.iluminate.includes(c));

            if(isVisibleToPlayer && markSeen){
                cell.classes.push('seen');
                cell.classes = cell.classes.filter(c => c != 'unseen');
                //console.log('seen')
            }

            if (distanceToPlayer > 0 && !isVisibleToPlayer && !hasKeepIluminatedItem) {
               cell.classes.push('fog');
                //console.log('fogging', index, distanceToPlayer > 0, !isVisibleToPlayer, !hasKeepIluminatedItem)
                // cell.indicator = 'X';
            }
            else {
                //cell.classes.splice(cell.classes.indexOf('fog'), 1);
                cell.classes = cell.classes.filter(c => c != 'fog');
                // cell.indicator = ' ';
                // console.log("NO FOG", index)
            }
        });

        // for(var l of visibleLocations) {
        //     console.log('visible', l, cells[l]);
        //     cells[l].classes = cells[l].classes.filter(c => c != 'fog');
        // }


        // console.log('LightsOut > fogged', distanceToPlayer, visibleLocations, cells.filter(c => c.classes.includes('fog')).map((x, i) => i));

        board.setCells(cells);
        return board;

    }
}