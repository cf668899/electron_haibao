'use strict';

const { Service } = require('ee-core');
const Store = require('electron-store');

/**
 * 登录服务
 * @class
 */
class LoginService extends Service {

  constructor(ctx) {
    super(ctx);
  }

  /**
   * test
   */
  async setLoginData(data) {
    const store = new Store();
    store.set("loginData", data)
    return data;
  }
  async getLoginData(){
    const store = new Store();
    let data = store.get('loginData')
    return data;
  }
}

LoginService.toString = () => '[class LoginService]';
module.exports = LoginService;