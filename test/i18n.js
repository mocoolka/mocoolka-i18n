// © Copyright Mocoolka Corporation 2015,2017.
// Node module: mocoolka-i18n
// LICENSE: MIT
const fileTools = require('mocoolka-tools').fileTools;
const i18nManager = require('../lib/i18n')
let expect = require('chai').expect;

describe('i18n module', function () {
  it('init', () => {
    i18nManager.init({rootPath:fileTools.path(__dirname,'..')},(error,data)=>{
      expect(error).to.be.null;
    });
  });
});