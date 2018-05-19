const file = (state = null, {type, payload}) => {
    switch(type) {
        case 'UPDATE_FILE':
            return payload;
        default:
            return state;
    }
}

export default file;
