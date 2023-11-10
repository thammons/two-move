
/* uncomment this to see the rest run */
//populateHighScore();

function populateHighScore() {
    const highScore1 = document.getElementsByClassName('highscore1')[0];
    // const highScore2 = document.getElementsByClassName('highscore2')[0];
    // const highScore3 = document.getElementsByClassName('highscore3')[0];
    // const highScore4 = document.getElementsByClassName('highscore4')[0];
    /* //TODO: Lucas: add highscore 5 */

    const highScores = getHighscores();

    /* make sure highScore exists AND is an array AND has at least one item */
    const highScoreHasValue = highScores !== undefined && Array.isArray(highScores) && highScores.length > 0;

    if (highScoreHasValue) {
       /* sort the scores largest to smallest */
        highScores.sort((a, b) => a.score < b.score ? 1 : -1);

        /* populate the highscore values, indexing off the array */
        highScore1.innerHTML = `${highScores[0].playerName} - ${highScores[0].score}`;
        // highScore2.innerHTML = `${highScores[1].playerName} - ${highScores[1].score}`;
        // highScore3.innerHTML = `${highScores[2].playerName} - ${highScores[2].score}`;
        // highScore4.innerHTML = `${highScores[3].playerName} - ${highScores[3].score}`;
        /* //TODO: Lucas: add highscore 5 */
    }
    /* //if there is no highscore */
    else {
        /* set the highest score to default */
        highScore1.innerHTML = 'No scores yet!';
        // clear the other values
        // highScore2.innerHTML = '';
        // highScore3.innerHTML = '';
        // highScore4.innerHTML = '';
        /* //TODO: Lucas: add highscore 5 */
    }

    /* 
    //TODO: Lucas: notes
        There are several easier ways to implement this method
        try looping
        try function extraction
        ask questions :)
    */
}


//More typescriot stuff
interface IScoreStoreItem {
    playerName: string;
    level: number;
    score: number;
    collisions: number;
};

function getHighscores(): IScoreStoreItem[] | undefined {
    let parsedHighscore: IScoreStoreItem[] | undefined;
    parsedHighscore = undefined;

    //retreive from local storage
    //To View:
    //  in the browser, F12 opens the dev tools
    //  in the dev tools, there is a tab called "Application"
    //  in the application tab, there is a section called "Storage"
    //  in the storage section, there is a subsection called "Local Storage"
    //  after playing a game, there should be a key "highscore"
    const highscore: string | null = localStorage.getItem('highscore');

    //if an item is successfully retreived...
    if (highscore != null) {
        //...parse it into a typed object
        parsedHighscore = JSON.parse(highscore) as IScoreStoreItem[];
    }

    // return the parsed object, or undefined
    return parsedHighscore;
}