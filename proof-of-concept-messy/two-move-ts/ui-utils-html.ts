import { error } from "console";
import { Cell } from "./board-logic/cell.js";
import { ItemLocation, Direction, ICell, Indicator, IMapItem, IBoard } from "./types.js";


//TODO Move Counter, Error Counter

export function showLastMove(direction: Direction, isMove: boolean) {
    const moveLogElement = _getElementById('move-log');
    const lastMoveElement = _getElementById('last-move');

    const lastMoveText = document.createElement('div');
    const moveText = isMove ? 'move' : 'turn';
    lastMoveText.innerHTML = `${moveText}(); //${moveText} ${direction}`;

    lastMoveElement.innerHTML = '';
    lastMoveElement.appendChild(lastMoveText);



    //moveLogElement.appendChild(lastMoveText);
}

export function showWinMessage() {
    const successElement = _getElementById('success');
    const winMessage = document.createElement('h3');
    winMessage.innerHTML = 'You Win!';
    winMessage.id = `win-message-${Math.floor(Math.random() * 1000)}`;
    successElement.appendChild(winMessage);

    fade(successElement, 1000);

    setTimeout(() => {
        successElement.removeChild(winMessage);
    }, 2000);
}

let showCollisionMessageTimeout: NodeJS.Timeout | undefined = undefined;

//TODO more info about the invalid move
export function showCollisionMessage() {
    const errorElement = _getElementById('error');

    if (!!showCollisionMessageTimeout) {
        clearTimeout(showCollisionMessageTimeout);
        errorElement.innerHTML = '';
    }

    const errorMessage = document.createElement('h3');
    errorMessage.innerHTML = 'Invalid Move!';
    errorElement.appendChild(errorMessage);

    showCollisionMessageTimeout = setTimeout(() => {
        errorElement.removeChild(errorMessage);
        showCollisionMessageTimeout = undefined;
    }, 1000);
}


function setCellAttributes(cell: ICell, index: number, element: HTMLElement) {
    if (!element) {
        element = _getElementById(`cell-${index}`);
    }

    const cellObj = Cell.create(cell);

    element.className = 'grid-item';
    const classes = cellObj.getClasses();
    if (!!classes.length)
        element.className += ` ${classes.join(' ')}`;

    element.innerText = cellObj.getIndicator();
}


function firstPaint(board: IBoard, loadTimer: number = 0) {
    //Set board size
    const cellSize = board.cellWidth;
    const boardElement = _getElementById('board');
    boardElement.style.width = `${board.width * (cellSize + 2)}px`;


    const templateBodyGrid = _getElementById('grid-container-items');

    templateBodyGrid.innerHTML = '';

    board.getCells().forEach((cell, index) => {
        // console.log('cell', cell);
        const element = document.createElement('div');
        element.id = `cell-${index}`;

        setCellAttributes(cell, index, element);

        element.style.width = `${cellSize}px`;
        element.style.height = `${cellSize}px`;
        element.style.fontSize = `${cellSize}px`;
        element.style.opacity = "0";

        templateBodyGrid.appendChild(element);

        if (loadTimer > 0) {
            unfade(element, loadTimer);
        }
        else {
            element.style.removeProperty('opacity');
        }

    });
    // console.log('player location', playerLocation);
}

let lastBoardVersion: IBoard;
export function paintBoard(board: IBoard, loadTimer: number = 0) {


    if (lastBoardVersion === undefined) {
        firstPaint(board, loadTimer);
        return;
    }

    lastBoardVersion = JSON.parse(JSON.stringify(board));

    let changedCells:Map<number, ICell> = new Map<number, ICell>();
    lastBoardVersion.getCells().forEach((cell, index) => {
        //TODO add last update to cell?
        if(JSON.stringify(cell) !== JSON.stringify(board.getCells()[index])){
            changedCells.set(index, cell);
        }
    });

    changedCells.forEach((cell, index) => {
        const element = _getElementById(`cell-${index}`);
        setCellAttributes(cell, index, element);
    });


    // console.log('paintBoard', board);

};


export function paintBoardv1(board: IBoard, loadTimer: number = 0) {

    /*
        TODO: Only rerender the cells that have changed
    */


    // console.log('paintBoard', board);
    //Set board size
    const cellSize = board.cellWidth;
    const boardElement = _getElementById('board');
    boardElement.style.width = `${board.width * (cellSize + 2)}px`;


    const templateBodyGrid = _getElementById('grid-container-items');

    templateBodyGrid.innerHTML = '';

    board.getCells().forEach((cell, index) => {
        // console.log('cell', cell);
        const element = document.createElement('div');

        const cellObj = Cell.create(cell);

        element.className = 'grid-item';
        const classes = cellObj.getClasses();
        if (!!classes.length)
            element.className += ` ${classes.join(' ')}`;

        element.innerText = cellObj.getIndicator();
        element.style.width = `${cellSize}px`;
        element.style.height = `${cellSize}px`;
        element.style.fontSize = `${cellSize}px`;
        element.style.opacity = "0";

        templateBodyGrid.appendChild(element);

        if (loadTimer > 0) {
            unfade(element, loadTimer);
        }
        else {
            element.style.removeProperty('opacity');
        }

    });
    // console.log('player location', playerLocation);
};

export function _getElementById(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`No element with id ${id}`);
    return element;
}

export function unfade(element: HTMLElement, loadTimer = 100) {
    let op = 0.1;  // initial opacity
    element.style.display = 'block';
    const timer = setInterval(function () {
        if (op >= 1) {
            op = 1;
            clearInterval(timer);
        }
        element.style.opacity = op.toString();
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, loadTimer);
}

export function fade(element: HTMLElement, loadTimer = 100) {
    let op = 1;  // initial opacity
    element.style.display = 'block';
    const timer = setInterval(function () {
        if (op <= 0.1) {
            op = 0.1;
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op.toString();
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, loadTimer);
}