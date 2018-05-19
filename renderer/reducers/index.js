import {combineReducers} from 'redux';
import step from './step';
import file from './file';
import rule from './rule';
import excel from './excel';
import filter from './filter';

export default combineReducers({
    step, file, rule, excel, filter
});
