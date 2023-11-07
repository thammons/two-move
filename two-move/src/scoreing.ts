

export interface IScoreItem {
    playerName: string;
    level: number;
    score: number;
    collisions: number;
};


export class ScoreBoard implements IScoreItem {
    playerName: string = "Player Name";
    level: number = 1;
    score: number = 0;
    collisions: number = 0;

    constructor(score: IScoreItem | undefined) {
        if (!!score) {
            this.level = score.level;
            this.score = score.score;
            this.collisions = score.collisions;
        }
    }

    updateLevel(level?: number) {
        this.level = level ?? this.level + 1;
    }
    updateScore(score?: number) {
        this.score = score ?? this.score + 1;
    }
    updateCollisions(collisions?: number) {
        this.collisions = collisions ?? this.collisions + 1;
    }

    //TODO move this to dataaccess, call it by callers of printScoreboard()
    static saveScore(score: IScoreItem) {
        window.localStorage.setItem('score', JSON.stringify(score));
    }

    static loadScore(): IScoreItem | undefined {
        const storedScore = window.localStorage.getItem('score');

        if (!storedScore)
            return undefined;
        return JSON.parse(storedScore);
    }

}