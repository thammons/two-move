import { Handlers, IHandler } from "./generic-handler";

export interface EventHandlerArgs<TSender, TArgs> {
    sender: TSender;
    args: TArgs;
}

export interface IEventHandler<TSender, TArgs> extends
    IHandler<EventHandlerArgs<TSender, TArgs>> {
    (args: EventHandlerArgs<TSender, TArgs>): void
}


export class EventHandlers<TSender, TArgs> extends
    Handlers<EventHandlerArgs<TSender, TArgs>, IEventHandler<TSender, TArgs>> { }