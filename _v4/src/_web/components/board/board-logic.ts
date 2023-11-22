import { IMap, IMapItem } from "@/maps";

export interface IUpdateMapItem extends IMapItem {
    isUpdated: boolean;
}

export interface IBoardDisplay {
    updateCells(map: IMap): void;
}

export interface IBoardLogic {}

export class BoardLogic {
    private _cells: Map<number, IUpdateMapItem[]> = new Map();
    private _height: number;
    private _width: number;
    private _map: IMap;

    get Cells() {
        return this._cells;
    }

    get Height() {
        return this._height;
    }

    get Width() {
        return this._width;
    }

    constructor(map: IMap) {
        this._height = map.height;
        this._width = map.width;
        this._map = map;
    }

    updateCells(map?: IMap, force?: boolean) {
        const newPlayer = map?.mapItems?.get("player")?.[0];
        const oldPlayer = this._map?.mapItems?.get("player")?.[0];

        //TODO: Refactor to "ItemChanged" function
        if (
            !force &&
            !!map &&
            !!newPlayer &&
            !!oldPlayer &&
            newPlayer.location === oldPlayer.location &&
            newPlayer.direction === oldPlayer.direction &&
            newPlayer.attributes?.length === oldPlayer.attributes?.length &&
            newPlayer.attributes?.every((a) =>
                oldPlayer.attributes?.includes(a)
            )
        ) {
            return;
        }

        console.log('updating cells')
        if (
            force ||
            !this._cells.size ||
            map?.width !== this._width ||
            map?.height !== this._height
        ) {
            this._map = map ?? this._map;
            this._height = this._map.height;
            this._width = this._map.width;
            this._cells = BoardLogic.createCells(this._map);
        } else {
            this._cells = BoardLogic.getUpdatedCells(
                map ?? this._map,
                this._cells
            );
        }
        this._map = map ?? this._map;
    }

    static getCellUpdateDisplayItems(cells: Map<number, IUpdateMapItem[]>) {
        let cellDisplayItems = [];
        for (let [_, value] of cells) {
            //TODO: this isn't working - all cells always updating
            if (value.some((v) => v.isUpdated === true))
                cellDisplayItems.push(value);
        }
        return cellDisplayItems;
    }

    static createCells(map: IMap) {
        const cells = new Map<number, IUpdateMapItem[]>();
        //TODO: This needs to be replaced.. probably wire to a board event?
        [...Array(map.width * map.height).keys()].forEach((i) => {
            cells.set(i, [
                {
                    type: "empty",
                    location: i,
                    attributes: ["unseen"],
                    isUpdated: true,
                },
            ]);
        });
        // this.cells[0].items.push({ type: 'player', location: 0 });
        // this.cells[99].items.push({ type: 'goal', location: 99 });

        for (let [key, value] of map.mapItems) {
            for (let item of value) {
                const cell = cells.get(item.location);
                const existingAttributes =
                    cell?.flatMap((c) => c.attributes) || [];
                const existingItems =
                    cell?.filter((c) => c.type !== "empty") || [];
                cells.set(item.location, [
                    ...existingItems,
                    {
                        id: item.id,
                        type: key,
                        location: item.location,
                        direction: item.direction,
                        attributes: [
                            ...new Set([
                                ...existingAttributes,
                                ...(item.attributes || []),
                            ]),
                        ],
                        isUpdated: true,
                    } as IUpdateMapItem,
                ]);
            }
        }
        return cells;
    }

    static getUpdatedCells(
        newMap: IMap,
        oldMap: Map<number, IUpdateMapItem[]>
    ) {
        const newCells = BoardLogic.createCells(newMap);
        const updatedCells = new Map<number, IUpdateMapItem[]>();

        for (let [key, value] of newCells) {
            const oldCell = oldMap
                .get(key)
                ?.map((c) => ({ ...c, isUpdated: false }));
            const newCell = value;

            //if oldcell doesn't exist, get it from the new cell
            if (!oldCell) {
                updatedCells.set(key, newCell);
                continue;
            }

            //TODO: MAKE A COMPARE FUNCTION
            const oldCellItems = oldCell.filter((c) => c.type !== "empty");
            const newCellItems = newCell.filter((c) => c.type !== "empty");
            const itemLengthsMatch =
                oldCellItems.length === newCellItems.length;
            const itemTypesMatch = oldCellItems.every((item) =>
                newCellItems.some((i) => i.type === item.type)
            );
            if (!itemLengthsMatch || !itemTypesMatch) {
                updatedCells.set(key, newCell);
                continue;
            }
            newCell.forEach((item, index) => {
                const oldItem = oldCell[index];
                if (!oldItem) {
                    updatedCells.set(key, newCell);
                    console.log("oldItem undefined");
                } else {
                    const locationsMatch = oldItem.location === item.location;
                    const directionsMatch =
                        oldItem.direction === item.direction;
                    const attributesMatch =
                        oldItem.attributes?.length ===
                            item.attributes?.length &&
                        oldItem.attributes?.every((a) =>
                            item.attributes?.includes(a)
                        );
                    if (
                        !locationsMatch ||
                        !directionsMatch ||
                        !attributesMatch
                    ) {
                        updatedCells.set(key, newCell);
                    } else {
                        updatedCells.set(key, oldCell);
                    }
                }
            });
        }
        return updatedCells;
    }

    static getBoardDisplayWidth(width: number) {
        return width * 50 + width * 2;
    }
}
