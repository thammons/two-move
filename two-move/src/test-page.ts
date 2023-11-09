import MapGenerated from "./maps/generate-map1";
import { IGameOptions, IPlayer } from "./types";
import { getKeyboardMover } from "./ui/movers";
import { onload } from './two-move'
import { getMover, MoverNames } from "./player-movers";
import { MapNames } from "./maps";

import * as UITestPage from './ui/ui-test-page';

const GameOptions: IGameOptions = {
    moverSpeed: 150,
    moverCreators: [getKeyboardMover],// () => getMover('pacer', 500)!],
    getNextMap: (player: IPlayer) => new MapGenerated(player?.getPlayerLocation() ?? 0),
    lightsout: false,
    preservePlayerDirection: true,
    fadeOnReset: false,
}

onload(GameOptions);

UITestPage.init(MapNames, MoverNames);