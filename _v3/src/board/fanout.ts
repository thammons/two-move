import { IMap } from "../types";

export const getNorthWall = (playerLocation: number, map: IMap, distanceFromPlayer: number): number[] => {

    let nearWalls: number[] = [];

    const playerX = Math.floor((playerLocation) % map.width); //col 4 (X)
    const playerY = Math.floor((playerLocation) / map.width); //row 5 (Y)


    for (let y = playerY; y < playerY + distanceFromPlayer; y++) {
        let wallfound = false;
        for (let x = playerX; x < playerX + distanceFromPlayer; x++) {
            const location = (y * map.width) + x;
        console.log(location)
        if (!wallfound && map.walls.includes(location)) {
            nearWalls.push(location);
            wallfound = true;
            // break;
        }
    }
}

    nearWalls = nearWalls.sort();
    console.log('nearWalls', nearWalls);
    return nearWalls;
}