import { IMover } from "../types";
import { PaceMover } from "./pace";
import { RandomWalkerMover } from "./random-walker";
import { ScreenSweeperMover } from "./screen-sweeper";
import { WallFollowerMover } from "./wall-follower";

export const MoverNames = ['none', 'pacer', 'random-walker', 'screen-sweeper', 'wall-follower'];
export type MoverTypes = 'none' | 'pacer' | 'random-walker' | 'screen-sweeper' | 'wall-follower';



export function getMover(moverType: MoverTypes, speed:number): IMover | undefined {
    let mover: IMover | undefined = undefined;
    switch (moverType) {
        case 'pacer':
            mover = new PaceMover(speed);
            break;
        case 'screen-sweeper':
            mover = new ScreenSweeperMover(speed);
            break;
        case 'wall-follower':
            mover = new WallFollowerMover(speed);
            break;
        case 'random-walker':
            mover = new RandomWalkerMover(speed);
            break;
    }

    return mover;
}
