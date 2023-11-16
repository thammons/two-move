import { UserEventHandler } from "@/infrastructure/events/user-events";
import { IMap, IPlayer } from "@/maps/types";


export class UserMover {
    map: IMap;
    player: IPlayer;

    constructor(map: IMap, player: IPlayer) {
        this.map = map;
        this.player = player;
    }

    setupEvents(handlers: UserEventHandler) {
        handlers.subscribeMoveForward(this, this.moveForward)
            .subscribeTurn(this, this.turn);
    }

    clearEvents(handlers: UserEventHandler) {
        handlers.unsubscribe(this);
    }

    moveForward() {
    }

    turn() {

    }
}