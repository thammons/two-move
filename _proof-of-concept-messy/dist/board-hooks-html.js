import * as utils from './ui-utils-html.js';
export default class BoardHooksHtml {
    _scoreBoard = new ScoreBoard();
    _events = [
        {
            cellType: 'goal', event: () => {
                utils.showWinMessage();
                this._scoreBoard.updateLevel(this._scoreBoard.level + 1);
            }
        },
    ];
    constructor(_events) {
        _events?.forEach(event => {
            this._events.push(event);
        });
    }
    validStep(player, previousLocation, cell) {
        utils.showLastMove(player.direction, previousLocation !== player.location);
        this._scoreBoard.updateScore(this._scoreBoard.score + 1);
        this._events.forEach(event => {
            if (cell.mapItems.some(mi => mi.cellType == event.cellType)) {
                event.event();
            }
        });
    }
    invalidStep(player, cell, direction) {
        utils.showCollisionMessage();
        this._scoreBoard.updateCollisions(this._scoreBoard.collisions + 1);
    }
    ;
}
;
class ScoreBoard {
    level = 1;
    score = 0;
    collisions = 0;
    constructor() {
        const storedScore = window.localStorage.getItem('score');
        if (storedScore) {
            const { level, score, collisions } = JSON.parse(storedScore);
            this.level = level;
            this.score = score;
            this.collisions = collisions;
        }
    }
    updateScore(score) {
        this.score = score;
        this.printScoreboard();
    }
    updateLevel(level) {
        this.level = level;
        this.printScoreboard();
    }
    updateCollisions(collisions) {
        this.collisions = collisions;
        this.printScoreboard();
    }
    printScoreboard() {
        const scoreboard = document.getElementById('scoreboard');
        if (!scoreboard) {
            return;
        }
        const levelDiv = document.createElement('div');
        levelDiv.style.color = 'white';
        levelDiv.innerHTML = `Level: ${this.level}`;
        const scoreDiv = document.createElement('div');
        scoreDiv.style.color = 'green';
        scoreDiv.innerHTML = `Score: ${this.score}`;
        const collisionsDiv = document.createElement('div');
        collisionsDiv.style.color = 'red';
        collisionsDiv.innerHTML = `Collisions: ${this.collisions}`;
        scoreboard.innerHTML = '';
        scoreboard.appendChild(levelDiv);
        scoreboard.appendChild(scoreDiv);
        scoreboard.appendChild(collisionsDiv);
        const scoreObj = {
            playerName: 'Player Name',
            level: this.level,
            score: this.score,
            collisions: this.collisions
        };
        window.localStorage.setItem('score', JSON.stringify(scoreObj));
    }
}
//# sourceMappingURL=board-hooks-html.js.map