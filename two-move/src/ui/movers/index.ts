import { IBoard, IPlayer } from "../../types";
import { ButtonInteractions, KeyboardInteractions } from "..";
import { IUIEvents, IUIMover } from "../types";
import { UIMover } from "./ui-mover";

export function getKeyboardMover(speed: number, player: IPlayer, board: IBoard): IUIMover {
    const mover = new UIMover(speed);
    const createEventer = (events: IUIEvents) => new KeyboardInteractions(events);
    mover.wireEventHandlers(player, board, createEventer);
    return mover;
}

export function getButtonMover(speed: number, player: IPlayer, board: IBoard): IUIMover {
    const mover = new UIMover(speed);
    const createEventer = (events: IUIEvents) => new ButtonInteractions(events);
    mover.wireEventHandlers(player, board, createEventer);
    return mover;
}

