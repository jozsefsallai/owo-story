const fs = require('fs');
const path = require('path');

const request = require('request');
const unzipper = require('unzipper');

const TEMP_PATH = path.resolve(__dirname, '..', 'temp');
const ZIP_PATH = path.resolve(TEMP_PATH, 'cavestoryen.zip');

const ZIP_URL = 'https://www.cavestory.org/downloads/cavestoryen.zip';

const CAVESTORY_FOLDER_PATH = path.resolve(__dirname, '..', 'dist');
const CAVESTORY_EXE_PATH = path.resolve(CAVESTORY_FOLDER_PATH, 'CaveStory', 'Doukutsu.exe');

const ASSETS_PATH = path.resolve(__dirname, '..', 'assets');
const ASSETS = [
  'Config.dat',
  'data/Title.pbm'
];

function downloadZip() {
  const zip = fs.createWriteStream(ZIP_PATH);

  return new Promise((resolve, reject) => {
    return request
      .get(ZIP_URL)
      .pipe(zip)
      .on('finish', () => {
        console.log('Downloaded ZIP.');
        resolve();
      })
      .on('error', err => reject(err));
  });
}

function extractZip() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(ZIP_PATH)
      .pipe(unzipper.Extract({ path: CAVESTORY_FOLDER_PATH }))
      .promise()
      .then(() => {
        console.log('Extracted game files.');
        return resolve();
      })
      .catch(err => reject(err));
  });
}

function copyAsset(key) {
  fs.writeFileSync(
    path.join(__dirname, '..', 'dist', 'CaveStory', key),
    fs.readFileSync(path.resolve(ASSETS_PATH, key))
  );

  console.log(`Copied asset ${key}!`);
}

(async function () {
  try {
    let anyStepDone = false;

    if (!fs.existsSync(ZIP_PATH)) {
      await downloadZip();
      anyStepDone = true;
    }

    if (!fs.existsSync(CAVESTORY_EXE_PATH)) {
      await extractZip()
      ASSETS.forEach(asset => copyAsset(asset));

      anyStepDone = true;
    }

    if (!anyStepDone) {
      console.log('Nothing to do!');
      process.exit();
    }

    console.log('Done!');
  } catch (err) {
    throw new Error(err);
  }
})();
