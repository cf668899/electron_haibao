'use strict';

const { Service } = require('ee-core');
const HttpClient = require('ee-core/httpclient');
const Storage = require("ee-core/storage");
const {Translate} = require('@google-cloud/translate').v2;
const {TranslationServiceClient} = require('@google-cloud/translate');
const translationClient = new TranslationServiceClient();

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
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'DeepL-Auth-Key bf78e7d7-8c33-4805-8b6c-1c32d9e16080:fx',
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
    let googleKey = 'AIzaSyB6vU_egQ1WVAF9_s5XKc5vzcCi0EPYQkw'
    let projectId = 'testhahaha'
    const translate = new Translate({ projectId, key: googleKey })
    let [translations] = await translate.translate(data.texts, data.translate.target);
    translations = Array.isArray(translations) ? translations : [translations];
    console.log('Translations:' + translations);
    translations.forEach((translation, i) => {
      console.log(`${data.texts[i]} => (${data.translate.target}) ${translation}`);
    });

    return translations
  }




}

TranslatorService.toString = () => '[class TranslatorService]';
module.exports = TranslatorService;