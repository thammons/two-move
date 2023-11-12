import { IMap, ISimpleEventHandler } from "../../types";

export type SettingName = "board-height" | "board-width" | "cell-size" | "difficulty" | "map-type" | "mover-type" | "mover-speed" | "map";

export interface ISetting {
    name: SettingName;
    value: string;
}

export interface IMapBuilderEvents {
    settingsChangeHanders: ISimpleEventHandler<ISetting>[];
}

export class MapBuilderEvents implements IMapBuilderEvents {
    settingsChangeHanders: ISimpleEventHandler<ISetting>[] = [];

    constructor(handlers?: IMapBuilderEvents) {
        if (handlers)
            this.settingsChangeHanders = handlers.settingsChangeHanders;
    }

    subscribeToSettingsChange(handler: ISimpleEventHandler<ISetting>) {
        this.settingsChangeHanders.push(handler);
    }
    triggerSettingsChange(setting: ISetting) {
        this.settingsChangeHanders.forEach(h => h(setting));
    }
};



export interface IMapSettingsData {
    height?: number;
    width?: number;
    cellSize?: number;
    difficulty?: number;
    mapName?: string;
    moverType?: string;
    moverSpeed?: number;
    map?: IMap;
};

export class MapSettingsData implements IMapSettingsData {
    height?: number;
    width?: number;
    cellSize?: number;
    difficulty?: number;
    mapName?: string;
    moverType?: string;
    moverSpeed?: number;
    map?: IMap;

    [key: string]: number | string | IMap | undefined;

    static init(options: IMapSettingsData) {
        const newOptions = new MapSettingsData();
        newOptions.height = options.height;
        newOptions.width = options.width;
        newOptions.cellSize = options.cellSize;
        newOptions.difficulty = options.difficulty;
        newOptions.mapName = options.mapName;
        newOptions.moverType = options.moverType;
        newOptions.moverSpeed = options.moverSpeed;
        newOptions.map = options.map;
        return newOptions;
    }

    static updateValues(oldOptions: MapSettingsData, newOptions: MapSettingsData) {
        console.log('updateValues', oldOptions, newOptions)
        const options = new MapSettingsData();
        for (let key in newOptions) {
            if (newOptions.hasOwnProperty(key) && options.hasOwnProperty(key)) {
                options[key] = newOptions[key] ?? oldOptions[key];
                console.log('updated', key, options[key], newOptions[key], oldOptions[key]);
            }
        }
        return options;
    }
}