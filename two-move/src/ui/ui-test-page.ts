import { ISetting, ITestPageEventHandlers, SettingName, TestPageEvents } from "./ui-test-page-events";


let testPageEventHandlers: TestPageEvents;

export function init(mapNames: string[], moverTypes: string[], options?: ITestPageOptions, eventHandlers?: ITestPageEventHandlers) {
    window.addEventListener('load', () => {
        loadMapNames(mapNames);
        loadMoverTypes(moverTypes);

        addHtmlElementEvents();

        //TODO: load slider values, not just the "value" text
        loadSliderDisplayValues(options);

        testPageEventHandlers = new TestPageEvents(eventHandlers);
        //TODO call handler for each of the controls from the saved data (if there is any)
    });

}


function addHtmlElementEvents() {
    addCellTypeEvents();
    boardCellOnClickEvents();

    setOnChangeEvents();
    setOnInputEvents();
    saveBoardOnClickEvent();

    loadOptions();
};

const addCellTypeEvents = () => {
    const cells = document.getElementsByClassName("cell-type");
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", () => {
            cellTypeOnClick(cells[i]);
        });
    }
};

const cellTypeOnClick = (cell: Element) => {
    //store classes of selected "cell-type" to add to board cell
    const cells = document.getElementsByClassName("cell-type");
    for (let i = 0; i < cells.length; i++) {
        if (cells[i] !== cell) {
            cells[i].classList.remove("selected");
        }
    }

    cell.classList.add("selected");
};

const boardCellOnClickEvents = () => {
    const board = document.getElementById("grid-container-items");
    const cells = board?.getElementsByClassName("grid-item") ?? [];
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", () => {
            boardCellOnClick(cells[i]);
        });
    }
};

const saveBoardOnClickEvent = () => {
    const saveButton = document.getElementById("save-button");
    saveButton?.addEventListener("click", () => {
        //TODO: save the board and load it as a new map
    });
};

const boardCellOnClick = (cell: Element) => {
    //change classes to what is on the selected "cell-type"
    const cellTypes = document.getElementsByClassName("cell-type");
    let cellType: Element | undefined = undefined;

    for (let i = 0; i < cellTypes.length; i++) {
        if (cellTypes[i].classList.contains("selected")) {
            cellType = cellTypes[i];
            break;
        }
    }

    if (cellType === undefined)
        return;

    const classesToMove = ["wall", "player", "goal"];

    cell.classList.remove(...classesToMove);
    cell.innerHTML = cellType?.innerHTML ?? " ";

    cellType.classList.forEach((c) => {
        classesToMove.forEach((m) => {
            if (c === m) {
                cell.classList.add(m);
            }
        });
    });

    //TODO: Disable keyboard mover in edit mode?
    //TODO: reload board events on map refresh


    //TODO: ensure only one player and one goal?
    // Lucas liked 
    //      having fake walls that trick the player
    //      having fake goals
    //      multiple moovers

    //TODO: on map change, 
    //  fire event, 
    //  update board to use new map
};

const loadSliderDisplayValues = (options?: ITestPageOptions) => {
    if (!options)
        options = getData();
    (<HTMLInputElement>document.getElementById("board-height-value")).innerHTML = options.height.toString();
    (<HTMLInputElement>document.getElementById("board-width-value")).innerHTML = options.width.toString();
    (<HTMLInputElement>document.getElementById("cell-size-value")).innerHTML = options.cellSize.toString();
    (<HTMLInputElement>document.getElementById("difficulty-value")).innerHTML = options.difficulty.toString();
    (<HTMLInputElement>document.getElementById("mover-speed-value")).innerHTML = options.moverSpeed.toString();


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
    ["mover-speed", () => { }],
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
    const options = getData();
    localStorage.setItem("test-page-options", JSON.stringify(options));
};

const loadOptions = (data?: ITestPageOptions) => {
    const options = localStorage.getItem("test-page-options");
    if (!data && options !== null) {
        data = JSON.parse(options);
    }
    if (!!data) {
        (<HTMLInputElement>document.getElementById("board-height")).value = data.height.toString();
        (<HTMLInputElement>document.getElementById("board-width")).value = data.width.toString();
        (<HTMLInputElement>document.getElementById("cell-size")).value = data.cellSize.toString();
        (<HTMLInputElement>document.getElementById("difficulty")).value = data.difficulty.toString();
        (<HTMLInputElement>document.getElementById("map-type")).value = data.mapName;
        (<HTMLInputElement>document.getElementById("mover-type")).value = data.moverType;
        (<HTMLInputElement>document.getElementById("mover-speed")).value = data.moverSpeed.toString();
    }
};

export interface ITestPageOptions {
    height: number;
    width: number;
    cellSize: number;
    difficulty: number;
    mapName: string;
    moverType: string;
    moverSpeed: number;
};

const getData = (): ITestPageOptions => {
    const height = Number((<HTMLInputElement>document.getElementById("board-height")).value);
    const width = Number((<HTMLInputElement>document.getElementById("board-width")).value);
    const cellSize = Number((<HTMLInputElement>document.getElementById("cell-size")).value);
    const difficulty = Number((<HTMLInputElement>document.getElementById("difficulty")).value);
    const mapName = (<HTMLInputElement>document.getElementById("map-type")).value;
    const moverType = (<HTMLInputElement>document.getElementById("mover-type")).value;
    const moverSpeed = Number((<HTMLInputElement>document.getElementById("mover-speed")).value);

    return {
        height,
        width,
        cellSize,
        difficulty,
        mapName,
        moverType,
        moverSpeed
    };
};
