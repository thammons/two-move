import { UIEvents } from '../ui-user-events';
import { IUIEvents, IUIUserInteractions } from '../types';


export class KeyboardInteractions implements IUIUserInteractions {
    private _events: UIEvents;
    private _keydownEvents: Map<string, Function> = new Map([
        ['ArrowUp', () => this._events.triggerMove()],
        ['ArrowDown', () => this._events.triggerMove()],
        ['w', () => this._events.triggerMove()],
        ['s', () => this._events.triggerMove()],

        ['ArrowLeft', () => this._events.triggerTurn()],
        ['ArrowRight', () => this._events.triggerTurn()],
        ['d', () => this._events.triggerTurn()],
        ['a', () => this._events.triggerTurn()],

        ['f', () => this._events.triggerLight({ lightsOn: true, showWholeBoard: false })],
        ['e', () => this._events.triggerLight({ lightsOn: true, showWholeBoard: true })],

        ['r', () => this._events.triggerReset({ newMap: true, resetPlayer: false })],
        ['!', () => this._events.triggerSaveMap()],
    ]);

    private _keyupEvents: Map<string, Function> = new Map([
        ['f', () => this._events.triggerLight({ lightsOn: false, showWholeBoard: false })],
        ['e', () => this._events.triggerLight({ lightsOn: false, showWholeBoard: false })],
    ]);

    constructor(events: IUIEvents) {
        this._events = new UIEvents();
        this._events.moveHandlers = events.moveHandlers;
        this._events.turnHandlers = events.turnHandlers;
        this._events.lightHandlers = events.lightHandlers;
        this._events.saveMapHandlers = events.saveMapHandlers;
        this._events.resetHandlers = events.resetHandlers;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if (this._keydownEvents.has(keyName)) {
                this._keydownEvents.get(keyName)!();
            }
        });

        document.addEventListener('keyup', (event) => {
            const keyName = event.key;
            if (this._keyupEvents.has(keyName)) {
                this._keyupEvents.get(keyName)!();
            }
        });
    }



}