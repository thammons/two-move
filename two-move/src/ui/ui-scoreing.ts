import { IScoreItem } from "../scoreing";


export function printScoreboard(score:IScoreItem) {
    const scoreboard = document.getElementById('scoreboard');
    if (!scoreboard) {
        //console.error('scoreboard not found');
        return;
    }
    const levelDiv = document.createElement('div');
    levelDiv.style.color = 'white';
    levelDiv.innerHTML = `Level: ${score.level}`

    const scoreDiv = document.createElement('div');
    scoreDiv.style.color = 'green';
    scoreDiv.innerHTML = `Score: ${score.score}`

    const collisionsDiv = document.createElement('div');
    collisionsDiv.style.color = 'red';
    collisionsDiv.innerHTML = `Collisions: ${score.collisions}`

    scoreboard.innerHTML = '';
    scoreboard.appendChild(levelDiv);
    scoreboard.appendChild(scoreDiv);
    scoreboard.appendChild(collisionsDiv);

}