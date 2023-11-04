declare function populateHighScore(): void;
interface IScoreStoreItem {
    playerName: string;
    level: number;
    score: number;
    collisions: number;
}
declare function getHighscores(): IScoreStoreItem[] | undefined;
//# sourceMappingURL=highscore.d.ts.map