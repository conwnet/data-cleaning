import {message} from 'antd';
import {ipcRenderer} from 'electron';

export const handleReply = (reply, successCallback, errorCallback) => {
    const {errcode, errmsg, data} = reply;

    if (errcode) {
        message.error(errmsg);
        errorCallback && errorCallback(data, reply);
    } else {
        successCallback && successCallback(data, reply);
    }
}

export const ipcOnWithHandleReply = (event, successCallback, errorCallback) => {
    ipcRenderer.on(event, reply => {
        handleReply(reply, successCallback, errorCallback);
    });
}

export const nextProgress = now => {
    return Math.max(99.99 - now, 0) * 0.1 + now;
}
