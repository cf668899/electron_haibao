'use strict';

const { Service } = require('ee-core');
const Storage = require('ee-core/storage');
const UtilsHelper = require('ee-core/utils/helper');
const moment = require('moment');
const Electron = require('ee-core/electron');
const { BrowserView } = require('electron')
const { session } = require('electron')
const Utils = require('ee-core/utils');
const Services = require('ee-core/services');
/**
 * 示例服务（service层为单例）
 * @class
 */
class ConfigService extends Service {

  constructor(ctx) {
    super(ctx);
    this.conn = Storage.connection('config');
  }

  setTranslate(data) {
    console.log(data)
    if(data.changeType){
      // 将对应app的翻译清空
      Services.get("app").clearTranslate(data.changeType)
    }
    this.conn.db.set('translate', data).write();
    return data
  }

  getTranslate(){
    return this.conn.db.get('translate').value()
  }

  setProxy(data){
    this.conn.db.set('proxy', data).write();
    return data
  }

  getProxy(){
    return this.conn.db.get('proxy').value()
  }

  getConfig(key){
    return this.conn.db.get(key).value()
  }

  setConfig(data){
    this.conn.db.set(data.key, data.value).write();
  }
}

ConfigService.toString = () => '[class ConfigService]';
module.exports = ConfigService;