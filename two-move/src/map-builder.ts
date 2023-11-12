import MapGenerated from "./maps/generate-map1";
import { IGameOptions, IMover, IPlayer } from "./types";
import { getKeyboardMover } from "./ui/movers";
import { TwoMoveGame, onload } from './two-move'
import { getMover, MoverNames, MoverTypes } from "./player-movers";
import { MapNames, MapType, getMap } from "./maps";

import * as UITestPage from './ui/map-builder';
import { IMapBuilderEvents, IMapSettingsData, MapSettingsData, SettingName } from "./ui/map-builder/types";






/* //TODO:
    All maps need to be resizeable
    get mover working
    'saveboard' button is not wired up to... anything..
    break up ui-test-page.ts into smaller files

*/




let TestOptions: IMapSettingsData = {
    height: 50,
    width: 50,
    cellSize: 10,
    difficulty: 50,
    mapName: 'generated',
    moverType: 'keyboard',
    moverSpeed: 150,
};

let game: TwoMoveGame;

window.addEventListener('load', () => {
    const loadedOptions = UITestPage.getStoredMapSettings();
    TestOptions = loadedOptions ?? TestOptions;
    game = new TwoMoveGame(getGameOptionsFromTestOptions(TestOptions));

});

//TODO: On board map change, the ui click handlers are lost. 
//TODO: two-move is doing too much, needs refactoring 
const getGameOptionsFromTestOptions = (testOptions: IMapSettingsData): IGameOptions => {
    let moverCreators: (() => IMover)[] = [];
    if (testOptions.moverType !== undefined && MoverNames.includes(testOptions.moverType)) {
        moverCreators.push(() => getMover(testOptions.moverType as MoverTypes, testOptions.moverSpeed ?? 150)!);
    }
    const GameOptions: IGameOptions = {
        //TODO: refactor to create GameOptions from TestOptions
        moverSpeed: testOptions.moverSpeed ?? 150,
        moverCreators: [getKeyboardMover, ...moverCreators],
        getNextMap: (player?: IPlayer) => {
            const nextMap = getMap(
                testOptions.mapName as MapType, {
                boardHeight: testOptions.height === undefined ? 10 : testOptions.height,
                boardWidth: testOptions.width === undefined ? 10 : testOptions.width,
                cellWidth: testOptions.cellSize === undefined ? 25 : testOptions.cellSize,
                difficulty: testOptions.difficulty === undefined ? 50 : testOptions.difficulty / 100,
                playerLocation: testOptions.map?.player ?? player?.getPlayerLocation() ?? 0,
                walls: testOptions.map?.walls ?? [],
                goalLocation: testOptions.map?.goal ?? 1,
            })!
            return nextMap;
        },
        postBoardSetup: () => {
            console.log("PostReset")
            UITestPage.init(MapNames, MoverNames, TestOptions, testHandlers);
        },
        lightsout: false,
        preservePlayerDirection: true,
        fadeOnReset: false,
    }
    return GameOptions;
}

let changeHandlerDelay: NodeJS.Timeout | undefined = undefined;
const settingChangesQueue: { name: SettingName, value: string }[] = [];

const testHandlers: IMapBuilderEvents = {
    //putting a lag on this, so it doesn't update on every change
    settingsChangeHanders: [
        updateSettingsOnChange
    ]
};

function updateSettingsOnChange(setting: { name: SettingName, value: string }) {
    settingChangesQueue.push(setting);
    if (!!changeHandlerDelay)
        clearTimeout(changeHandlerDelay);

    changeHandlerDelay = setTimeout(() => {

        TestOptions = updateSettingsFromQueue();
        game.reset(getGameOptionsFromTestOptions(TestOptions));

        UITestPage.init(MapNames, MoverNames, TestOptions, testHandlers);


        if (!!changeHandlerDelay)
            clearTimeout(changeHandlerDelay);
    }, 2000)
};

const updateSettingsFromQueue = (): IMapSettingsData => {

    const optionsToUpdate: IMapSettingsData = {};

    do {
        const setting = settingChangesQueue.shift();
        if (!setting)
            break;
        switch (setting.name) {
            case 'board-height':
                optionsToUpdate.height = parseInt(setting.value);
                break;
            case 'board-width':
                optionsToUpdate.width = parseInt(setting.value);
                break;
            case 'cell-size':
                optionsToUpdate.cellSize = parseInt(setting.value);
                break;
            case 'difficulty':
                optionsToUpdate.difficulty = parseInt(setting.value);
                break;
            case 'map-type':
                optionsToUpdate.mapName = setting.value;
                break;
            case 'mover-type':
                optionsToUpdate.moverType = setting.value;
                break;
            case 'mover-speed':
                optionsToUpdate.moverSpeed = parseInt(setting.value);
                break;
            case 'map':
                const map = JSON.parse(setting.value) as IMapSettingsData;
                optionsToUpdate.map = map.map;
                break;
        }
        console.log("setting changed", setting);
    } while (settingChangesQueue.length > 0);

    const options = MapSettingsData.updateValues(
        MapSettingsData.init(TestOptions),
        MapSettingsData.init(optionsToUpdate)
    )

    console.log('updated options', options);
    return options;
};

