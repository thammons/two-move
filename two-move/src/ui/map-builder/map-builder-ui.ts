import { IMap } from "../../types";
import { ISetting, IMapBuilderEvents, MapBuilderEvents } from "./types";
//TODO: This file is handling too much:
// split the board settings into a separate file
// split the map builder into a separate file 

let testPageEventHandlers: MapBuilderEvents;

export function init(eventHandlers?: IMapBuilderEvents) {
    wireCellTypeEvents();
    wireBoardCellOnClickEvents();
    wireSaveBoardOnClickEvent();

    testPageEventHandlers = new MapBuilderEvents(eventHandlers);
};

const wireCellTypeEvents = () => {
    const cells = document.getElementsByClassName("cell-type");
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", () => {
            toggleCellTypeSelectionClass(cells[i]);
        });
    }
};

const toggleCellTypeSelectionClass = (cell: Element) => {
    //store classes of selected "cell-type" to add to board cell
    const cells = document.getElementsByClassName("cell-type");
    for (let i = 0; i < cells.length; i++) {
        if (cells[i] !== cell) {
            cells[i].classList.remove("selected");
        }
    }

    cell.classList.add("selected");
};


const wireSaveBoardOnClickEvent = () => {
    const saveButton = document.getElementById("save-board");
    saveButton?.addEventListener("click", () => {
        const map = new MapBuilder().getMap();
        const setting: ISetting = { name: "map", value: JSON.stringify({map: map}) };
        testPageEventHandlers.triggerSettingsChange(setting)
    });
};

const wireBoardCellOnClickEvents = () => {
    const board = document.getElementById("grid-container-items");
    const cells = board?.getElementsByClassName("grid-item") ?? [];
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", () => {
            setBoardCellClassesToCellTypeClasses(cells[i]);
        });
    }
};
const setBoardCellClassesToCellTypeClasses = (cell: Element) => {
    //change classes to what is on the selected "cell-type"
    const cellTypes = document.getElementsByClassName("cell-type selected");
    console.log("cell-type selected", cellTypes)
    let cellType: Element | undefined = undefined;
    if (cellTypes.length == 1) 
        cellType = cellTypes[0];

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



class MapBuilder {

    mapElement: HTMLElement | undefined = undefined;
    cellElements: HTMLCollectionOf<Element> | undefined = undefined;

    constructor() {
        this.refreshFromDisplay();
    }

    refreshFromDisplay() {

        this.mapElement = <HTMLElement>document.getElementById("grid-container-items");
        this.cellElements = this.mapElement?.getElementsByClassName("grid-item");
    }

    isValid() {
        const elements: (HTMLInputElement | HTMLElement | undefined)[] = [

            this.mapElement
        ];

        return elements.every(e => e !== undefined);
    }


    getMap(): IMap {
        const cells = this.cellElements!;

        const map: IMap = {
            height: 10,
            width: 10,
            cellWidth: 25,
            walls: [],
            player: 0,
            goal: 1
        };

        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (cell.classList.contains("wall"))
                map.walls.push(i);
            if (cell.classList.contains("player"))
                map.player = i;
            if (cell.classList.contains("goal"))
                map.goal = i;
        }

        //TODO: Validate Map

        return map;
    };

   

}