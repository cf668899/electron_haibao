'use strict';

const { Service } = require('ee-core');
const HttpClient = require('ee-core/httpclient');

/**
 * 示例服务（service层为单例）
 * @class
 */
class TranslatorDeeplService extends Service {

  constructor(ctx) {
    super(ctx);
    this.translatorMap = {}
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
      timeout: 15000,  
    };
    const result = await hc.request('https://api-free.deepl.com/v2/translate', options);
    return result
  }

}

TranslatorDeeplService.toString = () => '[class TranslatorDeeplService]';
module.exports = TranslatorDeeplService;