// © Copyright Mocoolka Corporation 2015,2017.
// Node module: mocoolka-tools
// LICENSE: MIT

/** @module mocoolka-tools-i18n */
const {
   fileTools,  errorTools, iteratorTools,  typeTools, moduleTools, serviceTools,
} = require('mocoolka-tools');

const cldrTools = require('./tools/cldr-tools')
const Globalize = require('globalize');


/**
 * This callback is displayed as part of the no return data member.
 * @callback noDataCallback
 * @param {Object} error - Determines whether the function have error.null if no error;
 */
/**
 * init i18n
 * @param {Object} options - init option
 * @property {string} options.rootPath - root path contain intl
 * @param {noDataCallback} callback
 */
function init (options,callback) {
  if(!typeTools.isFunction(callback))
    return;
  try {
    options = i18nManager.initOptions || options;

    errorTools.validateJsonSchema({
        schema: i18nManager.schemas.init,
        data: options
      })

    let rootPath = options.rootPath;
    setI18NDirectory(rootPath);

    i18nManager.VERSION_MODULE = moduleTools.getModuleVersion(i18nManager.setting.ROOT_PATH);
    i18nManager.VERSION_GLOBALIZE = moduleTools.getModuleVersion(
      fileTools.path(i18nManager.setting.ROOT_PATH, 'node_modules', 'globalize'));
    serviceTools.standClient('mocoolka-setting', 'applyModuleSetting',
      {moduleName: i18nManager.moduleName, moduleDefaultSetting: i18nManager.setting}, (errors, data)=> {
        if (errors) {
          throw errors;
        }
        i18nManager.setting = data;
        loadBundles();
        loadMessage({rootPath: i18nManager.setting.ROOT_PATH, includeNodeModules: true}, (error)=> {
          if (error)
            throw(error);
        });
        callback(null, i18nManager.setting)
      })
  }
  catch(ex){
    errorTools.errorHandler(ex,callback);
  }
}


/**
 * get language be supported by cldr return true
 * @private
 * @param {string} language name
 * @return {string} true for 'en' and supported languages in CLDR notation.
 */
const getSupportedLanguage = (language)=> {
  if (i18nManager.SUPPORTS_LANGUAGES.includes(language))
    return language;
  else {
    return getLanguage();
  }

};

/**
 * This callback is displayed as part of the getSupportedLanguages member.
 * @callback getSupportedLanguagesCallback
 * @param {Object} error - Determines whether the function have error.null if no error;
 * @param {Object} data
 * @property {Array} data.result -array of string include language
 */
/**
 * an array of locales is supported by the i18n module
 * @param {getSupportedLanguagesCallback} callback -
 */
let getSupportedLanguages = (callback)=> {
  if (!typeTools.isFunction(callback))
    return;
  try {
    callback(null, {result: i18nManager.setting.SUPPORTS_LANGUAGES});
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};
/**
 * @private
 * set module directory path to i18nManager.
 * CLDR-PATH INTL-PATH ROOT-PATH LOG-PATH
 * @param {string} rootPath -root path
 */
const setI18NDirectory = (rootPath)=> {
  errorTools.directoryNotExist(rootPath);
  errorTools.directoryNotExist(fileTools.path(rootPath, 'intl'));
  errorTools.directoryNotExist(fileTools.path(__dirname, '..',  'cldr'));
  i18nManager.setting.CLDR_PATH = fileTools.path(__dirname, '..', 'cldr');
  i18nManager.setting.INTL_PATH = fileTools.path(rootPath, 'intl');
  i18nManager.setting.ROOT_PATH = rootPath;
  i18nManager.setting.LOG_PATH = fileTools.path(rootPath, 'logs');
};

/**
 * set default language
 * @private
 * @param {string} language
 */
const setLanguage = (language)=> {
  language = getSupportedLanguage(language) || i18nManager.setting.LANGUAGE;
  i18nManager.locale(language);
  i18nManager.setting.LANGUAGE = language;
};

/**
 * get default language
 * @private
 * @return {string}
 */
const getLanguage = ()=> (
  i18nManager.setting.LANGUAGE
);

/**
 * load bundles and cldr with language
 * @private
 * @param {string}lang - need load language
 * @return {Object}
 */
const loadBundles = ()=> {
  cldrTools.loadCldr(i18nManager.setting.SUPPORTS_LANGUAGES, i18nManager.setting.CLDR_PATH, (data)=> {
    i18nManager.load(data);
  });
  i18nManager.setting.SUPPORTS_LANGUAGES.map(language=> {
      i18nManager.bundles[language] = new Globalize(language);
    });

};

/**
 * load message in path
 * @param {Object} options
 * @property {string} options.rootPath - path contain intl directory
 * @param {noDataCallback} callback
 */
const loadMessage = (options, callback)=> {
  if(!typeTools.isFunction(callback))
    return;
  try {
  errorTools.validateJsonSchema({
    schema: i18nManager.schemas.loadMessage,
    data: options
  });
  let rootPath=options.rootPath;
  errorTools.directoryNotExist(rootPath);

  let enumerateNodeModules =options.includeNodeModules|| false;

  moduleTools.enumerateFilesSync(rootPath, [], i18nManager.setting.MESSAGE_FILE_EXT_NAMES, enumerateNodeModules,
    function (jsonObj) {

      i18nManager.loadMessages(JSON.parse(jsonObj));
    });
  callback(null);
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};
/**
 * This callback is displayed as part of the format member.
 * @callback formatCallback
 * @param {Object} error - Determines whether the function have error.null if no error;
 * @param {Object} data
 * @property {string|number} data.result -format result
 */

/**
 *  formats a abbreviation (using ICU message format pattern) given its path
 *  and a set of variables into a user-readable string.
 *  It supports pluralization and gender inflections.
 *  no error even if path not found
 * @param {Object} msg
 * @property {string} msg.id - path in intl file
 * @property {Object} msg.value - variables in intl file with the path
 * @property {string} msg.language - format message using the language
 * @param {formatCallback}callback
 */
const formatAbbreviation = (msg, callback)=> {
    if(!typeTools.isFunction(callback))     return;
  try {
  errorTools.validateJsonSchema({
    schema: i18nManager.schemas.formatMessage,
    data: msg
  });
  let id = msg.id;
  let value = msg.value;
  let language = msg.language || i18nManager.setting.LANGUAGE;;
  let G = i18nManager.bundles[language];
  let result = null;
  try {
    result = G.formatMessage(id, value);
    callback(null,{result:result});
  } catch (e) {
    callback(null,{result:null});
  }
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};

/**
 *  formats a message (using ICU message format pattern) given its path
 *  and a set of variables into a user-readable string.
 *  It supports pluralization and gender inflections.
 *  throw error if path not found
 * @param {Object} msg
 * @property {string} msg.id - path in intl file
 * @property {Object} msg.value - variables in intl file with the path
 * @property {string} msg.language - format message using the language
 * @param {formatCallback}callback
 */
const formatMessage = (msg, callback)=> {
    if(!typeTools.isFunction(callback))     return;
  try {
  errorTools.validateJsonSchema({
    schema: i18nManager.schemas.formatMessage,
    data: msg
  });
  let id = msg.id;
  let value = msg.value;
  let language = msg.language || i18nManager.setting.LANGUAGE;;
  let G = i18nManager.bundles[language];
  let result = null;
  try {
    result = G.formatMessage(id, value);
    callback(null,{result});
  } catch (e) {
    try {
      msg = G.formatMessage('i18n/E-MISS-MESSAGE', msg);
    }
    catch (ex) {
      errorTools.throwError({
        id: 'i18n system error.The base message "i18n/E-MISS-MESSAGE" can\'t found',
      });
    }
    errorTools.throwError({
      id: 'i18n.E-MISS-MESSAGE',
      value: msg, stack: e.toString()
    });
  }
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};

/**
 *  formats a message (using ICU message format pattern) given its path
 *  and a set of variables into a user-readable string.
 *  It supports pluralization and gender inflections.
 *  throw error if path not found
 *  will return with all support language
 * @param {Object} msg
 * @property {string} msg.id - path in intl file
 * @property {Object} msg.value - variables in intl file with the path
 * @param {formatCallback}callback
 */
const formatMessages = (msg, callback)=> {
    if(!typeTools.isFunction(callback))     return;
  try {
  errorTools.validateJsonSchema({
    schema: i18nManager.schemas.formatMessage,
    data: msg
  });
  let result={};
  result.id=msg.id;
  if(msg.value)
    result.value= msg.value;
  iteratorTools.iterator(i18nManager.setting.SUPPORTS_LANGUAGES,language=>{
    result.language=language;
    formatMessage(result,(error,data)=>{
      if(error){
        callback(error);
        return;
      }
      if(!result.message)
        result.message={};
      result.message[language]=data.result;
    })
  })
  delete result.language;
  callback(null,{result:result});
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};
/**
 *  formats a message (using ICU message format pattern) given its path
 *  and a set of variables into a user-readable string.
 *  It supports pluralization and gender inflections.
 *  no throw error if path not found
 *  will return with all support language
 * @param {Object} msg
 * @property {string} msg.id - path in intl file
 * @property {Object} msg.value - variables in intl file with the path
 * @param {formatCallback}callback
 */
const formatAbbreviations = (msg, callback)=> {
    if(!typeTools.isFunction(callback))     return;
  try {
  errorTools.validateJsonSchema({
    schema: i18nManager.schemas.formatMessage,
    data: msg
  });
  let result={};
  result.id=msg.id;
  if(msg.value)
    result.value= msg.value;
  iteratorTools.iterator(i18nManager.setting.SUPPORTS_LANGUAGES,language=>{
    result.language=language;
    formatAbbreviation(result,(error,data)=>{
      if(error){
        callback(error);
        return;
      }
      if(data.result) {
        if (!result.message)
          result.message = {};
        result.message[language] = data.result;
      }
    })
  })
  delete result.language;
  callback(null,{result:result});
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};

/**
 *  formats a number according to the given options
 * @param {Object} msg
 * @property {string} msg.value - the value will format
 * @property {Object} msg.options - format options. detail see cldr
 * @property {string} msg.language - format message using the language
 * @param {formatCallback}callback
 */
const formatNumber = (msg, callback)=> {
    if(!typeTools.isFunction(callback))     return;
  try {
  errorTools.validateJsonSchema({
    schema: i18nManager.schemas.formatNumber,
    data: msg
  });
  let value = msg.value;
  let options = msg.options || i18nManager.setting.DEFAULT_NUMBER_FORMAT;
  let language = msg.language || i18nManager.setting.LANGUAGE;;
  let G = i18nManager.bundles[language];
  let result = null;
  try {
    result = G.formatNumber(value, options);
    callback(null,{result});
  } catch (e) {
    errorTools.throwError({
      id: 'i18n.E-MISS-FORMAT-NUMBER',
      value: msg, stack: e.toString()
    });
  }
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};
/**
 *  formats a number according to the given options
 *  will return with all support language
 * @param {Object} msg
 * @property {string} msg.value - the value will format
 * @property {Object} msg.options - format options. detail see cldr
 * @property {string} msg.language - format message using the language
 * @param {formatCallback}callback
 */
const formatNumbers = (msg, callback)=> {
  if(!typeTools.isFunction(callback))     return;
  try {
    errorTools.validateJsonSchema({
      schema: i18nManager.schemas.formatNumber,
      data: msg
    });
    let result={};
    result.value=msg.value;
    if(msg.options)
    result.options = msg.options ;
    iteratorTools.iterator(i18nManager.setting.SUPPORTS_LANGUAGES,language=>{
      result.language=language;
      formatNumber(result,(error,data)=>{
        if(error){
          callback(error);
          return;
        }
        if(!result.message)
          result.message={};
        result.message[language]=data.result;
      })
    })
    delete result.language;
    callback(null,{result:result});
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};
/**
 *  formats a date according to the given options
 * @param {Object} msg
 * @property {string} msg.value - the value will format
 * @property {Object} msg.options - format options. detail see cldr
 * @property {string} msg.language - format message using the language
 * @param {formatCallback}callback
 */
const formatDate = (msg, callback)=> {
    if(!typeTools.isFunction(callback))     return;

  try {
    errorTools.validateJsonSchema({
      schema: i18nManager.schemas.formatDate,
      data: msg
    });
    let value = new Date(msg.value);
    let options = msg.options || i18nManager.setting.DEFAULT_DATETIME_FORMAT;
    let language = msg.language || i18nManager.setting.LANGUAGE;
    ;
    let G = i18nManager.bundles[language];
    let result = null;
    try {
      result = G.formatDate(value, options);
      callback(null, {result});
    } catch (e) {

      errorTools.throwError({
        id: 'i18n.E-MISS-FORMAT-DATE',
        value: msg, stack: e.toString()
      });
    }
  }

catch (ex) {
  errorTools.errorHandler(ex, callback);
}

};
/**
 *  formats a date according to the given options
 *  format with all support language
 * @param {Object} msg
 * @property {string} msg.value - the value will format
 * @property {Object} msg.options - format options. detail see cldr
 * @param {formatCallback}callback
 */
const formatDates = (msg, callback)=> {
  if(!typeTools.isFunction(callback))     return;
  try {
    errorTools.validateJsonSchema({
      schema: i18nManager.schemas.formatDate,
      data: msg
    });
    let result={};
    result.value=msg.value;
    if(msg.options)
      result.options = msg.options ;
    iteratorTools.iterator(i18nManager.setting.SUPPORTS_LANGUAGES,language=>{
      result.language=language;
      formatDate(result,(error,data)=>{
        if(error){
          callback(error);
          return;
        }
        if(!result.message)
          result.message={};
        result.message[language]=data.result;
      })
    })
    delete result.language;
    callback(null,{result:result});
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};
/**
 *  returns the value's corresponding plural group: zero, one, two, few, many, or other.
 * The function may be used for cardinals or ordinals.
 * @param {Object} msg
 * @property {string} msg.value - the value will format
 * @property {Object} msg.options - format options. detail see cldr
 * @property {string} msg.language - format message using the language
 * @param {formatCallback}callback
 */
const plural = (msg, callback)=> {
    if(!typeTools.isFunction(callback))     return;
  try {
    errorTools.validateJsonSchema({
      schema: i18nManager.schemas.plural,
      data: msg
    });
  let value = msg.value;
  let options = msg.options || i18nManager.setting.DEFAULT_PLURAL_FORMAT;
  let language = msg.language || i18nManager.setting.LANGUAGE;;
  let G = i18nManager.bundles[language];
  let result = null;
  try {
    result = G.plural(value, options);
    callback(null,{result});
  } catch (e) {
    errorTools.throwError({
      id: 'i18n.E-MISS-FORMAT-PLURAL',
      value: msg, stack: e.toString()
    });
  }
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};
/**
 *  formats a relative time according to the given unit, options, and the default/instance locale.
 * @param {Object} msg
 * @property {string} msg.value - the value will format
 * @property {string} msg.unit - time unit
 * @property {Object} msg.options - format options. detail see cldr
 * @property {string} msg.language - format message using the language
 * @param {formatCallback}callback
 */
const formatRelativeTime = (msg, callback)=> {
    if(!typeTools.isFunction(callback))     return;
  try {
  errorTools.validateJsonSchema({
      schema: i18nManager.schemas.formatRelativeTime,
      data: msg
    });
  let value = msg.value;
  let options = msg.options || i18nManager.setting.DEFAULT_RELATIVE_FORMAT;
  let language = msg.language || i18nManager.setting.LANGUAGE;
  ;
  let G = i18nManager.bundles[language];
  let result = null;
  try {
    result = G.formatRelativeTime(value, msg.unit, options);

    callback(null, {result});
  } catch (e) {

    errorTools.throwError({
      id: 'i18n.E-MISS-FORMAT-RELATIVE-TIME',
      value: msg, stack: e.toString()
    });
  }
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
}
/**
 *  formats a relative time according to the given unit, options, and the default/instance locale.
 *  format with all support language
 * @param {Object} msg
 * @property {string} msg.value - the value will format
 * @property {string} msg.unit - time unit
 * @property {Object} msg.options - format options. detail see cldr
 * @property {string} msg.language - format message using the language
 * @param {formatCallback}callback
 */
const formatRelativeTimes = (msg, callback)=> {
  if(!typeTools.isFunction(callback))     return;
  try {
    errorTools.validateJsonSchema({
      schema: i18nManager.schemas.formatRelativeTime,
      data: msg
    });
    let result={};
    result.value=msg.value;
    result.unit=msg.unit;
    if(msg.options)
      result.options = msg.options ;
    iteratorTools.iterator(i18nManager.setting.SUPPORTS_LANGUAGES,language=>{
      result.language=language;
      formatRelativeTime(result,(error,data)=>{
        if(error){
          callback(error);
          return;
        }
        if(!result.message)
          result.message={};
        result.message[language]=data.result;
      })
    })
    delete result.language;
    callback(null,{result:result});
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};
/**
 * formats a unit according to the given unit, options, and the default/instance locale.
 * @param {Object} msg
 * @property {string} msg.value - the value will format
 * @property {string} msg.unit - value unit
 * @property {Object} msg.options - format options. detail see cldr
 * @property {string} msg.language - format message using the language
 * @param {formatCallback}callback
 */
const formatUnit = (msg, callback)=> {
    if(!typeTools.isFunction(callback))     return;
  try {
  errorTools.validateJsonSchema({
    schema: i18nManager.schemas.formatUnit,
    data: msg
  });
  let value = msg.value;
  let options = msg.options || i18nManager.setting.DEFAULT_UNIT_FORMAT;
  let language = msg.language || i18nManager.setting.LANGUAGE;
  ;
  let G = i18nManager.bundles[language];
  let result = null;
  try {
    result = G.formatUnit(value, msg.unit, options);
    callback(null, {result});
  } catch (e) {
    errorTools.throwError({
      id: 'i18n.E-MISS-FORMAT-UNIT',
      value: msg, stack: e.toString()
    });
  }
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
}
/**
 * formats a unit according to the given unit, options, and the default/instance locale.
 * format with all support language
 * @param {Object} msg
 * @property {string} msg.value - the value will format
 * @property {string} msg.unit - value unit
 * @property {Object} msg.options - format options. detail see cldr
 * @param {formatCallback}callback
 */
const formatUnits = (msg, callback)=> {
  if(!typeTools.isFunction(callback))     return;
  try {
    errorTools.validateJsonSchema({
      schema: i18nManager.schemas.formatUnit,
      data: msg
    });
    let result={};
    result.value=msg.value;
    result.unit=msg.unit;
    if(msg.options)
      result.options = msg.options ;
    iteratorTools.iterator(i18nManager.setting.SUPPORTS_LANGUAGES,language=>{
      result.language=language;
      formatUnit(result,(error,data)=>{
        if(error){
          callback(error);
          return;
        }
        if(!result.message)
          result.message={};
        result.message[language]=data.result;
      })
    })
    delete result.language;
    callback(null,{result:result});
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};
/**
 *  formats a currency according to the given options or locale's defaults.
 * @param {Object} msg
 * @property {string} msg.value - the value will format
 * @property {string} msg.currencySymbol - currency symbol
 * @property {Object} msg.options - format options. detail see cldr
 * @property {string} msg.language - format message using the language
 * @param {formatCallback}callback
 */
const formatCurrency = (msg, callback)=> {
    if(!typeTools.isFunction(callback))     return;
  try {
  errorTools.validateJsonSchema({
    schema: i18nManager.schemas.formatCurrency,
    data: msg
  });
  let value = msg.value;
  let options = msg.options || i18nManager.setting.DEFAULT_CURRENCY_FORMAT;
  let language = msg.language || i18nManager.setting.LANGUAGE;
  ;
  let G = i18nManager.bundles[language];
  let result = null;
  try {
    result = G.formatCurrency(value, msg.currencySymbol, options);
    callback(null, {result});
  } catch (e) {
    errorTools.throwError({
      id: 'i18n.E-MISS-FORMAT-CURRENCY',
      value: msg, stack: e.toString()
    });
  }
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
}
/**
 * formats a currency according to the given options or locale's defaults.
 * format with all support language
 * @param {Object} msg
 * @property {string} msg.value - the value will format
 * @property {string} msg.currencySymbol - currency symbol
 * @property {Object} msg.options - format options. detail see cldr
 * @param {formatCallback}callback
 */
const formatCurrencies = (msg, callback)=> {
  if(!typeTools.isFunction(callback))     return;
  try {
    errorTools.validateJsonSchema({
      schema: i18nManager.schemas.formatCurrency,
      data: msg
    });
    let result={};
    result.value=msg.value;
    result.currencySymbol=msg.currencySymbol;
    if(msg.options)
      result.options = msg.options ;
    iteratorTools.iterator(i18nManager.setting.SUPPORTS_LANGUAGES,language=>{
      result.language=language;
      formatCurrency(result,(error,data)=>{
        if(error){
          callback(error);
          return;
        }
        if(!result.message)
          result.message={};
        result.message[language]=data.result;
      })
    })
    delete result.language;
    callback(null,{result:result});
  }
  catch (ex) {
    errorTools.errorHandler(ex, callback);
  }
};

let i18nManager = {
  moduleName: 'mocoolka-i18n',
  setting:{
    ORIGINAL_LANGUAGE: 'en',
    DEFAULT_DATETIME_FORMAT: { datetime: 'medium' },
    DEFAULT_PLURAL_FORMAT: { type: 'ordinal' },
    DEFAULT_RELATIVE_FORMAT: {},
    DEFAULT_UNIT_FORMAT: { form: 'short' },
    DEFAULT_NUMBER_FORMAT: { round: 'floor' },
    DEFAULT_CURRENCY_FORMAT: { style: 'name' },
    LANGUAGE: 'en',
    DEFAULT_MESSAGE_FILE_EXT_NAME: 'mk-message.json',
    DEFAULT_MESSAGE_FILE_PATH: 'intl',
    MESSAGE_FILE_EXT_NAMES: ['mk-message.json'],
    ORIGINAL_MESSAGE: true,
    THROW_ERROR_WHEN_MESSAGE_MISS: false,
    AUTO_CREATE_MESSAGE_WHEN_MESSAGE_MISS: true,
    SUPPORTS_LANGUAGES: [
      'en',// English
      'zh-Hans',// Chinese (Simplified)
    ],
  },
  actions:{
    getSupportedLanguages,
    loadMessage,
    formatMessage,
    formatMessages,
    formatAbbreviation,
    formatAbbreviations,
    formatNumber,
    formatNumbers,
    formatDate,
    formatDates,
    formatRelativeTime,
    formatRelativeTimes,
    formatUnit,
    formatUnits,
    formatCurrency,
    formatCurrencies,
    plural,
  },
  schemas:{
    loadMessage:{
      properties: {
        rootPath: {
          type: 'string',
        },
        includeNodeModules:{
          type: 'boolean',
        },
      },
      required: ['rootPath'],
    },
    formatMessage:{
      properties: {
        id: {
          type: 'string',
        },
        value: {
          type: 'object',
        },
        language:{
          type: 'string',
        }
      },
      required: ['id'],
    },
    formatDate:{
      properties: {
        value: {
          type: 'string',
        },
        options:{
          type: 'object',
        },
        language:{
          type: 'string',
        }
      },
      required: ['value'],
    },
    formatNumber:{
      properties: {
        value: {
          type: 'number',
        },
        options:{
          type: 'object',
        },
        language:{
          type: 'string',
        }
      },
      required: ['value'],
    },
    plural:{
      properties: {

        options:{
          type: 'object',
        },
        language:{
          type: 'string',
        }
      },
      required: ['value'],
    },
    formatRelativeTime:{
      properties: {
        value: {
          type: 'number',
        },
        unit:{
          type: 'string',
        },
        options:{
          type: 'object',
        },
        language:{
          type: 'string',
        }
      },
      required: ['value','unit'],
    },
    formatUnit:{
      properties: {
        value: {
          type: 'number',
        },
        unit:{
          type: 'string',
        },
        options:{
          type: 'object',
        },
        language:{
          type: 'string',
        }
      },
      required: ['value','unit'],
    },
    formatCurrency:{
      properties: {
        value: {
          type: 'number',
        },
        currencySymbol:{
          type: 'string',
        },
        options:{
          type: 'object',
        },
        language:{
          type: 'string',
        }
      },
      required: ['value','currencySymbol'],
    },
    init:{
      properties: {
        rootPath: {
          type: 'string',
        },
      },
      required: ['rootPath'],
    }

  },
  init,
  load: Globalize.load,
  locale: Globalize.locale,
  loadMessages: Globalize.loadMessages,
  bundles: {},

};

module.exports = i18nManager;
