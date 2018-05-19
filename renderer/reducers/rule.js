/**
 * @file 数据清洗规则 reducer
 * @author netcon
 */

const initialState = {
    columns: [], // 用户选中的列
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
        default:
            return state;
    }
}

export default rule;
