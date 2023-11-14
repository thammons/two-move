
export interface IHandler<TArgs> {
    (args:TArgs): void
}


interface IOwnedHandler<TArgs, T extends IHandler<TArgs>> {
    owner: any;
    handler: T;
}

interface IOwnedHandlers<TArgs, T extends IHandler<TArgs>> {
    [key: string]: IOwnedHandler<TArgs, T>[];
}

export class Handlers<TArgs, T extends IHandler<TArgs>> {
    private ownedHandlers: IOwnedHandlers<TArgs, T> = {};

    subscribe(eventName: string, owner:any, handler: T) {
        if (!this.ownedHandlers[eventName]) {
            this.ownedHandlers[eventName] = [];
        }
        this.ownedHandlers[eventName].push({owner, handler});
        //chainable
        return this;
    }

    unsubscribe(owner:any, eventName?: string) {
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
            this.ownedHandlers[eventName].forEach(handler => handler.handler(args));
        }
    }

    has(eventName: string) {
        return this.ownedHandlers[eventName] && this.ownedHandlers[eventName].length > 0;
    }
}