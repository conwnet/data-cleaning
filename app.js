/**
 * @file 主进程入口文件
 * @author netcon
 */

// 使用 babel
require('babel-register');

/**
 * 由于 js-xlsx readFile 会阻塞主进程，
 * 所以使用 cluster 实现多进程
 * (这坑太大了，要 hold 不住了)
 */
const cluster = require('cluster');

/** 主进程的逻辑 */
if (cluster.isMaster) {
    global.worker = cluster.fork();

    const {app, BrowserWindow} = require('electron');
    const path = require('path');
    const url = require('url');
    const {eventsListener} = require('./main');

    const createWindow = () => {
        const win = new BrowserWindow({width: 800, height: 600});

        // 加载应用的 URL
        win.loadURL(url.format({
            hostname: '127.0.0.1',
            port: '8080',
            protocol: 'http:',
            slashes: true
        }));

        // 打开开发者工具
        // win.webContents.openDevTools();

        // window 关闭的回调
        win.on('close', () => {
            console.log('window is closed');
        });

        eventsListener.init();
    };

    // 创建浏览器窗口回调
    app.on('ready', createWindow);

    // 全部窗口关闭回调
    app.on('window-all-closed', () => {
        app.quit();
    });
} else {
    // 这里执行计算进程的内容
    require('./main/worker').start();
}

