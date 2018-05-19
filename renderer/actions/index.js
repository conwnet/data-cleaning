// 下一步按钮
const next_step = () => ({
    type: 'NEXT_STEP'
});

// 上传文件
const add_file = file => ({
    type: 'ADD_FILE',
    payload: {file}
});

// 删除文件
const delete_file = file => ({
    type: 'DELETE_FILE',
    payload: {file}
});

const update_file_list = fileList => ({
    type: 'UPDATE_FILE_LIST',
    payload: {fileList}
});

export {
    next_step,
    add_file,
    delete_file,
    update_file_list
};
