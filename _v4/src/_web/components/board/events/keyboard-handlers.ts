import { UserEventHandler } from "../../../../infrastructure/events/user-events";

export class KeyboardHandlers {
    private firing: string[] = [];
    private keydownHandlers: { [key: string]: (key: KeyboardEvent, handler: UserEventHandler) => void } = {
        'ArrowUp': (key: KeyboardEvent, handler: UserEventHandler) => {
            key.preventDefault();
            handler.triggerMoveForward();
        },
        'ArrowDown': (key: KeyboardEvent, handler: UserEventHandler) => {
            key.preventDefault();
            handler.triggerMoveForward();
        },
        'w': (_, handler: UserEventHandler) => {
            handler.triggerMoveForward();
        },
        's': (_, handler: UserEventHandler) => {
            handler.triggerMoveForward();
        },
        'ArrowLeft': (key: KeyboardEvent, handler: UserEventHandler) => {
            key.preventDefault();
            handler.triggerTurn();
        },
        'ArrowRight': (key: KeyboardEvent, handler: UserEventHandler) => {
            key.preventDefault();
            handler.triggerTurn();
        },
        'a': (_, handler: UserEventHandler) => {
            handler.triggerTurn();
        },
        'd': (_, handler: UserEventHandler) => {
            handler.triggerTurn();
        },
        'f': (_, handler: UserEventHandler) => {
            handler.triggerFlashlight({ isOn: true });
        },
        'e': (_, handler: UserEventHandler) => {
            handler.triggerFlashlight({ isOn: true, powerLevel: 0 });
        },
        't': (_, handler: UserEventHandler) => {
            handler.triggerReset({ newMap: true });
        }
    };

    setupHandlers(handler: UserEventHandler) {
        document.addEventListener('keydown', (e) => {
            if (this.firing.indexOf(e.key) > -1) {
                return;
            }
            if (this.keydownHandlers[e.key]) {
                this.keydownHandlers[e.key](e, handler);
                this.firing.push(e.key);
            }
        });

        document.addEventListener('keyup', (e) => {
            this.firing = this.firing.filter(k => k !== e.key);
            if (e.key === 'f') {
                handler.triggerFlashlight({ isOn: false });
            }
            if (e.key === 'e') {
                handler.triggerFlashlight({ isOn: false });
            }
        });
    }
}