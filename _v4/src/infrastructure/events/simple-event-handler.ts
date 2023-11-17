import { Handlers, IHandler } from "./generic-handler";

export interface ISimpleEventHandler<TArgs> extends IHandler<TArgs> {
    (args: TArgs): TArgs;
}

export class SimpleEventHandlers<TArgs> extends Handlers<TArgs, ISimpleEventHandler<TArgs>> { }