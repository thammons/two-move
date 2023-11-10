import { Direction, IBoardHooks, ICell, IPlayer, ItemLocation } from './types.js';
import * as utils from './ui-utils-html.js';

export default class BoardHooksHtml implements IBoardHooks {
    _scoreBoard = new ScoreBoard();
    _events = [
        {
            cellType: 'goal', event: () => {
                utils.showWinMessage();
                this._scoreBoard.updateLevel(this._scoreBoard.level + 1);
            }
        },
    ]

    constructor(_events?: { cellType: string, event: () => void }[]) {
        _events?.forEach(event => {
            this._events.push(event);
        });
    }

    validStep(player: IPlayer, previousLocation: ItemLocation, cell: ICell): void {
        utils.showLastMove(player.direction, previousLocation !== player.location);
        this._scoreBoard.updateScore(this._scoreBoard.score + 1);
        this._events.forEach(event => {
            if (cell.mapItems.some(mi => mi.cellType == event.cellType)) {
                event.event();
            }
        });
    }

    invalidStep(player: IPlayer, cell: ICell, direction: Direction): void {
        utils.showCollisionMessage();
        this._scoreBoard.updateCollisions(this._scoreBoard.collisions + 1);
    };

}

interface IScoreStoreItem {
    playerName: string;
    level: number;
    score: number;
    collisions: number;
};

class ScoreBoard {
    level = 1;
    score = 0;
    collisions = 0;

    constructor() {
        //todo - prompt name?
        
        //TODO move this to dataaccess, call it by callers of printScoreboard()
        const storedScore = window.localStorage.getItem('score');
        if (storedScore) {
            const { level, score, collisions } = JSON.parse(storedScore);
            this.level = level;
            this.score = score;
            this.collisions = collisions;
        }
    }

    updateScore(score: number) {
        this.score = score;
        this.printScoreboard();
    }
    updateLevel(level: number) {
        this.level = level;
        this.printScoreboard();
    }
    updateCollisions(collisions: number) {
        this.collisions = collisions;
        this.printScoreboard();
    }
    printScoreboard() {
        const scoreboard = document.getElementById('scoreboard');
        if (!scoreboard) {
            //console.error('scoreboard not found');
            return;
        }
        const levelDiv = document.createElement('div');
        levelDiv.style.color = 'white';
        levelDiv.innerHTML = `Level: ${this.level}`

        const scoreDiv = document.createElement('div');
        scoreDiv.style.color = 'green';
        scoreDiv.innerHTML = `Score: ${this.score}`

        const collisionsDiv = document.createElement('div');
        collisionsDiv.style.color = 'red';
        collisionsDiv.innerHTML = `Collisions: ${this.collisions}`

        scoreboard.innerHTML = '';
        scoreboard.appendChild(levelDiv);
        scoreboard.appendChild(scoreDiv);
        scoreboard.appendChild(collisionsDiv);

        //TODO move this to dataaccess, call it by callers of printScoreboard()
        const scoreObj: IScoreStoreItem = {
            playerName: 'Player Name',
            level: this.level,
            score: this.score,
            collisions: this.collisions
        };
        window.localStorage.setItem('score', JSON.stringify(scoreObj));

    }

}