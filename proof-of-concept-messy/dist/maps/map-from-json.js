;
export class MapFromJson {
    maps;
    currentIndex = 0;
    constructor(mapsObj) {
        this.maps = [];
        if (!mapsObj.maps)
            throw new Error('json file does not contain maps property');
        if (!Array.isArray(mapsObj.maps))
            throw new Error('maps property is not an array');
        if (mapsObj.maps.length === 0)
            throw new Error('maps property is empty');
        let defaultSettings;
        if (mapsObj.defaultSettings !== undefined) {
            try {
                MapFromJson._validateSettings(mapsObj.defaultSettings);
                defaultSettings = MapFromJson._getSettings(mapsObj.defaultSettings);
            }
            catch (e) {
            }
        }
        mapsObj.maps.forEach((map, index) => {
            const mapObj1 = MapFromJson._getSettings(map, defaultSettings);
            const mapObj = MapFromJson._validateSettings(mapObj1);
            this.maps.push(mapObj);
        });
    }
    ;
    static _validateSettings(map) {
        if (!map.width)
            throw new Error('map does not have a width');
        if (!map.height)
            throw new Error('map does not have a height');
        if (!map.cellWidth)
            throw new Error('map does not have a cellWidth');
        if (map.player === undefined)
            throw new Error('map does not have a player');
        if (map.goal === undefined)
            throw new Error('map does not have a goal');
        if (!map.walls)
            throw new Error('map does not have walls');
        if (!Array.isArray(map.walls))
            throw new Error('map walls is not an array');
        return map;
    }
    ;
    static _getSettings(map, defaultSettings) {
        const settings = {};
        settings.width = map.width || defaultSettings?.width;
        settings.height = map.height || defaultSettings?.height;
        settings.cellWidth = map.cellWidth || defaultSettings?.cellWidth;
        settings.player = map.player !== undefined ? map.player : defaultSettings?.player;
        settings.goal = map.goal !== undefined ? map.goal : defaultSettings?.goal;
        settings.walls = map.walls || defaultSettings?.walls;
        return settings;
    }
    ;
    getNext() {
        this.currentIndex++;
        if (this.currentIndex < this.maps.length) {
            return this.maps[this.currentIndex];
        }
        return undefined;
    }
    ;
    get(index) {
        return this.maps[index];
    }
    ;
}
//# sourceMappingURL=map-from-json.js.map