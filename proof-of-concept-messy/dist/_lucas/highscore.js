"use strict";
function populateHighScore() {
    const highScore1 = document.getElementsByClassName('highscore1')[0];
    const highScores = getHighscores();
    const highScoreHasValue = highScores !== undefined && Array.isArray(highScores) && highScores.length > 0;
    if (highScoreHasValue) {
        highScores.sort((a, b) => a.score < b.score ? 1 : -1);
        highScore1.innerHTML = `${highScores[0].playerName} - ${highScores[0].score}`;
    }
    else {
        highScore1.innerHTML = 'No scores yet!';
    }
}
;
function getHighscores() {
    let parsedHighscore;
    parsedHighscore = undefined;
    const highscore = localStorage.getItem('highscore');
    if (highscore != null) {
        parsedHighscore = JSON.parse(highscore);
    }
    return parsedHighscore;
}
//# sourceMappingURL=highscore.js.map