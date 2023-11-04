const mapCount = 0;
export function saveMap(map) {
    const mapsKey = 'maps';
    const loadedMaps = getSavedMaps();
    const maps = [];
    const object = {
        map: map,
        level: mapCount
    };
    loadedMaps.push(object);
    window.localStorage.setItem(mapsKey, JSON.stringify(maps));
    return true;
}
export function getNextMap(mapId) {
    const savedMaps = getSavedMaps();
    const nextMap = savedMaps.find(m => m.level === mapCount + 1);
    return nextMap;
}
const getSavedMaps = () => {
    const mapsKey = 'maps';
    const savedMaps = window.localStorage.getItem(mapsKey);
    const savedMapsParsed = JSON.parse(savedMaps || '[]');
    const savedMapstyped = savedMapsParsed;
    return savedMapstyped;
};
//# sourceMappingURL=save-map.js.map