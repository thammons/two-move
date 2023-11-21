import { BoardDisplay } from "./_web/components/board/board";
import { KeyboardHandlers } from "./_web/components/board/events/keyboard-handlers";
import * as Map from "./maps";
import { IMap } from "./maps";
import { UserMover } from "./movers/user-mover";

window.addEventListener("load", () => {

    let mapInstance = new MapInstance(Map.getMap());
    let boardDisplay = new BoardDisplay(mapInstance.map);

    const playerMover = new UserMover();
    const playerActions = new KeyboardHandlers();

    setInterval(() => {
        //TODO: Figure out handling win condition
        boardDisplay.updateCells(
            mapInstance.setMap(
                // torch.UpdateMap(playerActions.getTorchArgs(),
                playerMover.getNextMove(
                    playerActions.NextMove,
                    mapInstance.getMap(
                        playerActions.ResetArgs ? true : false,
                        playerActions.ResetArgs?.newMap ?? false
                    )
                )
            )
            //)
        );
    }, 150);
});

class MapInstance {
    private _originalMap: IMap;
    private _map: IMap;
    private _updateNumber: number = 0;

    constructor(map: IMap) {
        this._originalMap = Map.cloneMap(map);
        this._map = map;
    }

    get map() {
        return this._map;
    }
    
    set map(newMap: IMap) {
        this._updateNumber++;
        this._map = newMap;
    }

    getMap(restart: boolean, newMap: boolean) {
        if (restart) {
            this._map = Map.cloneMap(this._originalMap);
        } else if (newMap) {
            //this._map = Map.getNextMap();
        }
        return this.map;
    }

    setMap(newMap: IMap) {
        return (this.map = newMap);
    }
}
