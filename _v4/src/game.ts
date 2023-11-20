
import { BoardComponent } from "./_web/components/board/board";
import { KeyboardHandlers } from "./_web/components/board/events/keyboard-handlers";
import { UserEventHandler } from "./infrastructure/events/user-events";
import * as Map from "./maps/map-functions";
import { IMap } from "./maps/types";
import { UserMover } from "./movers/user-mover";

window.addEventListener('load', () => {
    let boardComponent = document.querySelector('two-move-board') as BoardComponent;
    let mapInstance = new MapInstance(Map.getMap());
    boardComponent.populateCells(mapInstance.map);
    boardComponent.render();
    const userHandler = new UserEventHandler();
    const playerMover = new UserMover();

    //TODO: Wire board events to the user handler
    //TODO: Optimize these to JUST update the cell that needs to be updated
    setupMoverEvents(playerMover, playerMover, userHandler, mapInstance.getMap, mapInstance.setMap);
    addUIUserHandlers(boardComponent, playerMover, userHandler, mapInstance.getMap);


    new KeyboardHandlers().setupHandlers(userHandler);
});

class MapInstance {
    private _map: IMap;
    private _updateNumber: number = 0;
    constructor(map: IMap) {
        this._map = map;
    }
    get map() {
        return this._map;
    }
    set map(newMap: IMap) {
        this._updateNumber++;
        this._map = newMap;
    }

    getMap = () => this.map;
    setMap = (newMap: IMap) => this.map = newMap;

}

function addUIUserHandlers(boardComponent: BoardComponent, obj: any, userHandler: UserEventHandler, getMap: () => IMap) {
    userHandler.subscribeMoveForward(obj, () => {
        boardComponent.populateCells(getMap());
        boardComponent.updateCells();
    }, 'last');

    userHandler.subscribeTurn(obj, () => {
        boardComponent.populateCells(getMap());
        boardComponent.updateCells();
    }, 'last');
}


function setupMoverEvents(mover: UserMover, obj: any, handlers: UserEventHandler, getMap: () => IMap, setMap: (map: IMap) => void) {

    handlers
        .subscribeMoveForward(obj, (): void => {
            const newMap = mover.move(getMap());
            setMap(newMap);
        })
        .subscribeTurn(obj, (): void => {
            const newMap = mover.turn(getMap());
            setMap(newMap);
        })
        ;
}

function resetGame(obj: any, handlers: UserEventHandler) {
    handlers.unsubscribe(obj);
}