import { Direction, IPlayer, ICell } from "../types";
import { ISimpleEventHandler, ISignalHandler } from "../types";

interface IBoardUpdateEvent {
    board: ICell[],
}

interface ICellUpdateEvent {
    cell: ICell,
    index: number,
    isTemporary: boolean
}

interface IInvalidStepEvent {
    direction: Direction,
    player: IPlayer,
    newLocation: ICell
}



class BoardEvents {
    boardUpdateHandlers: ISimpleEventHandler<IBoardUpdateEvent>[] = [];
    cellUpdateHandlers: ISimpleEventHandler<ICellUpdateEvent>[] = [];
    invalidStepHandlers: ISimpleEventHandler<IInvalidStepEvent>[] = [];
    goalReachedHandlers: ISignalHandler[] = [];


    subscribeToBoardUpdate(handler: ISimpleEventHandler<IBoardUpdateEvent>) {
        this.boardUpdateHandlers.push(handler);
    }
    triggerBoardUpdate(eventArgs: IBoardUpdateEvent) {
        this.boardUpdateHandlers.forEach(h => h(eventArgs));
    }

    subscribeToCellUpdate(handler: ISimpleEventHandler<ICellUpdateEvent>) {
        this.cellUpdateHandlers.push(handler);
        /*
        indicateInvalidMove

        //TODO Play Negative Sound
        utils.paintBoard(this);
        

        setTimeout(() => {
            this._board[position].classes =
                this._board[position].classes.filter(c => c !== invalidClassName);
            utils.paintBoard(this);
        }, 1_000);
        */
    }
    triggerCellUpdate(eventArgs: ICellUpdateEvent) {
        this.cellUpdateHandlers.forEach(h => h(eventArgs));
    }

    subscribeToInvalidStep(handler: ISimpleEventHandler<IInvalidStepEvent>) {
        this.invalidStepHandlers.push(handler);
    }
    triggerInvalidStep(eventArgs: IInvalidStepEvent) {
        this.invalidStepHandlers.forEach(h => h(eventArgs));
    }

    subscribeToGoalReached(handler: ISignalHandler) {
        this.goalReachedHandlers.push(handler);
    }
    triggerGoalReached() {
        this.goalReachedHandlers.forEach(h => h());
    }
}


export default BoardEvents;