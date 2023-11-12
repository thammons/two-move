import { IBoardEvents, IBoardUpdateEvent, ICellUpdateEvent, IInvalidStepEvent } from "../types";
import { ISimpleEventHandler, ISignalHandler } from "../types";


export class BoardEvents implements IBoardEvents {
    boardUpdateHandlers: ISimpleEventHandler<IBoardUpdateEvent>[] = [];
    cellUpdateHandlers: ISimpleEventHandler<ICellUpdateEvent>[] = [];
    movedHandlers: ISimpleEventHandler<ICellUpdateEvent>[] = [];
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

    subscribeToMoved(handler: ISimpleEventHandler<ICellUpdateEvent>) {
        this.movedHandlers.push(handler);
    }
    triggerMoved(eventArgs: ICellUpdateEvent) {
        this.movedHandlers.forEach(h => h(eventArgs));
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
