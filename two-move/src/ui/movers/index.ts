import { IMoverCreatorParams } from "../../types";
import { ButtonInteractions, KeyboardInteractions } from "..";
import { IUIEvents, IUIMover } from "../types";
import { UIMover } from "./ui-mover";

export function getKeyboardMover(args: IMoverCreatorParams): IUIMover {
    const createEventer = (_events: IUIEvents) => new KeyboardInteractions([_events, args.attachEvents]);
    const mover = new UIMover(args.speed);
    mover.wireEventHandlers(args.player, args.board, createEventer);
    return mover;
}

export function getButtonMover(args: IMoverCreatorParams): IUIMover {
    const createEventer = (_events: IUIEvents) => new ButtonInteractions([_events, args.attachEvents]);
    const mover = new UIMover(args.speed);
    mover.wireEventHandlers(args.player, args.board, createEventer);
    return mover;
}

