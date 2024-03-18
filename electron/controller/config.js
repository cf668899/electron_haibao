'use strict';

const { Controller } = require('ee-core');
const Services = require('ee-core/services');

/**
 * login
 * @class
 */
class ConfigController extends Controller {

    constructor(ctx) {
        super(ctx);
    }


    //代理
    async setTranslate(data) {
        let res = Services.get("config").setTranslate(data)
        return res
    }

    async getTranslate(data) {
        return Services.get("config").getTranslate()
    }

    async setProxy(data) {
        let res = Services.get("config").setProxy(data)
        return res
    }

    async getProxy() {
        let res = Services.get("config").getProxy()
        return res
    }

}

ConfigController.toString = () => '[class ConfigController]';
module.exports = ConfigController;  