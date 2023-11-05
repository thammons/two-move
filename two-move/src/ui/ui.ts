import { Cell } from "../board/cell";
import { Direction, IBoard, ICell } from "../types";
import * as utils from "./utils";

let lastBoardVersion: IBoard;
let showCollisionMessageTimeout: NodeJS.Timeout | undefined = undefined;

export function paintBoard(board: IBoard, loadTimer: number = 0) {


    if (lastBoardVersion === undefined) {
        paintWholeBoard(board, loadTimer);
        return;
    }
    updateBoard(board);
};

//TODO more info about the invalid move
export function showCollisionMessage() {
    const errorElement = utils.getElementById('error');

    if (!!showCollisionMessageTimeout) {
        clearTimeout(showCollisionMessageTimeout);
        errorElement.innerHTML = '';
    }

    const errorMessage = utils.createElement('h3', 'Invalid Move!');
    errorElement.appendChild(errorMessage);

    showCollisionMessageTimeout = setTimeout(() => {
        errorElement.removeChild(errorMessage);
        showCollisionMessageTimeout = undefined;
    }, 1000);
}

export function showWinMessage() {
    const successElement = utils.getElementById('success');
    const winMessage = utils.createElement('h3', 'You Win!');
    winMessage.id = `win-message-${Math.floor(Math.random() * 1000)}`;
    successElement.appendChild(winMessage);

    utils.fade(successElement, 1000);

    setTimeout(() => {
        successElement.removeChild(winMessage);
    }, 2000);
}

export function showLastMove(direction: Direction, isMove: boolean) {
    const moveLogElement = utils.getElementById('move-log');
    const lastMoveElement = utils.getElementById('last-move');

    const moveText = isMove ? 'move' : 'turn';
    const lastMoveText = utils.createElement('div', `${moveText}(); //${moveText} ${direction}`);

    lastMoveElement.innerHTML = '';
    lastMoveElement.appendChild(lastMoveText);

    moveLogElement.appendChild(lastMoveText);
}

function updateBoard(board: IBoard) {
    if (lastBoardVersion === undefined)
        throw new Error('lastBoardVersion is undefined, paintwholeboard should be called first');

    lastBoardVersion = JSON.parse(JSON.stringify(board));

    let changedCells: Map<number, ICell> = new Map<number, ICell>();
    lastBoardVersion.getCells().forEach((cell, index) => {
        //TODO add last update to cell object?
        if (JSON.stringify(cell) !== JSON.stringify(board.getCells()[index])) {
            changedCells.set(index, cell);
        }
    });

    changedCells.forEach((cell, index) => updateCell(cell, index));

};

export function updateCell(cell: ICell, index: number, isTemporary: boolean = false) {
    const previousVersion = lastBoardVersion.getCell(index);
    lastBoardVersion.setCell(index, JSON.parse(JSON.stringify(cell)));

    const element = utils.getElementById(`cell-${index}`);
    setCellAttributes(cell, index, element);

    if (isTemporary) {
        setTimeout(() => {
            updateCell(previousVersion, index);
        }, 1000);
    }
}


function setCellAttributes(cell: ICell, index: number, element: HTMLElement) {
    if (!element) {
        element = utils.getElementById(`cell-${index}`);
    }

    const cellObj = Cell.create(cell);

    element.className = 'grid-item';
    const classes = cellObj.getClasses();
    if (!!classes.length)
        element.className += ` ${classes.join(' ')}`;

    element.innerText = cellObj.getIndicator();
}


function paintWholeBoard(board: IBoard, loadTimer: number = 0) {
    //Set board size
    const cellSize = board.cellWidth;
    const boardElement = utils.getElementById('board');
    boardElement.style.width = `${board.width * (cellSize + 2)}px`;


    const templateBodyGrid = utils.getElementById('grid-container-items');

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
            utils.unfade(element, loadTimer);
        }
        else {
            element.style.removeProperty('opacity');
        }

    });
    // console.log('player location', playerLocation);
}
