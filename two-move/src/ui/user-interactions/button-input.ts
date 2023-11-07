import { IUIEvents, UIEvents } from '../ui-user-events';
import { IUIUserInteractions } from './types';


export class ButtonInteractions implements IUIUserInteractions {
    private _events: UIEvents;
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
        const moveBtn = document.getElementById('move-btn');
        if (!!moveBtn)
            moveBtn.onclick = () => this._events.triggerMove;

        const turnBtn = document.getElementById('turn-btn');
        if (!!turnBtn)
            turnBtn.onclick = () => this._events.triggerTurn;

        //TODO: This doesn't cover map progression
        const restartBtn = document.getElementById('restart-btn');
        if (!!restartBtn)
            restartBtn.onclick = () => this._events.triggerReset({ newMap: false, resetPlayer: true });
    }

}