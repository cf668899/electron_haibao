'use strict'

const { Service } = require('ee-core')
const Storage = require('ee-core/storage')
const UtilsHelper = require('ee-core/utils/helper')
const moment = require('moment')
const Electron = require('ee-core/electron')
const { BrowserView } = require('electron')
const { session } = require('electron')
const Utils = require('ee-core/utils')
const Store = require('electron-store')

/**
 * 示例服务（service层为单例）
 * @class
 */
class AppService extends Service {
  constructor(ctx) {
    super(ctx)
    this.views = []
    this.conn = Storage.connection('haibao')
    let app = this.conn.db.get('apps').value()
    if (!app) {
      this.conn.db.defaults({ apps: [] }).write()
    }
  }

  start(data) {
    console.log('打开view')
  }

  close(data) {
    console.log('关闭app:', data)
  }

  changeRecord(data) {
    this.conn.db
      .get('apps')
      .find({ id: data.id })
      .assign({ record: data.record })
      .write()
    return data
  }

  changeUserName(data) {
    this.conn.db
      .get('apps')
      .find({ id: data.id })
      .assign({ name: data.name, avatar: data.avatar?data.avatar:'' })
      .write()
    return data
  }

  changeRemark(data) {
    this.conn.db
      .get('apps')
      .find({ id: data.id })
      .assign({ remark: data.remark })
      .write()
    return data
  }

  changeTranslate(data) {
    this.conn.db
      .get('apps')
      .find({ id: data.id })
      .assign({ translateInfo: data.translateInfo })
      .write()
    return data
  }

  changeProxyInfo(data) {
    this.conn.db
      .get('apps')
      .find({ id: data.id })
      .assign({ proxyInfo: data.proxyInfo })
      .write()
    return data
  }
  changeFriendInfo(data) {
    console.log(data)

    let app = this.conn.db.get('apps').find({ id: data.id }).value()

    let friendInfoMap = {}
    if (app.friendInfo) {
      friendInfoMap = app.friendInfo
    }
    friendInfoMap[data.friendInfo.id] = data.friendInfo

    this.conn.db
      .get('apps')
      .find({ id: data.id })
      .assign({ friendInfo: friendInfoMap })
      .write()
    return data
  }

  add(data) {
    // data['id'] = UtilsHelper.getRandomString()
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    data['createTime'] = time
    data['updateTime'] = time
    data['sort'] = new Date().valueOf()
    this.conn.db.get('apps').push(data).write()
    return data
  }

  update(data) {
    console.log('update', data)
    this.conn.db
      .get('apps')
      .find({ id: data.id })
      .assign({ ...data })
      .write()
    return data
  }

  getAppById(id) {
    return this.conn.db.get('apps').find({ id }).value()
  }

  /**
   * 拉取app数据
   */
  list(token) {
    console.log('token', token)
    let ls = this.conn.db.get('apps').value()
    return ls.filter(item=>{return item.netInfo && item.netInfo.inviteCode ==  token})
  }

  del(data) {
    let list = this.conn.db.get('apps').value()
    let newList = []
    for (let item of list) {
      console.log(item.id)
      if (item.id == data.id) {
        continue
      }

      newList.push(item)
    }

    return this.conn.db.set('apps', newList).write()
  }

  getMachineId() {
    return Utils.machineIdSync(true)
  }

  setTranslate(data) {
    //todo 保存翻译设置
    return data
  }

  getCommonStorage({ key }) {
    const StorageObj = new Store()
    return StorageObj.get(key) || []
  }
  setCommonStorage({ data, key }) {
    const StorageObj = new Store()
    StorageObj.set(key, data)
    return data
  }
}

AppService.toString = () => '[class AppService]'
module.exports = AppService
