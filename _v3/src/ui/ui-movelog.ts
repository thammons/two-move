
import * as utils from "./utils";

//TODO Move Counter, Error Counter

import { Direction } from "../types";

export function showLastMove(direction: Direction, isMove: boolean) {
    const moveLogElement = utils.getElementById('move-log');
    const lastMoveElement = utils.getElementById('last-move');

    const lastMoveText = document.createElement('div');
    const moveText = isMove ? 'move' : 'turn';
    lastMoveText.innerHTML = `${moveText}(); //${moveText} ${direction}`;

    lastMoveElement.innerHTML = '';
    lastMoveElement.appendChild(lastMoveText);



    //moveLogElement.appendChild(lastMoveText);
}