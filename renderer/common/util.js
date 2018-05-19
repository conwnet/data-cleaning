import {ipcRenderer} from 'electron';

export const ipc = ipcRenderer;

export const ipcBack = {
    send: (...args) => {
        ipcRenderer.send(...args);
    },
    on: ((events = {}) => {
        return (event, handle) => {
            if (!events[event]) {
                events[event] = new Set();

                ipcRenderer.on(event, (...args) => {
                    Array.from(events[event]).forEach(handle => {
                        handle(...args);
                    });
                });
            }

            events[event].add(handle);
        }
    })()
};

export const nextProgress = now => {
    return Math.max(99.99 - now, 0) * 0.1 + now;
}