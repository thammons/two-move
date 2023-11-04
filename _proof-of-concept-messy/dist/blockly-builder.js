import * as Blockly from '../node_modules/blockly/index.js';
import { blocks } from './blockly/blocks.js';
import { javascriptGenerator } from '../node_modules/blockly/javascript.js';
import { save, load } from './blockly/serialization.js';
import { toolbox } from './blockly/toolbox.js';
import { forBlock } from './blockly/javascript-generator.js';
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
const codeDiv = document.getElementById('generatedCode')?.firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');
const ws = blocklyDiv && Blockly.inject(blocklyDiv, { toolbox });
const runCode = () => {
    const code = javascriptGenerator.workspaceToCode(ws);
    if (codeDiv)
        codeDiv.textContent = code;
    if (outputDiv)
        outputDiv.innerHTML = '';
    eval(code);
};
if (ws) {
    load(ws);
    runCode();
    ws.addChangeListener((e) => {
        if (e.isUiEvent)
            return;
        save(ws);
    });
    ws.addChangeListener((e) => {
        if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING ||
            ws.isDragging()) {
            return;
        }
        runCode();
    });
}
//# sourceMappingURL=blockly-builder.js.map