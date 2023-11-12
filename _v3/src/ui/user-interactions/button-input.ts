import { UIEvents } from '../ui-user-events';
import { IUIEvents, IUIUserInteractions } from '../types';


export class ButtonInteractions implements IUIUserInteractions {
    private _events: UIEvents;
    constructor(events: IUIEvents[]) {
        this._events = new UIEvents();
        this._events.moveHandlers = events.flatMap(e => e.moveHandlers);
        this._events.turnHandlers = events.flatMap(e => e.turnHandlers);
        this._events.lightHandlers = events.flatMap(e => e.lightHandlers);
        this._events.saveMapHandlers = events.flatMap(e => e.saveMapHandlers);
        this._events.resetHandlers = events.flatMap(e => e.resetHandlers);

        this.init();
    }

    init() {
        const moveBtn = document.getElementById('move-btn');
        if (!!moveBtn)
            moveBtn.onclick = () => this._events.triggerMove();

        const turnBtn = document.getElementById('turn-btn');
        if (!!turnBtn)
            turnBtn.onclick = () => this._events.triggerTurn();

        //TODO: This doesn't cover map progression
        const restartBtn = document.getElementById('restart-btn');
        if (!!restartBtn)
            restartBtn.onclick = () => this._events.triggerReset({ newMap: false, resetPlayer: true });
    }

}