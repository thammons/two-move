import { BoardComponent } from "./_web/components/board/board";
import { KeyboardHandlers } from "./_web/components/board/events/keyboard-handlers";
import * as Map from "./maps/map-functions";
import { IMap } from "./maps/types";
import { UserMover } from "./movers/user-mover";

window.addEventListener("load", () => {
    let boardComponent = document.querySelector(
        "two-move-board"
    ) as BoardComponent;
    let mapInstance = new MapInstance(Map.getMap());
    boardComponent.populateCells(mapInstance.map);
    boardComponent.render();
    const playerMover = new UserMover();
    const playerActions = new KeyboardHandlers();

    setInterval(() => {
        boardComponent.updateCells(
            mapInstance.setMap(
                // torch.UpdateMap(playerActions.getTorchArgs(),
                playerMover.getNextMove(
                    playerActions.NextMove,
                    mapInstance.getMap() //playerActions.ResetArgs)
                )
            )
            //)
        );
    }, 150);
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
    setMap = (newMap: IMap) => {
        return (this.map = newMap);
    };
}
