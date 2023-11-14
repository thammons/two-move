import { Handlers, IHandler } from "./generic-handler";

export interface ISignalHandler extends IHandler<void> {
    (): void;
}


export class SignalHandlers extends Handlers<void, ISignalHandler> { }