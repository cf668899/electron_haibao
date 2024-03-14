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
class AppService extends Service {

  constructor(ctx) {
    super(ctx);
    this.views = []
    this.conn = Storage.connection('haibao');
    let app = this.conn.db.get("apps").value()
    if(!app){
        this.conn.db.defaults({apps: []}).write();
    }

  }

  start(data){
    console.log("打开view")
  }

  close(data) {
    console.log("关闭app:", data)
  }

  changeRecord(data) {
    this.conn.db.get("apps")
      .find({id: data.id})
      .assign({record: data.record})
      .write()
      return data
  }

  changeUserName(data){
    this.conn.db.get("apps")
    .find({id: data.id})
    .assign({name: data.name})
    .write()
    return data
  }

  changeTranslate(data){
    this.conn.db.get("apps")
    .find({id: data.id})
    .assign({translateInfo: data.translateInfo})
    .write()
    return data
  }
  changeProxyInfo(data){
    this.conn.db.get("apps")
    .find({id: data.id})
    .assign({proxyInfo: data.proxyInfo})
    .write()
    return data
  }
  changeFriendInfo(data) {
    console.log(data)

    let app = this.conn.db.get("apps")
    .find({id: data.id})
    .value()

    let friendInfoMap = {}
    if(app.friendInfo){
      friendInfoMap = app.friendInfo
    }
    friendInfoMap[data.friendInfo.id] = data.friendInfo

    this.conn.db.get("apps")
    .find({id: data.id})
    .assign({friendInfo: friendInfoMap})
    .write()
    return data
  }

  add(data){
    data['id'] = UtilsHelper.getRandomString()
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    data['createTime'] = time
    data['updateTime'] = time
    data['sort'] = new Date().valueOf()
    this.conn.db.get("apps").push(data).write()
    return data
  }

  /**
   * 拉取app数据
   */
    list(){
      return this.conn.db.get("apps").value()
    }

    del(data){
      let list = this.conn.db.get("apps").value()
      let newList = []
      for(let item of list){
        console.log(item.id)
        if(item.id == data.id){
          continue
        }

        newList.push(item)
      }

      return this.conn.db.set("apps", newList).write()
    }

    getMachineId(){
      return Utils.machineIdSync(true)
    }
}

AppService.toString = () => '[class AppService]';
module.exports = AppService;