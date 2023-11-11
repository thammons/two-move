import { ISetting, IMapBuilderEvents, SettingName, MapBuilderEvents, IMapSettingsData } from "./types";


//TODO: This file should probably be split up by component

let testPageEventHandlers: MapBuilderEvents;

export function init(mapNames: string[], moverTypes: string[], options?: IMapSettingsData, eventHandlers?: IMapBuilderEvents) {
    const testPage = new MapSettings();
    loadMapNames(mapNames);
    loadMoverTypes(moverTypes);

    setOnChangeEvents();
    setOnInputEvents();

    //TODO: when the height changes, adjust the cell size down
    // when the width changes, adjust the cell size down
    // when the cell size changes, adjust the height and width down
    //TODO: the min max need to be adjusted down.. a huge board should not hide controls
    //      fix with css? - board can break to a new line? (outer container flex-row wrap)

    testPage.loadOptions(options);

    testPageEventHandlers = new MapBuilderEvents(eventHandlers);
};

const loadMapNames = (mapNames: string[]) => {
    loadSelect("map-type", mapNames);
};

const loadMoverTypes = (moverTypes: string[]) => {
    loadSelect("mover-type", moverTypes);
};

const loadSelect = (id: string, values: string[]) => {
    const select = document.getElementById(id);
    if (select !== null) {
        values.forEach((value) => {
            select.appendChild(createOption(value));
        });
    }
};

const createOption = (value: string) => {
    const option = document.createElement("option");
    option.value = value;
    option.text = value;
    return option;
}


const onChangeEvents: Map<string, () => void> = new Map<string, () => void>([
    ["board-height", () => { }],
    ["board-width", () => { }],
    ["cell-size", () => { }],
    ["difficulty", () => { }],
    ["map-type", () => { }],
    ["mover-type", () => { }],
    ["mover-speed", () => { }]
]);

const setOnChangeEvents = () => {
    setValueEvents("change", onChangeEvents, [
        saveOptions,
        (setting) => testPageEventHandlers.triggerSettingsChange(setting)
    ]);
};

const onInputEvents = new Map<string, () => void>([
    ["board-height", () => { }],
    ["board-width", () => { }],
    ["cell-size", () => { }],
    ["difficulty", () => { }],
    ["mover-speed", () => { }],
]);

const setOnInputEvents = () => {
    setValueEvents("input", onInputEvents);
};

const setValueEvents = (eventType: string, events: Map<string, () => void>, eventsForAll?: ((settingEvent: ISetting) => void)[]) => {
    events.forEach((value, key) => {
        const element = document.getElementById(key);
        if (element !== null) {
            const inputEle = <HTMLInputElement>element;
            element.addEventListener(eventType, () => {
                const valueElement = document.getElementById(key + "-value");

                if (valueElement !== null)
                    valueElement.innerHTML = inputEle.value.toString();

                value();
                if (eventsForAll !== undefined)
                    eventsForAll.forEach((e) => !e || e({ name: key as SettingName, value: inputEle.value.toString() }));

            });
        }
    });
};

const saveOptions = () => {
    const options = new MapSettings().getData();
    localStorage.setItem("test-page-options", JSON.stringify(options));
};

export const getStoredOptions = (): IMapSettingsData | undefined => {
    let data: IMapSettingsData | undefined = undefined;
    const options = localStorage.getItem("test-page-options");
    if (options !== null) {
        data = JSON.parse(options);
    }

    return data;
}


export class MapSettings {
    boardHeightElement: HTMLInputElement | undefined = undefined;
    boardWidthElement: HTMLInputElement | undefined = undefined;
    cellSizeElement: HTMLInputElement | undefined = undefined;
    difficultyElement: HTMLInputElement | undefined = undefined;
    mapTypeElement: HTMLInputElement | undefined = undefined;
    moverTypeElement: HTMLInputElement | undefined = undefined;
    moverSpeedElement: HTMLInputElement | undefined = undefined;

    boardHeightValueElement: HTMLElement | undefined = undefined;
    boardWidthValueElement: HTMLElement | undefined = undefined;
    cellSizeValueElement: HTMLElement | undefined = undefined;
    difficultyValueElement: HTMLElement | undefined = undefined;
    moverSpeedValueElement: HTMLElement | undefined = undefined;

    constructor() {
        this.refreshFromDisplay();
    }
    
    refreshFromDisplay() {
        this.boardHeightElement = <HTMLInputElement>document.getElementById("board-height");
        this.boardWidthElement = <HTMLInputElement>document.getElementById("board-width");
        this.cellSizeElement = <HTMLInputElement>document.getElementById("cell-size");
        this.difficultyElement = <HTMLInputElement>document.getElementById("difficulty");
        this.mapTypeElement = <HTMLInputElement>document.getElementById("map-type");
        this.moverTypeElement = <HTMLInputElement>document.getElementById("mover-type");
        this.moverSpeedElement = <HTMLInputElement>document.getElementById("mover-speed");

        //values
        this.boardHeightValueElement = <HTMLElement>document.getElementById("board-height-value");
        this.boardWidthValueElement = <HTMLElement>document.getElementById("board-width-value");
        this.cellSizeValueElement = <HTMLElement>document.getElementById("cell-size-value");
        this.difficultyValueElement = <HTMLElement>document.getElementById("difficulty-value");
        this.moverSpeedValueElement = <HTMLElement>document.getElementById("mover-speed-value");

    }
    
    isValid() {
        const elements: (HTMLInputElement | HTMLElement | undefined)[] = [
            this.boardHeightElement,
            this.boardWidthElement,
            this.cellSizeElement,
            this.difficultyElement,
            this.mapTypeElement,
            this.moverTypeElement,
            this.moverSpeedElement,

            this.boardHeightValueElement,
            this.boardWidthValueElement,
            this.cellSizeValueElement,
            this.difficultyValueElement,
            this.moverSpeedValueElement,
        ];

        return elements.every(e => e !== undefined);
    }
    getData(): IMapSettingsData {

        return {
            height: parseInt(this.boardHeightElement!.value),
            width: parseInt(this.boardWidthElement!.value),
            cellSize: parseInt(this.cellSizeElement!.value),
            difficulty: parseInt(this.difficultyElement!.value),
            mapName: this.mapTypeElement!.value,
            moverType: this.moverTypeElement!.value,
            moverSpeed: parseInt(this.moverSpeedElement!.value),
        };
    };

    loadOptions(options?: IMapSettingsData) {
        const data = options || getStoredOptions();

        if (!!data) {
            if (data.height !== undefined && !isNaN(data.height)) {
                this.boardHeightElement!.value = data.height.toString();
                this.boardHeightValueElement!.innerHTML = data.height.toString();
            }
            if (data.width !== undefined && !isNaN(data.width)) {
                this.boardWidthElement!.value = data.width.toString();
                this.boardWidthValueElement!.innerHTML = data.width.toString();
            }
            if (data.cellSize !== undefined && !isNaN(data.cellSize)) {
                this.cellSizeElement!.value = data.cellSize.toString();
                this.cellSizeValueElement!.innerHTML = data.cellSize.toString();
            }
            if (data.difficulty !== undefined && !isNaN(data.difficulty)) {
                this.difficultyElement!.value = data.difficulty.toString();
                this.difficultyValueElement!.innerHTML = data.difficulty.toString();
            }
            if (data.mapName !== undefined) {
                this.mapTypeElement!.value = data.mapName;
            }
            if (data.moverType !== undefined) {
                this.moverTypeElement!.value = data.moverType;
            }
            if (data.moverSpeed !== undefined && !isNaN(data.moverSpeed)) {
                this.moverSpeedElement!.value = data.moverSpeed.toString();
                this.moverSpeedValueElement!.innerHTML = data.moverSpeed.toString();
            }
        }
    };
}