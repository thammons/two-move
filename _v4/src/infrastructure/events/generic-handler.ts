export type HandlerPriorityType = 'first' | 'middle' | 'last';

const sortPriority = (a: HandlerPriorityType, b: HandlerPriorityType) => {
    return a === b ? 0
        : a === 'first' ? -1
            : a === 'last' ? 1
                : 0;
};

export interface IHandler<TArgs> {
    (args: TArgs): TArgs;
}


interface IOwnedHandler<TArgs, T extends IHandler<TArgs>> {
    owner: any;
    priority: HandlerPriorityType;
    handler: T;
}

interface IOwnedHandlers<TArgs, T extends IHandler<TArgs>> {
    [key: string]: IOwnedHandler<TArgs, T>[];
}

export class Handlers<TArgs, T extends IHandler<TArgs>> {
    private ownedHandlers: IOwnedHandlers<TArgs, T> = {};

    subscribe(eventName: string, owner: any, handler: T, priority?: HandlerPriorityType) {
        if (!this.ownedHandlers[eventName]) {
            this.ownedHandlers[eventName] = [];
        }
        this.ownedHandlers[eventName].push({ owner, priority: priority || 'middle', handler });
        //chainable
        return this;
    }

    unsubscribe(owner: any, eventName?: string) {
        if (eventName) {
            if (this.ownedHandlers[eventName]) {
                this.ownedHandlers[eventName] = this.ownedHandlers[eventName].filter(h => h.owner !== owner);
            }
        } else {
            Object.keys(this.ownedHandlers).forEach(eventName => {
                this.ownedHandlers[eventName] = this.ownedHandlers[eventName].filter(h => h.owner !== owner);
            });
        }
        //chainable
        return this;
    }

    trigger(eventName: string, args: TArgs) {
        if (this.ownedHandlers[eventName]) {
            const orderedHandlers = this.ownedHandlers[eventName].sort((a, b) => sortPriority(a.priority, b.priority));

            let nextArgs = args;
            for (let handler of orderedHandlers) {
                nextArgs = handler.handler(nextArgs);
            }
        }
    }

    has(eventName: string) {
        return this.ownedHandlers[eventName] && this.ownedHandlers[eventName].length > 0;
    }
}