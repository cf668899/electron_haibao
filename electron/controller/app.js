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
        return Services.get("viewManager").add(data)
    }

    async list(){
        return Services.get("viewManager").list()
    }

    async del(data){
        return Services.get("viewManager").del(data)
    }

    async start(data){
        return Services.get("viewManager").start(data)
    }

    async close(data) {
        return Services.get("viewManager").close(data)
    }
    async changeRecord(data) {
        Services.get("viewManager").changeRecord(data)
    }

    async savePreload(data){
        return Services.get("preload").savePreload(data)
    }
}

AppController.toString = () => '[class AppController]';
module.exports = AppController;  