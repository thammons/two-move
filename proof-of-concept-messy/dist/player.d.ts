import { Direction, ItemLocation, IPlayer, CellType, PlayerIndicator } from './types.js';
declare class Player implements IPlayer {
    cellType: CellType;
    direction: Direction;
    indicator: PlayerIndicator;
    location: ItemLocation;
    boardWidth: number;
    constructor(startLocation: ItemLocation, boardWidth: number, direction?: Direction);
    getPlayerLocation(): ItemLocation;
    turnRight(): void;
    getIndicator(direction: Direction): PlayerIndicator;
    setNextLocation(): void;
    getNextMove(): ItemLocation;
    _getEast(playerIndex: ItemLocation): ItemLocation;
    _getWest(playerIndex: ItemLocation): ItemLocation;
    _getNorth(playerIndex: ItemLocation): ItemLocation;
    _getSouth(playerIndex: ItemLocation): ItemLocation;
}
export default Player;
//# sourceMappingURL=player.d.ts.map