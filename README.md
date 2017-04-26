# mocoolka-setting
[![npm package](https://img.shields.io/npm/v/mocoolka-tools.svg)](https://www.npmjs.com/package/mocoolka-setting) [![license](https://img.shields.io/npm/l/mocoolka-setting.svg)](LICENSE.md)

Mocoolka-i18n is base module for mocoolka application.
The module is for internationalization and localization that leverage the official Unicode CLDR JSON data. 

## Install

```bash
$ npm install mocoolka-i18n
```

## Usage

edit file "messages.mk-message.json" on intl directory 
```bash
{
  "root": {
    "i18n" :{
      "E-MISS-MESSAGE" : "Missing required message content '{value}'.",
      "E-MISS-FORMAT-MESSAGE" : "format {type} error. value:{value} options:{options} language:{language}.",
      "E-MISS-FORMAT-DATE" : "format date '{value}' error in language:{language} using options '{options}'.",
      "E-MISS-FORMAT-PLURAL" : "format plural '{value}' error in language:{language} using options '{options}'.",
      "E-MISS-FORMAT-NUMBER" : "format number '{value}' error in language:{language} using options '{options}'.",
      "E-MISS-FORMAT-RELATIVE-TIME" : "format relative date '{value}' error in language:{language} using options '{options}' and unit '{unit}'.",
      "E-MISS-FORMAT-CURRENCY" : "formatCurrency error. currencySymbol:{currencySymbol} value:{value} options:{options} language:{language}",
      "E-MISS-FORMAT-UNIT" : "formatUnit error. unit:{unit} value:{value} options:{options} language:{language}"

    },
    "ERROR": {
      "E-MISS-TYPE" : "The variable({variable})'s type expected is '{expected}',actual is '{actual}'",
      "E-DIR-NOT-EXIST" : "The path ({path}) is not a directory",
      "E-FILE-NOT-EXIST" : "The file be not found on '{path}'",
      "E-LANG-NOT-SUPPORT" : "The language ({language}) be not supported by Application.Application support is '{supportLanguages}'",
      "E-NOT-INIT" : "The module ({moduleName}) must init ,please first call function.",
      "E-NOT-BLANK": "The variable can't be blank",
      "E-MISS-PARSE-FILE" :"The error be throw while file be parsed on '{path}'",
      "E-MISS-CALLBACK" :"callback function must exist"
    }
  },
  "zh-Hans":{
    "i18n" :{
      "E-MISS-PARSE-FILE" :"CLDR文件读取时发生错误{path}",
      "E-MISS-MESSAGE" : "'{value}'消息没有被发现，请核对配置消息配置文件.",
      "E-MISS-FORMAT-DATE" : "日期'{value}'格式化时发生错误，使用语言{language}选项为'{options}'.",
      "E-MISS-FORMAT-CURRENCY" : "格式化货币发生错误. 货币符号{currencySymbol} 值:{value} 选项:{options} 语言:{language}",
      "E-MISS-FORMAT-UNIT" : "格式化单位时货币发生错误. 单位:{unit}  值:{value} 选项:{options} 语言:{language}"
    },
    "ERROR": {
      "E-MISS-TYPE" : "类型错误。期望是 {expected},实际是 {actual}",
      "E-DIR-NOT-EXIST" : "{path} 文件路径不存在",
      "E-FILE-NOT-EXIST" : "没有找到指定的文件'{path}'",
      "E-LANG-NOT-SUPPORT" : "CLDR不支持{languageNotSupport} be not supported by CLDR.支持的语言有 {supportLanguages}",
      "E-NOT-INIT" : " 模块必须先初始化 {moduleName}  ,请先调用初速化函数 {initFunction}.",
      "E-NOT-BLANK": "变量不能为空值",
      "E-MISS-CALLBACK" :"要求的回调函数不存在"
    }
  }
}
 ```

start micro service 

 ```bash
 const i18nService = require('mocoolka-i18n');
 i18nService(__dirname);
 ```

format date 
 ```bash
serviceTools.standClientPromise('mocoolka-i18n', 'formatDate',
  {value: (new Date()).toUTCString()}).then(data=> {
  console.log(data)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatDate',
  {value: (new Date()).toUTCString(), language: 'zh-Hans'}).then(data=> {
  console.log(data)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatDates',
  {value: (new Date()).toUTCString()}).then(data=> {

  console.log(data)
}).catch(error=> {
  console.error(error);
});

output:
{ result: 'Apr 26, 2017, 9:05:28 AM' }
{ result: '2017年4月26日 上午9:05:28' }
{ result: 
   { value: 'Wed, 26 Apr 2017 01:05:28 GMT',
     message: 
      { en: 'Apr 26, 2017, 9:05:28 AM',
        'zh-Hans': '2017年4月26日 上午9:05:28' } } }
 ```

format relative times 
 ```bash
serviceTools.standClientPromise('mocoolka-i18n', 'formatRelativeTime',
  {value: 30000, unit: 'second'}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatRelativeTime',
  {value: 30000, unit: 'second', language: 'zh-Hans'}).then(data=> {

  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatRelativeTimes',
  {value: 30000, unit: 'second'}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

output:
in 30,000 seconds
30,000秒钟后
{ value: 30000,
  unit: 'second',
  message: { en: 'in 30,000 seconds', 'zh-Hans': '30,000秒钟后' } }
 ```

format unit
 ```bash
serviceTools.standClientPromise('mocoolka-i18n', 'formatUnit',
  {value: 30000, unit: 'second'}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatUnit',
  {value: 30000, unit: 'second', language: 'zh-Hans'}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatUnits',
  {value: 30000, unit: 'second'}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

output:
30,000 sec
30,000秒
{ value: 30000,
  unit: 'second',
  message: { en: '30,000 sec', 'zh-Hans': '30,000秒' } }
 ```

format currency
 ```bash
serviceTools.standClientPromise('mocoolka-i18n', 'formatCurrency',
  {value: 30000, currencySymbol: 'USD'}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatCurrency',
  {value: 30000, currencySymbol: 'USD', language: 'zh-Hans'}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatCurrencies',
  {value: 30000, currencySymbol: 'USD'}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

output:
30,000.00 US dollars
30,000.00美元
{ value: 30000,
  currencySymbol: 'USD',
  message: { en: '30,000.00 US dollars', 'zh-Hans': '30,000.00美元' } }
 ```

format number
 ```bash
serviceTools.standClientPromise('mocoolka-i18n', 'formatNumber',
  {value: 30000}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatNumber',
  {value: 30000, language: 'zh-Hans'}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatNumbers',
  {value: 30000}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

output:
30,000
30,000
{ value: 30000, message: { en: '30,000', 'zh-Hans': '30,000' } }
 ```

format plural
 ```bash
serviceTools.standClientPromise('mocoolka-i18n', 'plural',
  {value: 30000}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

output:
other
 ```

load message
 ```bash
serviceTools.standClientPromise('mocoolka-i18n', 'loadMessage',
  {rootPath: fileTools.path(__dirname, 'intl')}).then(data=> {
  serviceTools.standClientPromise('mocoolka-i18n', 'formatMessage',
    {id: 'log/start'}).then(data=> {
    console.log(data.result)
  }).catch(error=> {
    console.error(error);
  });
 ```


format message
 ```bash
serviceTools.standClientPromise('mocoolka-i18n', 'formatMessage',
  {id: 'i18n/E-MISS-MESSAGE', value: {value: 'test'}}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatMessage',
  {id: 'i18n/E-MISS-MESSAGE', value: {value: 'test'}, language: 'zh-Hans'}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatMessages',
  {id: 'i18n/E-MISS-MESSAGE', value: {value: 'test'}}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

output:
Missing required message content 'test'.
'test'消息没有被发现，请核对配置消息配置文件.
{ id: 'i18n/E-MISS-MESSAGE',
  value: { value: 'test' },
  message: 
   { en: 'Missing required message content \'test\'.',
     'zh-Hans': '\'test\'消息没有被发现，请核对配置消息配置文件.' } }
 ```

format abbreviation
 ```bash
serviceTools.standClientPromise('mocoolka-i18n', 'formatAbbreviation',
  {id: 'i18n/E-MISS-MESSAGE', value: {value: 'test'}}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatAbbreviation',
  {id: 'i18n/E-MISS-MESSAGE', value: {value: 'test'}, language: 'zh-Hans'}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'formatAbbreviations',
  {id: 'i18n/E-MISS-MESSAGE', value: {value: 'test'}}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

serviceTools.standClientPromise('mocoolka-i18n', 'getSupportedLanguages',
  {}).then(data=> {
  console.log(data.result)
}).catch(error=> {
  console.error(error);
});

output:
Missing required message content 'test'.
'test'消息没有被发现，请核对配置消息配置文件.
{ id: 'i18n/E-MISS-MESSAGE',
  value: { value: 'test' },
  message: 
   { en: 'Missing required message content \'test\'.',
     'zh-Hans': '\'test\'消息没有被发现，请核对配置消息配置文件.' } }
 ```

## Docs

[link to Docs!](https://htmlpreview.github.io/?https://raw.githubusercontent.com/mocoolka/mocoolka-setting/master/docs/index.html)

## License
Licensed under the MIT, version 2.0. (see [MIT](LICENSE.md)).
