import { ISignalHandler, ISimpleEventHandler } from "../types";

export default class UIEvents {
    private moveHandlers: ISignalHandler[] = [];
    private turnHandlers: ISignalHandler[] = [];
    private lightHandlers: ISimpleEventHandler<{ lightsOn: boolean, showWholeBoard: boolean }>[] = [];
    private saveMapHandlers: ISignalHandler[] = [];
    private resetHandlers: ISimpleEventHandler<{ newMap: boolean }>[] = [];

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

    subscribeToReset(handler: ISimpleEventHandler<{ newMap: boolean }>) {
        this.resetHandlers.push(handler);
    }
    triggerReset(eventArgs: { newMap: boolean }) {
        this.resetHandlers.forEach(h => h(eventArgs));
    }
}