import { IMapBuilderEvents, IMapSettingsData } from "./types";
import * as MapSettingsUI from './map-settings-ui';
import * as MapBuilderUI from './map-builder-ui';

export function init(mapNames: string[], moverTypes: string[], options?: IMapSettingsData, eventHandlers?: IMapBuilderEvents) {
    MapSettingsUI.init(mapNames, moverTypes, options, eventHandlers);
    MapBuilderUI.init(eventHandlers);
};

export function getStoredMapSettings() { return MapSettingsUI.getStoredOptions() };
