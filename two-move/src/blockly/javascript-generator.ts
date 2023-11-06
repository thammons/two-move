/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import { Order } from 'blockly/javascript';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

// This file has no side effects!

forBlock['move'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {

  const move = generator.provideFunction_(
    'move',
    `function move() {
      const el = document.getElementById('move-btn');
      el.click();
    }`
  );
  // Generate the function call for this block.
  const code = `${move}();\n`;
  return code;
};

forBlock['turn-right'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {

  const turnRight = generator.provideFunction_(
    'turnRight',
    `function turnRight() {
      const el = document.getElementById('turn-btn');
      el.click();
    }`
  );
  // Generate the function call for this block.
  const code = `${turnRight}();\n`;
  return code;
};