'use strict';

import fs from 'fs';
import { promisify } from 'util';

const readFileSync = promisify(fs.readFile);
const writeFileSync = promisify(fs.writeFile);

// initially fetch the json file
const fetchTokens = async () =>
  readFileSync('tokens.json')
    .catch((err) => console.log(err))
    .then((file) => JSON.parse(file));

// parse the tokens correctly
const parseTokens = async (tokens) => {
  let colors = new Map();
  for (const [key, value] of Object.entries(tokens)) {
    colors.set(key, value.value);
  }
  return colors;
}

// write the file
const createVariablesFile = async (colors) => {
  const colorMap = new Map(colors);
  let cssString = ':root {\n';

  colorMap.forEach((value, key) => {
    cssString = cssString.concat(`  ${key}: ${value};\n`);
  });

  cssString = cssString.concat('}');
  await writeFileSync('variables.css', cssString);
}

// run the method
const run = async () => fetchTokens()
  .then(parseTokens)
  .then(createVariablesFile)

// run the script
run();
