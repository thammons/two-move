import { Order } from '../../node_modules/blockly/javascript.js';
export const forBlock = Object.create(null);
forBlock['add_text'] = function (block, generator) {
    const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
    const color = generator.valueToCode(block, 'COLOR', Order.ATOMIC) || "'#ffffff'";
    const addText = generator.provideFunction_('addText', `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text, color) {

  // Add text to the output area.
  const outputDiv = document.getElementById('output');
  const textEl = document.createElement('p');
  textEl.innerText = text;
  textEl.style.color = color;
  outputDiv.appendChild(textEl);
}`);
    const code = `${addText}(${text}, ${color});\n`;
    return code;
};
//# sourceMappingURL=javascript-generator.js.map