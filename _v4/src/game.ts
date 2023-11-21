import { BoardDisplay } from "./_web/components/board/board";
import { KeyboardHandlers } from "./_web/components/board/events/keyboard-handlers";
import * as Map from "./maps";
import { IMap } from "./maps";
import { UserMover } from "./movers/user-mover";

const mapSettings: Map.IMapGeneratorSettings = {
    height: 20,
    width: 20,
    playerStartLocation: 0,
    playerStartDirection: "east",
};

window.addEventListener("load", () => {
    let mapInstance = new MapInstance(Map.getNextMap(mapSettings));
    let boardDisplay = new BoardDisplay(mapInstance.map);

    const playerMover = new UserMover();
    const playerActions = new KeyboardHandlers();

    setInterval(() => {
        const resetArgs = playerActions.ResetArgs;
        if (resetArgs !== undefined) console.log("resetargs", resetArgs);
        //TODO: Figure out handling win condition
        boardDisplay.updateCells(
            mapInstance.setMap(
                // torch.UpdateMap(playerActions.getTorchArgs(),
                playerMover.getNextMove(
                    playerActions.NextMove,
                    mapInstance.getMap(
                        resetArgs ? true : false,
                        resetArgs?.newMap ?? false
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
        if (newMap) {
            this._map = Map.getNextMap(mapSettings);
        } else if (restart) {
            this._map = Map.cloneMap(this._originalMap);
        }
        return this.map;
    }

    setMap(newMap: IMap) {
        let nextMap = newMap;

        if (Map.checkPlayerGoal(newMap)) {
            const player = newMap.mapItems.get("player")![0];
            mapSettings.playerStartLocation = player.location;
            mapSettings.playerStartDirection = player.direction;
            nextMap = Map.getNextMap(mapSettings);
        }

        return (this.map = nextMap);
    }
}
