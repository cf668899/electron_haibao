'use strict';

const { Service } = require('ee-core');
const fs = require('fs')
const path = require('path');
const Ps = require('ee-core/ps');

/**
 * 示例服务（service层为单例）
 * @class
 */
class PreloadService extends Service {

    constructor(ctx) {
        super(ctx);
    }

    savePreload(data) {
        console.log("savePreload")
        let filePath = path.join(Ps.getHomeDir(), `${data.type}.js`)
        console.log("filePath:", filePath)
        if (this[data.type]) {
            fs.writeFile(filePath, this[data.type](), (error) => {
                console.log(error)
            })
        } else {
            console.log(`未实现${data.type}函数！！！！`)
        }

    }

    Whatsapp(){
        const WhatsappJs = require('../inject/Whatsapp')
        return WhatsappJs.toString() + ';WhatsappJs()'
    }


    Telegram() {
        const TelegramJs = require('../inject/Telegram')
        let js =TelegramJs.toString() + ';TelegramJs()'
        return js
    }

}

PreloadService.toString = () => '[class PreloadService]';
module.exports = PreloadService;