'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');
const { session } = require('electron')

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

    async list(){
        return Services.get("app").list()
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
    async changeRecord(data) {
        Services.get("app").changeRecord(data)
    }

    async changeUserName(data) {
        Services.get("app").changeUserName(data)  
    }

    async changeTranslate(data) {
        Services.get("app").changeTranslate(data)  
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

    //代理
    async setTranslate(data) {
        let res = await Services.get("app").setTranslate(data)
        return res
    }
}

AppController.toString = () => '[class AppController]';
module.exports = AppController;  