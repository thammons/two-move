import { ISimpleEventHandler } from "../types";

export type SettingName = "board-height" | "board-width" | "cell-size" | "difficulty" | "map-type" | "mover-type" | "mover-speed";

export interface ISetting {
    name: SettingName;
    value: string;
}

export interface ITestPageEventHandlers {
    settingsChangeHanders: ISimpleEventHandler<ISetting>[];
}

export class TestPageEvents implements ITestPageEventHandlers {
    settingsChangeHanders: ISimpleEventHandler<ISetting>[] = [];

    constructor(handlers?: ITestPageEventHandlers) {
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