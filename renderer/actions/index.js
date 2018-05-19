// 下一步按钮
export const next_step = () => ({
    type: 'NEXT_STEP'
});

// 更新 file
export const update_file = file => ({
    type: 'UPDATE_FILE',
    payload: file
});

// 点击表格 th 切换已选择列
export const toggle_rule_column = index => ({
    type: 'TOGGLE_RULE_COLUMN',
    payload: index
});

// 更新 excel
export const update_excel = data => ({
    type: 'UPDATE_EXCEL',
    payload: data
});

// 更新 filter
export const update_filter = filter => ({
    type: 'UPDATE_FILTER',
    payload: filter
});
