
import { BoardComponent } from "./_web/components/board/board";
import { KeyboardHandlers } from "./_web/components/board/events/keyboard-handlers";
import { UserEventHandler } from "./infrastructure/events/user-events";
import * as Map from "./maps/map-functions";
import * as Validator from "./maps/map-validator";

window.addEventListener('load', () => {
    let boardComponent = document.querySelector('two-move-board') as BoardComponent;
    let map = Map.getMap();
    boardComponent.populateCells(map);
    boardComponent.render();
    const userHandler = new UserEventHandler();

    //TODO: Wire board events to the user handler
    //TODO: Optimize these to JUST update the cell that needs to be updated
    userHandler
        .subscribeMoveForward(this, () => {
            let c = Validator.checkPlayerCollision(map);
            map = c.map;
            if (!c.isCollision) {
                map = Map.movePlayer(map);
            } 
            boardComponent.populateCells(map);
            boardComponent.render();
        })
        .subscribeTurn(this, () => {
            map = Map.turnPlayer(map);
            boardComponent.populateCells(map);
            boardComponent.render();
        });


    new KeyboardHandlers().setupHandlers(userHandler);
});
