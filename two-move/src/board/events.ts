import { Direction, IPlayer, ICell, IBoard } from "../types";
import { ISimpleEventHandler, ISignalHandler } from "../types";

export interface IBoardUpdateEvent {
    board: IBoard,
}

export interface ICellUpdateEvent {
    cell: ICell,
    index: number,
    isTemporary: boolean
}

export interface IInvalidStepEvent {
    direction: Direction,
    player: IPlayer,
    newLocation: ICell
}



export class BoardEvents {
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
