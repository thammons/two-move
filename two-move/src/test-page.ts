import MapGenerated from "./maps/generate-map1";
import { IGameOptions, IPlayer } from "./types";
import { getKeyboardMover } from "./ui/movers";
import { TwoMoveGame, onload } from './two-move'
import { getMover, MoverNames } from "./player-movers";
import { MapNames, MapType, getMap } from "./maps";

import * as UITestPage from './ui/ui-test-page';
import { ITestPageEventHandlers, SettingName } from "./ui/ui-test-page-events";

let TestOptions: UITestPage.ITestPageOptions = {
    height: 50,
    width: 50,
    cellSize: 10,
    difficulty: 50,
    mapName: 'generated',
    moverType: 'keyboard',
    moverSpeed: 150,
};

const GameOptions: IGameOptions = {
    moverSpeed: 150,
    moverCreators: [getKeyboardMover],// () => getMover('pacer', 500)!],
    getNextMap: (player?: IPlayer) => getMap(
        TestOptions.mapName as MapType, {
        boardHeight: TestOptions.height === undefined ? 10 : TestOptions.height,
        boardWidth: TestOptions.width === undefined ? 10 : TestOptions.width,
        cellWidth: TestOptions.cellSize === undefined ? 25 : TestOptions.cellSize,
        difficulty: TestOptions.difficulty === undefined ? 50 : TestOptions.difficulty / 100,
        playerLocation: player?.getPlayerLocation() ?? 0,
    })!,
    lightsout: false,
    preservePlayerDirection: true,
    fadeOnReset: false,
};

let game: TwoMoveGame;

window.addEventListener('load', () => {
    game = new TwoMoveGame(GameOptions);
});

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
        game.reset({
            //TODO: refactor to create GameOptions from TestOptions
            moverSpeed: 150,
            moverCreators: [getKeyboardMover],// () => getMover('pacer', 500)!],
            getNextMap: (player?: IPlayer) => getMap(
                TestOptions.mapName as MapType, {
                boardHeight: TestOptions.height === undefined ? 10 : TestOptions.height,
                boardWidth: TestOptions.width === undefined ? 10 : TestOptions.width,
                cellWidth: TestOptions.cellSize === undefined ? 25 : TestOptions.cellSize,
                difficulty: TestOptions.difficulty === undefined ? 50 : TestOptions.difficulty / 100,
                playerLocation: player?.getPlayerLocation() ?? 0,
            })!,
            lightsout: false,
            preservePlayerDirection: true,
            fadeOnReset: false,
        });

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