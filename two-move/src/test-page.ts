import MapGenerated from "./maps/generate-map1";
import { IGameOptions, IMover, IPlayer } from "./types";
import { getKeyboardMover } from "./ui/movers";
import { TwoMoveGame, onload } from './two-move'
import { getMover, MoverNames, MoverTypes } from "./player-movers";
import { MapNames, MapType, getMap } from "./maps";

import * as UITestPage from './ui/ui-test-page';
import { ITestPageEventHandlers, SettingName } from "./ui/ui-test-page-events";
import { IUIMover } from "./ui/types";






/* //TODO:
    All maps need to be resizeable
    get mover working
    'saveboard' button is not wired up to... anything..
    break up ui-test-page.ts into smaller files

*/




let TestOptions: UITestPage.ITestPageOptions = {
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
    const loadedOptions = UITestPage.getStoredOptions();
    TestOptions = loadedOptions ?? TestOptions;
    game = new TwoMoveGame(getGameOptionsFromTestOptions(TestOptions));
});

const getGameOptionsFromTestOptions = (testOptions: UITestPage.ITestPageOptions): IGameOptions => {
    let moverCreators: (() => IMover)[] = [];
    if (testOptions.moverType !== undefined && MoverNames.includes(testOptions.moverType)) {
        moverCreators.push(() => getMover(testOptions.moverType as MoverTypes, testOptions.moverSpeed ?? 150)!);
    }
    const GameOptions: IGameOptions = {
        //TODO: refactor to create GameOptions from TestOptions
        moverSpeed: testOptions.moverSpeed ?? 150,
        moverCreators: [getKeyboardMover, ...moverCreators],
        getNextMap: (player?: IPlayer) => getMap(
            testOptions.mapName as MapType, {
            boardHeight: testOptions.height === undefined ? 10 : testOptions.height,
            boardWidth: testOptions.width === undefined ? 10 : testOptions.width,
            cellWidth: testOptions.cellSize === undefined ? 25 : testOptions.cellSize,
            difficulty: testOptions.difficulty === undefined ? 50 : testOptions.difficulty / 100,
            playerLocation: player?.getPlayerLocation() ?? 0,
        })!,
        lightsout: false,
        preservePlayerDirection: true,
        fadeOnReset: false,
    }
    return GameOptions;
}

let changeHandlerDelay: NodeJS.Timeout | undefined = undefined;
const settingChangesQueue: { name: SettingName, value: string }[] = [];

const testHandlers: ITestPageEventHandlers = {
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

        if (!!changeHandlerDelay)
            clearTimeout(changeHandlerDelay);
    }, 2000)
};

const updateSettingsFromQueue = (): UITestPage.ITestPageOptions => {

    const optionsToUpdate: UITestPage.ITestPageOptions = {};

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
        }
        console.log("setting changed", setting);
    } while (settingChangesQueue.length > 0);

    const options = UITestPage.TestPageOptions.updateValues(
        UITestPage.TestPageOptions.init(TestOptions),
        UITestPage.TestPageOptions.init(optionsToUpdate)
    )

    console.log('updated options', options);
    return options;
};


UITestPage.init(MapNames, MoverNames, TestOptions, testHandlers);