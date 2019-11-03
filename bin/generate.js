const { TSC } = require('chie');
const { Script } = require('../lib/Script');

const path = require('path');
const fs = require('fs');

const TSC_PATH = path.resolve(__dirname, '..', 'dist', 'CaveStory', 'data', 'Stage');
const files = fs.readdirSync(TSC_PATH);

files.forEach(file => {
  if (!file.toLowerCase().endsWith('tsc')) {
    return;
  }

  const f = path.resolve(TSC_PATH, file);

  const tsc = TSC().fromFile(f).decrypt().toString();
  const converted = new Script(tsc).convert();

  TSC().fromString(converted).encrypt().toFile(f);

  console.log(`Done: ${file}!`);
});

console.log('All done! uwu');
