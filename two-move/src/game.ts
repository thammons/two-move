import MapGenerated from "./maps/generate-map1";
import { IGameOptions, IPlayer } from "./types";
import { getKeyboardMover } from "./ui/movers";
import { onload } from './two-move'
import { getMover } from "./player-movers";

const GameOptions: IGameOptions = {
    moverSpeed: 150,
    moverCreators: [getKeyboardMover, () => getMover('pacer', 500)!],
    getNextMap: (player: IPlayer) => new MapGenerated(player?.getPlayerLocation() ?? 0)
}

onload(GameOptions);