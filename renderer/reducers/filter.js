/**
 * @file Excel 预览表格属性
 * @author netcon
 */

import {ipcRenderer} from 'electron';

const initialState = {
    current: '未选择', // 当前 sheet
    startRow: 1,
    startCol: 1,
    rowCount: 10,
    colCount: 10
};

const filter = (state = initialState, {type, payload}) => {
    switch(type) {
        case 'UPDATE_FILTER':
            const newFilter = {...state, ...payload};

            global.loading();
            ipcRenderer.send('get-excel-data', newFilter);
            return newFilter;
        default:
            return state;
    }
}

export default filter;
