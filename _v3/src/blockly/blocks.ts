import * as Blockly from 'blockly/core';


const move = {
  'type': 'move',
  'message0': 'move',
  'previousStatement': null,
  'nextStatement': null,
  'colour': 220,
  'tooltip': 'Move the player forward one square',
  'helpUrl': '',
};

const turnRight = {
  'type': 'turn-right',
  'message0': 'turn right',
  'previousStatement': null,
  'nextStatement': null,
  'colour': 220,
  'tooltip': 'Turn the player right one turn',
  'helpUrl': '',
};

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(
  [move, turnRight]);