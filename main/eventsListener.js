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

// excel.init('/Users/zhangguoqing02/Desktop/test.xlsx');

const getExcelContentListener = () => {
    ipcMain.on('get-excel-content', event => {
        const send = sendToWorker(sendToRenderer(event, 'get-excel-content-reply'));

        send({type: 'GET_EXCEL_CONTENT'});
    });
}

export default {
    init() {
        openExcelFileListener();
        getExcelContentListener();
    }
};
