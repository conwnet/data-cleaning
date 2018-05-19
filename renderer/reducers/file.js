const fileList = (state = null, action) => {
    const {type, payload} = action;

    switch(type) {
        case 'ADD_FILE':
            return payload.file;
        case 'DELETE_FILE':
            return null;
        default:
            return state;
    }
}

export default fileList;
