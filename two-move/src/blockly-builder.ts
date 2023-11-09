import * as Blockly from 'blockly/index';

import { blocks } from './blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import { save, load } from './blockly/serialization';
import { toolbox } from './blockly/toolbox-small';
import { forBlock } from './blockly/javascript-generator';
import { IGameOptions, IPlayer } from './types';
import { getButtonMover, getKeyboardMover } from './ui/movers';
import MapGenerated from './maps/generate-map1';
import { onload } from './two-move';

// import './index.css';
const darktheme = Blockly.Theme.defineTheme('dark', {
  'base': Blockly.Themes.Classic,
  'name': 'Dark',
  'componentStyles': {
    'workspaceBackgroundColour': '#1e1e1e',
    'toolboxBackgroundColour': 'blackBackground',
    'toolboxForegroundColour': '#fff',
    'flyoutBackgroundColour': '#252526',
    'flyoutForegroundColour': '#ccc',
    'flyoutOpacity': 1,
    'scrollbarColour': '#797979',
    'insertionMarkerColour': '#fff',
    'insertionMarkerOpacity': 0.3,
    'scrollbarOpacity': 0.4,
    'cursorColour': '#d0d0d0',
    // 'blackBackground': '#333',
  },
});

const BlocklyGameOptions: IGameOptions = {
  moverSpeed: 150,
  moverCreators: [getButtonMover, getKeyboardMover],
  getNextMap: (player: IPlayer) => new MapGenerated(player?.getPlayerLocation() ?? 0),
  lightsout: false,
  fadeOnReset: false,
  preservePlayerDirection: false,
}

onload(BlocklyGameOptions);


// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
let ws: Blockly.WorkspaceSvg | null = null;

const runCode = () => {
  resetBtn?.click();
  const code = javascriptGenerator.workspaceToCode(ws);
  // if (codeDiv) codeDiv.textContent = code;

  // if (outputDiv) outputDiv.innerHTML = '';

  eval(code);
};

// window.onload = () => {

// Set up UI elements and inject Blockly
// const codeDiv = document.getElementById('generatedCode')?.firstChild;
// const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');
ws = blocklyDiv && Blockly.inject(blocklyDiv, { toolbox, theme: darktheme });


const runBtn = document.getElementById('run-btn');
if (runBtn) {
  runBtn.onclick = runCode;
}
const resetBtn = document.getElementById('restart-btn');
// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.


if (ws) {
  // Load the initial state from storage and run the code.
  if (load(ws)) {
    runCode();
  }

  // Every time the workspace changes state, save the changes to storage.
  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    save(ws!);
  });


  // Whenever the workspace changes meaningfully, run the code again.
  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING ||
      ws!.isDragging()) {
      return;
    }
    runCode();
  });
}
// }