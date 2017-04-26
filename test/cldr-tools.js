const fileTools = require('mocoolka-tools').fileTools;
const cldrTools = require('../lib/tools/cldr-tools')
let expect = require('chai').expect;

describe('cldrTools module', function () {
  it('getSupportedLanguages', () => {
    let languages = cldrTools.getSupportedLanguages(fileTools.path(__dirname, 'cldr'));
    expect(languages).to.be.deep.equal(['en', 'zh-Hans']);
  });
  it('isSupportedLanguage', () => {
    expect(cldrTools.isSupportedLanguage('zh-Hans',fileTools.path(__dirname, 'cldr'))).to.be.true;
  });
  it('getSupportedLanguage', () => {
    expect(cldrTools.getSupportedLanguage('zh-Hans',
      fileTools.path(__dirname, 'cldr'))).to.be.equal('zh-Hans');
    expect(cldrTools.getSupportedLanguage('fr',
      fileTools.path(__dirname, 'cldr'))).to.be.null;
  });
});
