'use strict';

const { Service } = require('ee-core');
const Storage = require('ee-core/storage');
const UtilsHelper = require('ee-core/utils/helper');
const moment = require('moment');
const Electron = require('ee-core/electron');
const { BrowserView } = require('electron')
const { session } = require('electron')
const Utils = require('ee-core/utils');

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
}

ConfigService.toString = () => '[class ConfigService]';
module.exports = ConfigService;