const step = (state = 2, action) => {
    switch (action.type) {
        case 'NEXT_STEP':
            return state === 3 ? 1 : state + 1;
        default:
            return state;
    }
}

export default step;
