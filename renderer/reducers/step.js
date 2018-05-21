/**
 * @file 当前第几步的 reducer 
 * @author netcon
 */

const step = (state = 1, action) => {
    switch (action.type) {
        case 'NEXT_STEP':
            return state === 3 ? 1 : state + 1;
        default:
            return state;
    }
}

export default step;
