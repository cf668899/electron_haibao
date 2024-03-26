'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');
const { session } = require('electron')
const windows = require('ee-core/electron/window');

/**
 * login
 * @class
 */
class AppController extends Controller {

    constructor(ctx) {
        super(ctx);
    }


    /**
     * 所有方法接收两个参数
     * @param args 前端传的参数
     * @param event - ipc通信时才有值。详情见：控制器文档
     */
    async add(data){
        return Services.get("app").add(data)
    }

    async list(token){
        return Services.get("app").list(token)
    }

    async del(data){
        return Services.get("app").del(data)
    }

    async start(data){
        return Services.get("app").start(data)
    }

    async close(data) {
        return Services.get("app").close(data)
    }

    async update(data){
        return Services.get("app").update(data)
    }

    async getAppById(id){
        return Services.get("app").getAppById(id)
    }

    async changeRecord(data) {
        Services.get("app").changeRecord(data)
    }

    async changeUserName(data) {
        Services.get("app").changeUserName(data)
    }

    async changeTranslate(data) {
        Services.get("app").changeTranslate(data)
    }

    async changeSingleTranslate(data){
        Services.get("app").changeSingleTranslate(data)
    }
    //代理
    async changeProxyInfo(data) {
        Services.get("app").changeProxyInfo(data)
    }
    //修改好友信息
    async changeFriendInfo(data){
        Services.get("app").changeFriendInfo(data)
    }

    async changeRemark(data){
        Services.get("app").changeRemark(data)
    }

    async savePreload(data){
        return Services.get("preload").savePreload(data)
    }

    getMachineId(){
        return Services.get("app").getMachineId()
    }

    getCommonStorage(data){
        return Services.get("app").getCommonStorage(data)
    }

    setCommonStorage(data){
        console.log("data==",data)
        return Services.get("app").setCommonStorage(data)
    }

    //代理
    async setTranslate(data) {
        let res = await Services.get("app").setTranslate(data)
        return res
    }

    //全局配置
    async settingGlobalProxy(data){
        console.log('settingGlobalProxy', data)
        if(!data.open){
            session.defaultSession.setProxy({
                mode:'system'
            })
            return
        }

        let auth = data.auth?`${data.user}:${data.password}@`:''
        const proxyServer = `${data.type.toLowerCase()}://${auth}${data.host}:${data.port}`
        console.log(proxyServer)
        session.defaultSession.setProxy({
            proxyBypassRules: 'localhost',
            proxyRules: proxyServer,
        })
    }

    // 局部配置
    async settingProxy(data){
        console.log(data)
        if(!data.proxyInfo.cookieOpen){
            // 取消代理
            session.fromPartition(data.id).setProxy({
                mode: 'system'
            })
            return
        }

        let auth = data.proxyInfo.auth?`${data.proxyInfo.user}:${data.proxyInfo.password}@`:''
        const proxyServer = `${data.proxyInfo.type.toLowerCase()}://${auth}${data.proxyInfo.host}:${data.proxyInfo.port}`
        console.log('proxyServer:', proxyServer)
        session.fromPartition(data.id).setProxy({
            proxyBypassRules: 'localhost',
            proxyRules: proxyServer,
        })
    }

    async getSettingFont(){
        const res = await Services.get("app").getCommonStorage({
            key: 'SoftSetting',
          })
          if (res && res.length > 0 ) {
            return res
          } else {
            return JSON.stringify({
                needFloat: '',
                fontSize: 12,
                text: '1',
                fontWeight: '1',
                ua: 'Apple MacOs',
                fontColor: '#000',
              })
          }
    }
}

AppController.toString = () => '[class AppController]';
module.exports = AppController;
