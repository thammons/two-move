import { IMap } from "@/maps";
import * as MapFunctions from "@/maps";
import { MoveTypes } from "./types";


export class UserMover {

    getNextMove(move: MoveTypes, map: IMap): IMap {
        let newMap: IMap = map;
        switch (move) {
            case 'move-forward':
                newMap = this.move(map);
                break;
            case 'turn':
                newMap = this.turn(map);
                break;
        }

        return newMap;
    }

    move(map: IMap): IMap {
        let c = MapFunctions.checkPlayerCollision(map);
        let newMap: IMap = c.map;
        if (!c.isCollision) {
            newMap = MapFunctions.movePlayer(newMap);
        }
        return newMap;
    }

    turn(map: IMap): IMap {
        return MapFunctions.turnPlayer(map);
    }

}


