import { ISignalHandler, ISimpleEventHandler, SignalHandler, SimpleEventHandler } from "infrastructure/events";

export type UserActionTypes = 'move-forward' | 'turn' | 'flash-light' | 'reset';

export interface IFlashlightEventArgs {
    // direction: Direction;
    isOn: boolean;
    powerLevel?:number;
}

export interface IResetEventArgs {
    newMap: boolean;
}

export class UserEventHandler {
    private userEventHandlers: GenericUserEventHandlers;

    constructor() {
        this.userEventHandlers = new GenericUserEventHandlers();
    }

    unsubscribe(owner: any, actionType?: UserActionTypes) {
        this.userEventHandlers.unsubscribe(owner, actionType);
    }

    subscribeMoveForward(owner: any, handler: ISignalHandler) {
        this.userEventHandlers.subscribeSignal('move-forward', owner, handler);
        return this;
    }

    triggerMoveForward() {
        this.userEventHandlers.trigger('move-forward');
    }

    subscribeTurn(owner: any, handler: ISignalHandler) {
        this.userEventHandlers.subscribeSignal('turn', owner, handler);
        return this;
    }

    triggerTurn() {
        this.userEventHandlers.trigger('turn');
    }

    subscribeFlashlight(owner: any, handler: ISimpleEventHandler<IFlashlightEventArgs>) {
        this.userEventHandlers.subscribeSimple('flash-light', owner, handler);
        return this;
    }

    triggerFlashlight(args: IFlashlightEventArgs) {
        this.userEventHandlers.trigger('flash-light', args);
    }

    subscribeReset(owner: any, handler: ISimpleEventHandler<IResetEventArgs>) {
        this.userEventHandlers.subscribeSimple('reset', owner, handler);
        return this;
    }

    triggerReset(args: IResetEventArgs) {
        this.userEventHandlers.trigger('reset', args);
    }

}

class GenericUserEventHandlers {
    private signalHandlers: SignalHandler;
    private simpleEventHandlers: SimpleEventHandler<any>;

    constructor() {
        this.signalHandlers = new SignalHandler();
        this.simpleEventHandlers = new SimpleEventHandler();
    }

    subscribeSignal(actionType: UserActionTypes, owner: any, handler: ISignalHandler) {
        this.signalHandlers.subscribe(actionType, owner, handler);
        return this;
    }

    subscribeSimple(actionType: UserActionTypes, owner: any, handler: (args: any) => void) {
        this.simpleEventHandlers.subscribe(actionType, owner, handler);
        return this;
    }

    unsubscribe(owner: any, actionType?: UserActionTypes) {
        this.signalHandlers.unsubscribe(owner, actionType);
        this.simpleEventHandlers.unsubscribe(owner, actionType);
    }

    trigger(actionType: UserActionTypes, args?: any) {
        if (this.signalHandlers.has(actionType)) {
            this.signalHandlers.trigger(actionType);
        }
        if (this.simpleEventHandlers.has(actionType) && args !== undefined) {
            this.simpleEventHandlers.trigger(actionType, args);
        }
    }

}