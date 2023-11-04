var BOARD = [];
const BOARD_WIDTH = 10;
const BOARD_SIZE = BOARD_WIDTH * BOARD_WIDTH;

const CLASS_WALL = 'wall';
const CLASS_PLAYER = 'player';
const CLASS_GOAL = 'goal';

window.onload = () => {
    const blankBoard = Array(BOARD_SIZE).fill({ indicator: ' ', class: '' });
    BOARD = blankBoard;

    const random = Math.floor(Math.random() * BOARD_SIZE);
    // const playerStartLocation = random;
    const playerStartLocation = 0;
    BOARD[playerStartLocation] = { indicator: '>', class: CLASS_PLAYER };

    setWallsMap1();

    paintBoard(100);
    setTimeout(() => {
        player.autoPlay();
    }, 1_000);
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    switch (keyName) {
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'a':
        case 'd':
            player.turnRight();
            break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'w':
        case 's':
            player.move();
            break;
    }

    paintBoard();

});

function paintBoard(loadTimer = 0) {

    const templateBodyGrid = document.getElementById('grid-container-items');
    templateBodyGrid.innerHTML = '';
    BOARD.forEach((cell, index) => {
        const element = document.createElement('div');

        element.className = 'grid-item';
        if (!!cell.class)
            element.className += ` ${cell.class}`;

        element.innerText = cell.indicator;

        element.style.opacity = 0;

        templateBodyGrid.appendChild(element);

        if (loadTimer > 0) {
            unfade(element, loadTimer);
        }

        element.style.opacity = 1;

    });
    // console.log('player location', playerLocation);
};

function setWallsMap1() {
    const walls = [
       /*  0, */  1, /*  2,      3,      4,  */  5, /*  6,     7,     8, */  9,
       /* 10, */ 11, /* 12,  */ 13,  /* 14,  */ 15, /* 16, */ 17, /* 18, */ 19,
       /* 20, */ 21, /* 22,  */ 23,  /* 24,  */ 25, /* 26, */ 27, /* 28, */ 29,
       /* 30, */ 31, /* 32,  */ 33,  /* 34,  */ 35, /* 36, */ 37, /* 38, */ 39,
       /* 40, */ 41, /* 42,  */ 43,  /* 44,  */ 45, /* 46, */ 47, /* 48, */ 49,
       /* 50, */ 51, /* 52,  */ 53,  /* 54,  */ 55, /* 56, */ 57, /* 58, */ 59,
       /* 60, */ 61, /* 62,  */ 63,  /* 64,  */ 65, /* 66, */ 67, /* 68, */ 69,
       /* 70, */ 71, /* 72,  */ 73,  /* 74,  */ 75, /* 76, */ 77, /* 78, */ 79,
       /* 80, */ 81, /* 82,  */ 83,  /* 84,  */ 85, /* 86, */ 87, /* 88, */ 89,
       /* 90,    91,    92,  */ 93,  /* 94,     95,    96, */ 97, /* 98, */ 99,
    ];
    walls.forEach(wall => {
        BOARD[wall] = { indicator: '', class: CLASS_WALL };
    });

    BOARD[BOARD.length - 1] = { indicator: '', class: CLASS_GOAL };
}

function unfade(element, loadTimer = 100) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            op = 1;
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, loadTimer);
}


INDICATE_INVALID_MOVE = (position, direction) => {
    const invalidClassName = `error-${direction}`;
    BOARD[position].class = invalidClassName;
    //TODO Play Negative Sound
    paintBoard();

    setTimeout(() => {
        BOARD[position].class = BOARD[position].class.replace(invalidClassName, '');
        paintBoard();
    }, 1_000);
};

IS_BLOCKED = (nextPosition) => {
    if (nextPosition < 0 || nextPosition > BOARD_SIZE - 1) {
        return true;
    }
    // console.log('nextPosition', nextPosition, BOARD[nextPosition]);
    return BOARD[nextPosition].class == CLASS_WALL;
};

class Player {
    direction = 'east';
    indicator = '>';

    constructor() { }

    getPlayerLocation() {
        const playerLocation = BOARD.map(c => c.indicator).indexOf(this.indicator);
        // console.log('playerLocation', playerLocation);
        return playerLocation;
    }

    turnRight() {
        const playerIndex = this.getPlayerLocation();

        switch (this.direction) {
            case 'east':
                this.direction = 'south';
                this.indicator = 'v';
                break;
            case 'south':
                this.direction = 'west';
                this.indicator = '<';
                break;
            case 'west':
                this.direction = 'north';
                this.indicator = '^';
                break;
            case 'north':
                this.direction = 'east';
                this.indicator = '>';
                break;
        }

        this._setPlayerLocation(playerIndex, playerIndex);
    }

    move() {
        const playerIndex = this.getPlayerLocation();

        if (!this._isValidMove(playerIndex)) {
            console.log('invalid move');
            INDICATE_INVALID_MOVE(playerIndex, this.direction);
            return false;
        }

        switch (this.direction) {
            case 'east':
                this._setPlayerLocation(playerIndex, this._getEast(playerIndex));
                break;
            case 'west':
                this._setPlayerLocation(playerIndex, this._getWest(playerIndex));
                break;
            case 'north':
                this._setPlayerLocation(playerIndex, this._getNorth(playerIndex));
                break;
            case 'south':
                this._setPlayerLocation(playerIndex, this._getSouth(playerIndex));
                break;
        }
        return true;
    }

    _getNextMove() {
        const playerIndex = this.getPlayerLocation();

        if (!this._isValidMove(playerIndex)) {
            console.log('invalid move');
            INDICATE_INVALID_MOVE(playerIndex, this.direction);
            return false;
        }

        switch (this.direction) {
            case 'east':
                return this._getEast(playerIndex);
            case 'west':
                return this._getWest(playerIndex);
            case 'north':
                return this._getNorth(playerIndex);
            case 'south':
                return this._getSouth(playerIndex);
        }
        return true;
    }


    _getEast(playerIndex) { return playerIndex + 1; }

    _getWest(playerIndex) { return playerIndex - 1; }

    _getNorth(playerIndex) { return playerIndex - BOARD_WIDTH; }

    _getSouth(playerIndex) { return playerIndex + BOARD_WIDTH; }


    //TODO Move Collision Detection to a 'Board' class
    _isValidMove(playerIndex) {
        switch (this.direction) {
            case 'east':
                return this._isValidMoveEast(playerIndex);
            case 'west':
                return this._isValidMoveWest(playerIndex);
            case 'north':
                return this._isValidMoveNorth(playerIndex);
            case 'south':
                return this._isValidMoveSouth(playerIndex);
        }
    }

    /* This should live on the 'Board' class */
    _setPlayerLocation(oldLocation, newLocation) {
        // console.log("setLocation", oldLocation, this.indicator, newLocation);
        BOARD[oldLocation] = { indicator: ' ', class: BOARD[oldLocation].class.replace(CLASS_PLAYER, '') };
        BOARD[newLocation] = { indicator: this.indicator, class: BOARD[newLocation].class + ` ${CLASS_PLAYER}` };
    }

    _isValidMoveEast(playerIndex) {
        const isOnMap = playerIndex % BOARD_WIDTH !== BOARD_WIDTH - 1;
        // console.log('isValidMoveEast', playerIndex, isOnMap, this._getEast(playerIndex));
        const isBlocked = IS_BLOCKED(this._getEast(playerIndex));
        return isOnMap && !isBlocked;
    }

    _isValidMoveWest(playerIndex) {
        const isOnMap = playerIndex % BOARD_WIDTH !== 0;
        const isBlocked = IS_BLOCKED(this._getWest(playerIndex));
        return isOnMap && !isBlocked;
    }

    _isValidMoveNorth(playerIndex) {
        const isOnMap = playerIndex >= BOARD_WIDTH;
        const isBlocked = IS_BLOCKED(this._getNorth(playerIndex));
        return isOnMap && !isBlocked;
    }

    _isValidMoveSouth(playerIndex) {
        const isOnMap = playerIndex < BOARD_SIZE - BOARD_WIDTH;
        const isBlocked = IS_BLOCKED(this._getSouth(playerIndex));
        return isOnMap && !isBlocked;
    }

    autoPlay() {
        const goalIndex = BOARD.map(c => c.class).indexOf(CLASS_GOAL);

        this.autoPlayStep(goalIndex);
    };

    autoPlayStep(goalIndex, steps = [], stepCount = 0) {
        if (this.getPlayerLocation() === goalIndex || stepCount > 1000)
            return;

        setTimeout(() => {
            if (steps.includes(this._getNextMove())) {
                this.turnRight();
            }
            else {
                steps.push(this.getPlayerLocation());
                const isValid = this.move();
                if (!isValid) {
                    this.turnRight();
                }
            }
            paintBoard();

            this.autoPlayStep(goalIndex, steps, stepCount + 1);
        }, 100);
    }
}

const player = new Player();
