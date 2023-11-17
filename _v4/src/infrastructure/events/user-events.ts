import { HandlerPriorityType } from './generic-handler';
import { ISignalHandler, ISimpleEventHandler, SignalHandler, SimpleEventHandler } from './index';

export type UserActionTypes = 'move-forward' | 'turn' | 'flash-light' | 'reset';

export interface IFlashlightEventArgs {
    // direction: Direction;
    isOn: boolean;
    powerLevel?: number;
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

    subscribeMoveForward(owner: any, handler: ISignalHandler, priority?: HandlerPriorityType) {
        this.userEventHandlers.subscribeSignal('move-forward', owner, handler, priority);
        return this;
    }

    triggerMoveForward() {
        // console.log('move forward trigger');
        this.userEventHandlers.trigger('move-forward');
    }

    subscribeTurn(owner: any, handler: ISignalHandler, priority?: HandlerPriorityType) {
        this.userEventHandlers.subscribeSignal('turn', owner, handler, priority);
        return this;
    }

    triggerTurn() {
        this.userEventHandlers.trigger('turn');
    }

    subscribeFlashlight(owner: any, handler: ISimpleEventHandler<IFlashlightEventArgs>, priority?: HandlerPriorityType) {
        this.userEventHandlers.subscribeSimple('flash-light', owner, handler, priority);
        return this;
    }

    triggerFlashlight(args: IFlashlightEventArgs) {
        this.userEventHandlers.trigger('flash-light', args);
    }

    subscribeReset(owner: any, handler: ISimpleEventHandler<IResetEventArgs>, priority?: HandlerPriorityType) {
        this.userEventHandlers.subscribeSimple('reset', owner, handler, priority);
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

    subscribeSignal(actionType: UserActionTypes, owner: any, handler: ISignalHandler, priority?: HandlerPriorityType) {
        this.signalHandlers.subscribe(actionType, owner, handler, priority);
        return this;
    }

    subscribeSimple(actionType: UserActionTypes, owner: any, handler: (args: any) => void, priority?: HandlerPriorityType) {
        this.simpleEventHandlers.subscribe(actionType, owner, handler, priority);
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