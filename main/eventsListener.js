/**
 * @file 处理主进程的事件监听
 * @author netcon
 */
import {ipcMain, dialog} from 'electron';
import {curry} from 'lodash/fp';
import Reply from './Reply';

// 发送消息到渲染进程
const sendToRenderer = curry(({sender}, event, reply) => sender.send(event, reply));
const sendToWorker = curry(((mapRenderer = {}) => {
    global.worker.on('message', ({type, payload}) => mapRenderer[type](payload));
    return (sendToRenderer, message) => {
        global.worker.send(message);
        mapRenderer[message.type] = sendToRenderer;
    }
})());

// 打开文件的 Listener
const openExcelFileListener = () => {
    ipcMain.on('open-excel-file', event => {
        const send = sendToWorker(sendToRenderer(event, 'open-excel-file-reply'));

        dialog.showOpenDialog({
            properties: ['openFile']
        }, ([file, ...others] = []) => {
            if (!file) {
                event.returnValue = new Reply(1000, '操作取消');
            } else {
                event.returnValue = new Reply(0, '正在上传');
                send({
                    type: 'OPEN_EXCEL_FILE',
                    payload: {file}
                });
            }
        });
    });
};

// 获取 Excel 数据的 Listener
const getExcelDataListener = () => {
    ipcMain.on('get-excel-data', (event, payload) => {
        const send = sendToWorker(sendToRenderer(event, 'get-excel-data-reply'));

        send({type: 'GET_EXCEL_DATA', payload});
    });
};

// 获取 Excel 第一个 sheet 名称的 Listener
const getExcelFirstSheetListener = () => {
    ipcMain.on('get-excel-first-sheet', (event, payload) => {
        const send = sendToWorker(sendToRenderer(event, 'get-excel-first-sheet-reply'));

        send({type: 'GET_EXCEL_FIRST_SHEET', payload});
    });
};

const calculateListener = () => {
    ipcMain.on('calculate', (event, payload) => {
        const send = sendToWorker(sendToRenderer(event, 'calculate-reply'));

        send({type: 'CALCULATE', payload});
    });
}

const exportFileListener = () => {
    ipcMain.on('export-file', (event, payload) => {
        const send = sendToWorker(sendToRenderer(event, 'export-file-reply'));

        send({type: 'EXPORT_FILE', payload});
    });
}

export default {
    init() {
        openExcelFileListener();
        getExcelDataListener();
        getExcelFirstSheetListener();
        calculateListener();
        exportFileListener();
    }
};
