/**
 * @file 数据清洗规则 reducer
 * @author netcon
 */

import {merge} from 'lodash/fp';

const initialState = {
    columns: [], // 用户选中的列
    sort: {status: false},
    unique: {status: false},
    format: {status: false},
    regexp: {status: false, rule: ''},
    ai: {status: false}
};

const rule = (state = initialState, {type, payload}) => {
    const {columns} = state;

    switch(type) {
        case 'TOGGLE_RULE_COLUMN':
            const foundIndex = columns.indexOf(payload);

            if (foundIndex !== -1) {
                columns.splice(foundIndex, 1);
            } else {
                columns.push(payload);
            }

            state.columns = [].concat(columns);
            return {...state};
        case 'UPDATE_RULE':
            return merge(state, payload);
        default:
            return state;
    }
}

export default rule;
