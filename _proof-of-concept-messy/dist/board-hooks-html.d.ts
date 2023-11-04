import { Direction, IBoardHooks, ICell, IPlayer, ItemLocation } from './types.js';
export default class BoardHooksHtml implements IBoardHooks {
    _scoreBoard: ScoreBoard;
    _events: {
        cellType: string;
        event: () => void;
    }[];
    constructor(_events?: {
        cellType: string;
        event: () => void;
    }[]);
    validStep(player: IPlayer, previousLocation: ItemLocation, cell: ICell): void;
    invalidStep(player: IPlayer, cell: ICell, direction: Direction): void;
}
declare class ScoreBoard {
    level: number;
    score: number;
    collisions: number;
    constructor();
    updateScore(score: number): void;
    updateLevel(level: number): void;
    updateCollisions(collisions: number): void;
    printScoreboard(): void;
}
export {};
//# sourceMappingURL=board-hooks-html.d.ts.map