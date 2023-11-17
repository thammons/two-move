import { IMap } from "@/maps/types";
import * as MapFunctions from "@/maps/map-functions";
import * as Validator from "@/maps/map-validator";


export class UserMover {

    move(map: IMap): IMap {
        let c = Validator.checkPlayerCollision(map);
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


