import { ISignalHandler, ISimpleEventHandler, SignalHandler, SimpleEventHandler } from "../infrastructure/events/index.ts";
import { Direction, IBoard, IBoardCell, IPlayer } from "./types";

export type BoardSignalTypes = "win-condition";
export type BoardSimpleEventTypes = "board-update" | "cell-update" | "moved" | "invalid-step";
export type BoardEmitEventType = BoardSignalTypes | BoardSimpleEventTypes;


export interface IBoardUpdateEventArgs {
    board: IBoard,
}

export interface ICellUpdateEventArgs {
    cell: IBoardCell,
    index: number,
    isTemporary: boolean
}

export interface IInvalidStepEventArgs {
    direction: Direction,
    player: IPlayer,
    newLocation: IBoardCell
}

export class BoardEventHandler {
    private boardHandlers: GenericBoardEventHandlers;

    constructor() {
        this.boardHandlers = new GenericBoardEventHandlers();
    }

    /*
    * Unsubscribe from events
    * @param owner The object that owns the event handler
    * @param eventName The name of the event to unsubscribe from (if undefined, unsubscribe from all events)
    */
    unsubscribe(owner: any, eventName?: BoardEmitEventType) {
        this.boardHandlers.unsubscribe(owner, eventName);
        return this;
    }

    subscribeToBoardUpdate(owner: any, handler: ISimpleEventHandler<IBoardUpdateEventArgs>) {
        this.boardHandlers.subscribeSimpleEvent("board-update", owner, handler);
        return this;
    }

    triggerBoardUpdate(args: IBoardUpdateEventArgs) {
        this.boardHandlers.trigger("board-update", args);
    }

    subscribeToCellUpdate(owner: any, handler: ISimpleEventHandler<ICellUpdateEventArgs>) {
        this.boardHandlers.subscribeSimpleEvent("cell-update", owner, handler);
        return this;
    }

    triggerCellUpdate(args: ICellUpdateEventArgs) {
        this.boardHandlers.trigger("cell-update", args);
    }

    subscribeToMoved(owner: any, handler: ISimpleEventHandler<IPlayer>) {
        this.boardHandlers.subscribeSimpleEvent("moved", owner, handler);
        return this;
    }

    triggerMoved(args: IPlayer) {
        this.boardHandlers.trigger("moved", args);
    }

    subscribeToInvalidStep(owner: any, handler: ISimpleEventHandler<IInvalidStepEventArgs>) {
        this.boardHandlers.subscribeSimpleEvent("invalid-step", owner, handler);
        return this;
    }

    triggerInvalidStep(args: IInvalidStepEventArgs) {
        this.boardHandlers.trigger("invalid-step", args);
    }

    subscribeToWinCondition(owner: any, handler: ISignalHandler) {
        this.boardHandlers.subscribeSignal("win-condition", owner, handler);
        return this;
    }

    triggerWinCondition() {
        this.boardHandlers.trigger("win-condition");
    }

}

class GenericBoardEventHandlers {
    private signalHandlers: SignalHandler;
    //Using any.. not great, but this is an internal class, so the wrapper should provide the correct types
    private simpleEventHandlers: SimpleEventHandler<any>;

    constructor() {
        this.signalHandlers = new SignalHandler();
        this.simpleEventHandlers = new SimpleEventHandler<any>();
    }

    subscribeSignal(eventName: BoardSignalTypes, owner: any, handler: ISignalHandler) {
        this.signalHandlers.subscribe(eventName, owner, handler);
        return this;
    }

    subscribeSimpleEvent(eventName: BoardSimpleEventTypes, owner: any, handler: ISimpleEventHandler<any>) {
        this.simpleEventHandlers.subscribe(eventName, owner, handler);
        return this;
    }

    unsubscribe(owner: any, eventName?: BoardEmitEventType) {
        this.signalHandlers.unsubscribe(owner, eventName);
        this.simpleEventHandlers.unsubscribe(owner, eventName);
        return this;
    }

    trigger(eventName: BoardEmitEventType, args?: any) {
        if (this.signalHandlers.has(eventName)) {
            this.signalHandlers.trigger(eventName);
        }
        if (this.simpleEventHandlers.has(eventName) && args !== undefined) {
            this.simpleEventHandlers.trigger(eventName, args);
        }
    }
}
