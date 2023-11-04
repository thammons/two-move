import { ItemLocation, Direction, IBoard, ICell } from '../types.js';
export declare class BoardValidation {
    static isNextMoveOnMap: (startPosition: ItemLocation, direction: Direction, boardWidth: number, boardHeight: number) => boolean;
    static isBlocked: (currentPosition: ItemLocation, nextPosition: ItemLocation, board: IBoard) => boolean;
    static locationsVisibleToPlayer(playerLocation: ItemLocation, distanceToPlayer: number, cells: ICell[], boardWidth: number, boardHeight: number): ItemLocation[];
    static isInBounds(desiredLocation: ItemLocation, boardWidth: number, boardHeight: number): boolean;
    static isMaxEast(playerLocation: ItemLocation, distanceToPlayer: number, boardWidth: number): boolean;
    static isMaxWest(playerLocation: ItemLocation, distanceToPlayer: number, boardWidth: number): boolean;
    static isNextToPlayer(position: ItemLocation, playerLocation: ItemLocation, distanceToPlayer: number, boardWidth: number, boardHeight: number): boolean;
    static isAtGoal(desiredLocation: ItemLocation, board: IBoard): boolean;
}
//# sourceMappingURL=validation.d.ts.map