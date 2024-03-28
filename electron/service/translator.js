'use strict';

const { Service } = require('ee-core');
const HttpClient = require('ee-core/httpclient');
const Storage = require("ee-core/storage");

/**
 * 示例服务（service层为单例）
 * @class
 */
class TranslatorService extends Service {

  constructor(ctx) {
    super(ctx);
    this.translatorMap = {}
    this.conn = Storage.connection('haibao');
    let app = this.conn.db.get("apps").value()
    if(!app){
      this.conn.db.defaults({apps: []}).write();
    }
  }


  async deepl(data){
    const hc = new HttpClient();
    let key = data.key? data.key: 'bf78e7d7-8c33-4805-8b6c-1c32d9e16080:fx'
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'DeepL-Auth-Key ' + key,
      },
      data: {
        "text": data.texts,
        "target_lang": data.translate.target
      },
      dataType: 'json',
      timeout: 5000,  
    };

    let texts = data.texts
    let res = []
    const result = await hc.request('https://api-free.deepl.com/v2/translate', options);
    if (result.status == 200 && result.data && result.data.translations.length) {
      for (let i = 0; i < result.data.translations.length; i++) {
        let text = texts[i]
        res.push(
          {
            text,
            translation: result.data.translations[i].text
          }
        )
      }
    }
    // 统一返回格式
    return res
  }


  // google 翻译未实现
  async google(data){
    console.log('google:', data)
    let res = []
    let texts = data.texts
    let googleKey = 'AIzaSyB6vU_egQ1WVAF9_s5XKc5vzcCi0EPYQkw'
    const hc = new HttpClient();
    const options = {
      method: 'POST',
      data: {
        "q": texts,
        "target": data.translate.target,
        "format": 'text'
      },
      dataType: 'json',
      timeout: 5000,  
    }

    const result = await hc.request('https://translation.googleapis.com/language/translate/v2?key='+googleKey, options);
    if (result.data && result.data.translations) {
      for (let i = 0; i < result.data.translations.length; i++) {
        let text = texts[i]
        res.push(
          {
            text,
            translation: result.data.translations[i].translatedText
          }
        )
      }
    }

    return res
  }




}

TranslatorService.toString = () => '[class TranslatorService]';
module.exports = TranslatorService;