'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');
const { session } = require('electron')


class TranslatorController extends Controller {

    constructor(ctx) {
        super(ctx);
    }


    /**
     * 所有方法接收两个参数
     * @param args 前端传的参数
     * @param event - ipc通信时才有值。详情见：控制器文档
     */
    async deepl(data){
        let res = await Services.get("translator").deepl(data)
        return res
    }

    async google(data){
        let res = await Services.get("translator").google(data)
        return res
    }
}

TranslatorController.toString = () => '[class TranslatorController]';
module.exports = TranslatorController;  