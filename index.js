// © Copyright Mocoolka Corporation 2015,2017.
// Node module: mocoolka-i18n
// LICENSE: MIT
/** @module mocoolka-i18n-service */
const i18nManager = require('./lib/i18n');
const { serviceTools } = require('mocoolka-tools');
/**
 * start setting service
 * @param {string} rootPath - root path contain 'intl'
 */
const startI18nService =(rootPath)=>{
  serviceTools.standServices(
    {
      settingManager: {
        module: i18nManager,
        options: {
          rootPath,
        },
      }
    }
  )
};
module.exports = startI18nService;