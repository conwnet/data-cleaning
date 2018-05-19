/**
 * @file cluster 进程逻辑，只有 worker 进程能来这儿
 * @author netcon
 */

import $path from 'path';
import {worker} from 'cluster';
import Excel from './Excel';
import Reply from './Reply';

// 把下划线形式转为驼峰形式：GOOD_BOY => goodBoy
const camelize = name => name.toLowerCase().replace(/_(\w)/g, (_, c) => c.toUpperCase());

class Task {
    excel = new Excel();

    openExcelFile({file}) {
        const status = this.excel.init(file);

        if (status) {
            return new Reply(0, 'OK', {
                uid: Date.now(),
                path: file,
                name: $path.basename(file)
            });
        } else {
            return new Reply(1002, '文件格式不正确！');
        }
    }

    // 获取已经读取的 excel 表的内容
    getExcelContent() {
        const content = this.excel.getContent();

        if (content) {
            return new Reply(0, 'OK', content);
        } else {
            return new Reply(2000, '未选择文件！');
        }
    }
}

// 开始 worker 进程的监听
export const start = () => {
    const task = new Task();
    worker.on('message', ({type, payload}) => {

        worker.send({
            type,
            payload: task[camelize(type)](payload)
        });
    });
}