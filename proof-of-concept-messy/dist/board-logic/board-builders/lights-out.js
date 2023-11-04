import { BoardValidation } from "../validation.js";
export class LightsOut {
    lightRadius;
    iluminate;
    constructor(lightRadius = 2, iluminate = ['goal', 'player']) {
        this.iluminate = iluminate;
        this.lightRadius = lightRadius;
    }
    init(board) {
        this.getUpdatedBoard(board, board.getItemLocations('player')[0]);
        return board;
    }
    update(board, targetLocation) {
        this.getUpdatedBoard(board, targetLocation);
        return board;
    }
    lightsOn(board, item, lightPower = 0) {
        return this.getUpdatedBoard(board, item.location, lightPower, false);
    }
    lightsOff(board, item) {
        return this.getUpdatedBoard(board, item.location);
    }
    getUpdatedBoard(board, targetLocation, override, markSeen = true) {
        const cells = board.getCells();
        const distanceToPlayer = override !== undefined ? override : (this.lightRadius);
        const visibleLocations = BoardValidation.locationsVisibleToPlayer(targetLocation, distanceToPlayer, cells, board.width, board.height);
        cells.forEach((cell, index) => {
            cell.classes = cell.classes.filter(c => c != 'fog');
            const isVisibleToPlayer = visibleLocations.includes(index);
            const hasKeepIluminatedItem = cell.mapItems.map(m => m.cellType).some(c => this.iluminate.includes(c));
            if (isVisibleToPlayer && markSeen) {
                cell.classes.push('seen');
                cell.classes = cell.classes.filter(c => c != 'unseen');
            }
            if (distanceToPlayer > 0 && !isVisibleToPlayer && !hasKeepIluminatedItem) {
                cell.classes.push('fog');
            }
            else {
                cell.classes = cell.classes.filter(c => c != 'fog');
            }
        });
        board.setCells(cells);
        return board;
    }
}
//# sourceMappingURL=lights-out.js.map