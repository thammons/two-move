import * as Blockly from '../../node_modules/blockly/core.js';
const addText = {
    'type': 'add_text',
    'message0': 'Add text %1 with color %2',
    'args0': [
        {
            'type': 'input_value',
            'name': 'TEXT',
            'check': 'String',
        },
        {
            'type': 'input_value',
            'name': 'COLOR',
            'check': 'Colour',
        },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 160,
    'tooltip': '',
    'helpUrl': '',
};
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([addText]);
//# sourceMappingURL=blocks.js.map