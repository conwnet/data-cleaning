import {ipcRenderer} from 'electron';

const initialState = {
    sheets: [],
    rows: [] // 用户选中的列
};

const filter = (state = initialState, {type, payload}) => {
    switch(type) {
        case 'UPDATE_EXCEL':
            return {...state, ...payload};
        default:
            return state;
    }
}

export default filter;
