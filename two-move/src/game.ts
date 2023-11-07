import MapGenerated from "./maps/generate-map1";
import { IGameOptions, IPlayer } from "./types";
import { getKeyboardMover } from "./ui/movers";
import { onload } from './two-move'

const GameOptions: IGameOptions = {
    useMover: false,
    moverType: 'wall-follower',
    moverSpeed: 150,
    uiMoverCreators: [getKeyboardMover],
    getNextMap: (player: IPlayer) => new MapGenerated(player?.getPlayerLocation() ?? 0)
}

onload(GameOptions);