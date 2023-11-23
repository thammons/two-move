import {
    checkPlayerGoal,
    compareMapItems,
    compareMapItemsArray,
    compareMaps,
    getMap,
    movePlayer,
    turnPlayer,
} from "./map-functions";
import { cloneMap } from "./map-utils";
import { checkPlayerCollision } from "./map-validator";
import { getNextMap } from "./maps/generate-map";

export type {
    IMap,
    IMapItem,
    MapItemType,
    AttributeType,
    Direction,
    IMapGeneratorSettings,
} from "./types";

export {
    checkPlayerCollision,
    movePlayer,
    turnPlayer,
    getMap,
    cloneMap,
    getNextMap,
    checkPlayerGoal,
    compareMaps,
    compareMapItems,
    compareMapItemsArray,
};
