'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
// const Electron = require('ee-core/electron');
// const { BrowserView } = require('electron')

/**
 * login
 * @class
 */
class LoginController extends Controller {

    constructor(ctx) {
        super(ctx);
    }


    /**
     * 所有方法接收两个参数
     * @param args 前端传的参数
     * @param event - ipc通信时才有值。详情见：控制器文档
     */

    /**
     * test
     */
    async login(args) {
        Log.info('args:', args);
        // const view = new BrowserView()
        // Electron.mainWindow.setBrowserView(view)
        // const size = Electron.mainWindow.getContentSize()
        // view.setBounds({ x: 500, y: 0, width: 1200, height: size[1] })
        // view.webContents.loadURL('https://www.baidu.com')
        // 创建窗口
        return 'hello electron-egg test';
    }
}

LoginController.toString = () => '[class LoginController]';
module.exports = LoginController;  