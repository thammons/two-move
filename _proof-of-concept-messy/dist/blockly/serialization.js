import * as Blockly from '../../node_modules/blockly/core.js';
const storageKey = 'mainWorkspace';
export const save = function (workspace) {
    const data = Blockly.serialization.workspaces.save(workspace);
    window.localStorage?.setItem(storageKey, JSON.stringify(data));
};
export const load = function (workspace) {
    const data = window.localStorage?.getItem(storageKey);
    if (!data)
        return;
    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(JSON.parse(data), workspace, undefined);
    Blockly.Events.enable();
};
//# sourceMappingURL=serialization.js.map