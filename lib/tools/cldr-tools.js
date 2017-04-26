// © Copyright Mocoolka Corporation 2015,2017.
// Node module: mocoolka-tools
// LICENSE: MIT

/** @module mocoolka-tools-cldr */

const { moduleTools, errorTools } = require( 'mocoolka-tools');

/**
 * Returns an array of locales supported by the local cldr data.
 * @param {string} [cldrDirectory] -cldr dictionary
 * @return {Array}
 */
let getSupportedLanguages = (cldrDirectory)=> {

  let languages = [];
  moduleTools.enumerateFilesSync(cldrDirectory, null, ['json'], false, function (content, path) {
    let cldr = null;
    try {
      cldr = JSON.parse(content);
    } catch (e) {
      errorTools.throwParseFileError(path);
    }

    let mainLanguages = Object.keys(cldr.main || {});
    languages = languages.concat(mainLanguages);
  });

  return [...new Set(languages)];
};

/**
 * if language be supported by cldr return true
 * @param {string} language -Supported languages in CLDR notation
 * @param {string}  [cldrDirectory] - cldr directory
 * @return {boolean} true for 'en' and supported languages in CLDR notation.
 */
const isSupportedLanguage = (language,  cldrDirectory)=> {
  if (!language)
    return false;
  let supportLanguages = getSupportedLanguages(cldrDirectory);
  return supportLanguages.includes(language);
};

/**
 * if language be supported by cldr return true
 * @param {string} language Supported languages in CLDR notation
 * @param {string}cldrDirectory cldr directory
 * @return {boolean} true for 'en' and supported languages in CLDR notation.
 */
const getSupportedLanguage = (language,  cldrDirectory)=> (
  isSupportedLanguage(language, cldrDirectory) ? language : null
);

/**
 * @callback cldr_callback
 * @param {Object} container cldr data
 */

/**
 * load cldr with languages
 * @param {string[]}languages - need load language array
 * @param {string} path - root path
 * @param {cldr_callback} callback - if find cldr file then execute callback
 */
const loadCldr = (languages, path, callback)=> {
  let supportedLanguages = [];
  moduleTools.enumerateFilesSync(path, null, ['json'], false,
    function (content, filePath) {
      let cldr = null;
      try {
        cldr = JSON.parse(content);
      } catch (e) {
        errorTools.throwParseFileError(filePath);
      }
      let mainLanguages = Object.keys(cldr.main || {});
      supportedLanguages = supportedLanguages.concat(mainLanguages);
      cldrTools.supportedLanguages = [...new Set(supportedLanguages)];
      let cldrMain = { main: {} };
      languages.map(language=> {
        cldrMain.main[language] = cldr.main[language];
        callback(cldrMain);

        // if language is en then load supplemental
        if (language === 'en') {
          let cldrSupplemental = { supplemental: cldr.supplemental };
          callback(cldrSupplemental);
        }
      });
    });
};

const cldrTools = {
  getSupportedLanguages,
  getSupportedLanguage,
  isSupportedLanguage,
  loadCldr,
  supportedLanguages:[],
};

module.exports = cldrTools;
