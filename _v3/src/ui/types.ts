import { IBoard, IMover, IPlayer } from "../types";
import { ISignalHandler, ISimpleEventHandler } from "../types";

export interface IUIUserInteractions {
    init(): void;
}

export interface IUIMover extends IMover {
    speed: number;
    move(player: IPlayer, board: IBoard): void;
    turnRight(player: IPlayer, board: IBoard): void;
    restart(): void;
    wireEventHandlers(player: IPlayer, board: IBoard, createEventer: (events: IUIEvents) => IUIUserInteractions): IUIEvents;
}


export interface IUIEvents {
    moveHandlers: ISignalHandler[],
    turnHandlers: ISignalHandler[],
    lightHandlers: ISimpleEventHandler<{ lightsOn: boolean, showWholeBoard: boolean }>[],
    saveMapHandlers: ISignalHandler[],
    resetHandlers: ISimpleEventHandler<{ newMap: boolean, resetPlayer: boolean }>[]
}