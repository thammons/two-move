import { IMap } from '../types.js';


export interface ISavedMap {
    map: IMap;
    level: number;
}

const mapCount = 0;

export function saveMap (map:IMap):boolean {
    const mapsKey = 'maps';
    //read in mapcount from localStorage and override local var if neccissary

    const loadedMaps = getSavedMaps();

    //read in maps from localStorage
    const maps:ISavedMap[] =  [];
    const object:ISavedMap = {
        map: map,
        level: mapCount
    };

    loadedMaps.push(object);

    //add a dataprovider class
    window.localStorage.setItem(mapsKey, JSON.stringify(maps));

    return true;
}

export function getNextMap(mapId: number): ISavedMap | undefined {
    const savedMaps = getSavedMaps();
    const nextMap = savedMaps.find(m => m.level === mapCount + 1);
    return nextMap;
}

const getSavedMaps = () => {
    const mapsKey = 'maps';
    const savedMaps = window.localStorage.getItem(mapsKey);

    const savedMapsParsed = JSON.parse(savedMaps || '[]');
    const savedMapstyped = savedMapsParsed as ISavedMap[];

    return savedMapstyped;
}
