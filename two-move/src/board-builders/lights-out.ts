import { CellType, IBoard, IBoardBuilderOption, IMapItem, IPlayer, ItemLocation } from "../types.js";
import { MoveValidation } from "../board/move-validation.js";

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

    getUIEvents(flashlightRadius: number, board: T, player: IPlayer) {
        return [(eventArgs: { lightsOn: boolean, showWholeBoard: boolean }) => {
            if (!eventArgs.lightsOn) {
                this.lightsOff(board, player);
            }
            else {
                if (eventArgs.showWholeBoard) {
                    this.lightsOn(board, player);
                }
                else {
                    //TODO: make this based on the board dimentions
                    const radius = flashlightRadius;
                    this.lightsOn(board, player, radius);
                    // This will mark the cells as seen
                    // LIGHTSOUT.update(BOARD, PLAYER.getPlayerLocation());
                }
            }
        }];
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

    private getUpdatedBoard(board: T, targetLocation: ItemLocation, override?: number, markSeen: boolean = true): T {
        const cells = board.getCells();

        const distanceToPlayer = override !== undefined ? override : (this.lightRadius);
        // const visibleLocations = MoveValidation.locationsVisibleToPlayer(targetLocation, distanceToPlayer, board.map);
        const visibleLocations = MoveValidation.locationsVisibleToPlayer(targetLocation, distanceToPlayer, cells, board.width, board.height);

        //TODO optionally narrow down cells based on target location
        cells.forEach((cell, index, array) => {
            let updated = false;
            const isVisibleToPlayer = visibleLocations.includes(index);
            const hasKeepIluminatedItem = cell.mapItems.map(m => m.cellType).some(c => this.iluminate.includes(c));

            if (isVisibleToPlayer && markSeen) {
                if (cell.classes.includes('unseen') || !cell.classes.includes('seen')) {
                    cell.classes.push('seen');
                    cell.classes = cell.classes.filter(c => c != 'unseen');
                    updated = true;
                }
            }

            if (distanceToPlayer > 0 && !isVisibleToPlayer && !hasKeepIluminatedItem) {
                if (!cell.classes.includes('fog')) {
                    cell.classes.push('fog');
                    updated = true;
                }
            }
            else {
                if (cell.classes.includes('fog')) {
                    array[index].classes = cell.classes.filter(c => c != 'fog');
                    updated = true;
                }
            }
            if (updated) {
                board.updateCell(index);
            }
        });

        this.isInitialLoad = false;
        return board;
    }
}