'use strict';

const { Service } = require('ee-core');
const Store = require('electron-store');
const Storage = require('ee-core/storage');

/**
 * 登录服务
 * @class
 */
class LoginService extends Service {

  constructor(ctx) {
    super(ctx);

    this.conn = Storage.connection('config');
    let login = this.conn.db.get("login").value()
    if(!login){
        this.conn.db.defaults({login: {
          token: "",
          isSaveLogin: false,
        }}).write();
    }

  }

  /**
   * test
   */
  async setLoginData(data) {
    this.conn.db.get("login")
      .assign(data)
      .write()
    return data;
  }
  async getLoginData(){
    return this.conn.db.get("login").value();
  }
  clearLoginData(){
    const store = new Store();
    let data = store.delete('loginData')
    return data;
  }
}

LoginService.toString = () => '[class LoginService]';
module.exports = LoginService;