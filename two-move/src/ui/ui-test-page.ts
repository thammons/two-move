

export function addEvents(mapNames: string[], moverTypes: string[]) {
    window.addEventListener('load', (event) => {

        addCellTypeEvents();
        boardCellOnClickEvents();

        loadMapNames(mapNames);
        loadMoverTypes(moverTypes);

        setOnChangeEvents();

        loadOptions();
    });
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

const boardCellOnClick = (cell: Element) => {
    //change classes to what is on the selected "cell-type"
    //ensure only one player and one goal?
};

const loadMapNames = (mapNames: string[]) => {
    //set options on 'map-type' dropdown
};

const loadMoverTypes = (moverTypes: string[]) => {
    //set options on 'mover-type' dropdown
};

const onChangeEvents: Map<string, () => void> = new Map<string, () => void>([
    ["height", () => { }],
    ["width", () => { }],
    ["cell-size", () => { }],
    ["difficulty", () => { }],
    ["map-name", () => { }],
    ["mover-type", () => { }],
    ["mover-speed", () => { }],
]);

const setOnChangeEvents = () => {
    onChangeEvents.forEach((value, key) => {
        const element = document.getElementById(key);
        if (element !== null) {
            element.addEventListener("change", () => {
                value();
                saveOptions();
            });
        }
    });
};

const saveOptions = () => {
    const options = getData();
    localStorage.setItem("test-page-options", JSON.stringify(options));
};

const loadOptions = () => {
    const options = localStorage.getItem("test-page-options");
    if (options !== null) {
        const data = JSON.parse(options);
        (<HTMLInputElement>document.getElementById("height")).value = data.height;
        (<HTMLInputElement>document.getElementById("width")).value = data.width;
        (<HTMLInputElement>document.getElementById("cell-size")).value = data.cellSize;
        (<HTMLInputElement>document.getElementById("difficulty")).value = data.difficulty;
        (<HTMLInputElement>document.getElementById("map-name")).value = data.mapName;
        (<HTMLInputElement>document.getElementById("mover-type")).value = data.moverType;
        (<HTMLInputElement>document.getElementById("mover-speed")).value = data.moverSpeed;
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
    const height = Number((<HTMLInputElement>document.getElementById("height")).value);
    const width = Number((<HTMLInputElement>document.getElementById("width")).value);
    const cellSize = Number((<HTMLInputElement>document.getElementById("cell-size")).value);
    const difficulty = Number((<HTMLInputElement>document.getElementById("difficulty")).value);
    const mapName = (<HTMLInputElement>document.getElementById("map-name")).value;
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
