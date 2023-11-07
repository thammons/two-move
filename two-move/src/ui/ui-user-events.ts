import { ISignalHandler, ISimpleEventHandler } from "../types";


export interface IUIEvents {
    moveHandlers: ISignalHandler[],
    turnHandlers: ISignalHandler[],
    lightHandlers: ISimpleEventHandler<{ lightsOn: boolean, showWholeBoard: boolean }>[],
    saveMapHandlers: ISignalHandler[],
    resetHandlers: ISimpleEventHandler<{ newMap: boolean, resetPlayer: boolean }>[]
}

export class UIEvents implements IUIEvents {
    moveHandlers: ISignalHandler[] = [];
    turnHandlers: ISignalHandler[] = [];
    lightHandlers: ISimpleEventHandler<{ lightsOn: boolean, showWholeBoard: boolean }>[] = [];
    saveMapHandlers: ISignalHandler[] = [];
    resetHandlers: ISimpleEventHandler<{ newMap: boolean, resetPlayer: boolean }>[] = [];

    subscribeToMove(handler: ISignalHandler) {
        this.moveHandlers.push(handler);
    }
    triggerMove() {
        this.moveHandlers.forEach(h => h());
    }

    subscribeToTurn(handler: ISignalHandler) {
        this.turnHandlers.push(handler);
    }
    triggerTurn() {
        this.turnHandlers.forEach(h => h());
    }

    subscribeToLight(handler: ISimpleEventHandler<{lightsOn: boolean, showWholeBoard: boolean }>) {
        this.lightHandlers.push(handler);
    }
    triggerLight(eventArgs: { lightsOn: boolean, showWholeBoard: boolean }) {
        this.lightHandlers.forEach(h => h(eventArgs));
    }

    subscribeToSaveMap(handler: ISignalHandler) {
        this.saveMapHandlers.push(handler);
    }
    triggerSaveMap() {
        this.saveMapHandlers.forEach(h => h());
    }

    subscribeToReset(handler: ISimpleEventHandler<{ newMap: boolean, resetPlayer: boolean }>) {
        this.resetHandlers.push(handler);
    }
    triggerReset(eventArgs: { newMap: boolean, resetPlayer: boolean }) {
        this.resetHandlers.forEach(h => h(eventArgs));
    }
}