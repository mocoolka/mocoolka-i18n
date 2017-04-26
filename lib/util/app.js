
const  _  = require('lodash');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { fileTools } = require('mocoolka-tools');
const LANGS = [
  'en', // English
  'zh-Hans', // Chinese (Simplified)
];
let constCLDR = (dirname, outDirname, languages)=> {
  if (dirname === undefined) {
    dirname = __dirname;
  }

  if (outDirname === undefined)
    outDirname = dirname;
  if (languages === undefined)
    languages = LANGS;
  let cldrVersion = require(path.resolve(dirname,
    'node_modules', 'cldr-data', 'package.json')).version;
  let CLDR = {};
  languages.forEach(function (lang) {
    loadCldr(CLDR, dirname, lang);
  });

  let CLDR_FILE = path.join(outDirname, 'cldr_' + cldrVersion + '.json');
  fs.writeFileSync(CLDR_FILE, JSON.stringify(CLDR));
};

let constCLDRDefault = ()=> {
  fileTools.createDirNotExist(fileTools.path(__dirname, '..', '..', 'cldr'));
  constCLDR(fileTools.path(__dirname, '..', '..'), fileTools.path(__dirname, '..', '..', 'cldr'));
};

let loadCldr = (CLDR, dirname, lang)=> {
  let mainPath = path.join(dirname, 'node_modules',
    'cldr-data', 'main', '%s');
  let bundleCa = path.join(mainPath, 'ca-gregorian');
  let bundleCurrencies = path.join(mainPath, 'currencies');
  let bundleDates = path.join(mainPath, 'dateFields');
  let bundleNumbers = path.join(mainPath, 'numbers');

  CLDR = _.merge(CLDR, require(util.format(bundleCa, lang)));
  CLDR = _.merge(CLDR, require(util.format(bundleCurrencies, lang)));
  CLDR = _.merge(CLDR, require(util.format(bundleDates, lang)));
  CLDR = _.merge(CLDR, require(util.format(bundleNumbers, lang)));
  CLDR = _.merge(CLDR, require(util.format(path.join(mainPath, 'timeZoneNames'), lang)));
  CLDR = _.merge(CLDR, require(util.format(path.join(mainPath, 'units'), lang)));
  if (lang === 'en') {
    let supplementalPath = path.join('cldr-data', 'supplemental');
    let likelySubtags = require(path.join(supplementalPath, 'likelySubtags'));
    CLDR = _.merge(CLDR, likelySubtags);
    CLDR = _.merge(CLDR, require(path.join(supplementalPath, 'plurals')));
    CLDR = _.merge(CLDR, require(path.join(supplementalPath, 'ordinals')));
    CLDR = _.merge(CLDR, require(path.join(supplementalPath, 'numberingSystems')));

    CLDR = _.merge(CLDR, require(path.join(supplementalPath, 'timeData')));
    CLDR = _.merge(CLDR, require(path.join(supplementalPath, 'weekData')));
    CLDR = _.merge(CLDR, require(path.join(supplementalPath, 'currencyData')));
  }
};

export default constCLDR;
constCLDRDefault();
