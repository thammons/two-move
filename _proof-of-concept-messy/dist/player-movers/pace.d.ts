import { Direction, IBoard, IMap, IMove, IMover, IPlayer, ItemLocation } from "../types.js";
export declare class PaceMover implements IMover {
    directionMap: Map<Direction, Direction>;
    moves: IMove[];
    previousMove: IMove | undefined;
    getNextMove(player: IPlayer, board: IBoard): IMove;
    generateMoves(player: IPlayer, map: IMap, numberToGenerate: number): IMove[];
    getNextLocation(currentLocation: ItemLocation, direction: Direction, boardWidth: number): number;
    getNextDirection(direction: Direction): Direction;
    getNextValidMove(location: ItemLocation, direction: Direction, map: IMap): IMove;
    isValidMove(direction: Direction, startLocation: ItemLocation, desiredLocation: ItemLocation, map: IMap): boolean;
}
//# sourceMappingURL=pace.d.ts.map