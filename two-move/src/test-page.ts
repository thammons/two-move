import MapGenerated from "./maps/generate-map1";
import { IGameOptions, IPlayer } from "./types";
import { getKeyboardMover } from "./ui/movers";
import { onload } from './two-move'
import { getMover, MoverNames } from "./player-movers";
import { MapNames, MapType, getMap } from "./maps";

import * as UITestPage from './ui/ui-test-page';
import { ITestPageEventHandlers } from "./ui/ui-test-page-events";

let defaultOptions: UITestPage.ITestPageOptions = {
    height: 50,
    width: 50,
    cellSize: 10,
    difficulty: 10,
    mapName: 'generated',
    moverType: 'keyboard',
    moverSpeed: 150,
};

const GameOptions: IGameOptions = {
    moverSpeed: 150,
    moverCreators: [getKeyboardMover],// () => getMover('pacer', 500)!],
    getNextMap: (player: IPlayer) => getMap(
        defaultOptions.mapName as MapType, {
        boardHeight: defaultOptions.height,
        boardWidth: defaultOptions.width,
        cellWidth: defaultOptions.cellSize,
        difficulty: defaultOptions.difficulty / 10,
        playerLocation: player?.getPlayerLocation() ?? 0,
    })!,
    lightsout: false,
    preservePlayerDirection: true,
    fadeOnReset: false,
};

onload(GameOptions);

const testHandlers: ITestPageEventHandlers = {
    //TODO: put a lag on this, so it doesn't update on every change
    settingsChangeHanders: [
        (setting) => {
            console.log("setting changed", setting);
            //TODO: update setting, reload Board
        }
    ]
};

UITestPage.init(MapNames, MoverNames, defaultOptions, testHandlers);