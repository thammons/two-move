import { ISignalHandler, ISimpleEventHandler } from "../types";
import { IUIEvents } from "./types";

export interface ILightEventArgs {
    lightsOn: boolean;
    showWholeBoard: boolean;
}

export interface IResetEventArgs {
    newMap: boolean;
    resetPlayer: boolean;
}

export class UIEvents implements IUIEvents {
    moveHandlers: ISignalHandler[] = [];
    turnHandlers: ISignalHandler[] = [];
    lightHandlers: ISimpleEventHandler<ILightEventArgs>[] = [];
    saveMapHandlers: ISignalHandler[] = [];
    resetHandlers: ISimpleEventHandler<IResetEventArgs>[] = [];

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

    subscribeToLight(handler: ISimpleEventHandler<ILightEventArgs>) {
        this.lightHandlers.push(handler);
    }
    triggerLight(eventArgs: ILightEventArgs) {
        this.lightHandlers.forEach(h => h(eventArgs));
    }

    subscribeToSaveMap(handler: ISignalHandler) {
        this.saveMapHandlers.push(handler);
    }
    triggerSaveMap() {
        this.saveMapHandlers.forEach(h => h());
    }

    subscribeToReset(handler: ISimpleEventHandler<IResetEventArgs>) {
        this.resetHandlers.push(handler);
    }
    triggerReset(eventArgs: IResetEventArgs) {
        this.resetHandlers.forEach(h => h(eventArgs));
    }
}