/**
 * @file 一堆 filters
 * @author netcon
 */

import React, {PureComponent} from 'react';
import {bind} from 'lodash-decorators';
import {ipcRenderer} from 'electron';
import {connect} from 'react-redux';
import {Button, Menu, Dropdown, Icon, Input} from 'antd';
import {handleReply} from '~/common/util';
import {update_excel_data} from '~/actions';
import styles from './Filters.less';

const SheetFilter = ({sheets, current, onChange}) => {
    const handleClick = ({key}) => onChange({current: key});
    const menus = (
        <Menu onClick={handleClick}>
            {sheets.map(sheet => (
                <Menu.Item key={sheet}>
                    {sheet}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={menus}>
            <Button style={{marginLeft: 8}}>
                {current} <Icon type="down" />
            </Button>
        </Dropdown>
    );
};

class Filters extends PureComponent {
    render() {
        const {sheets, filter, onChange} = this.props;
        const {current, startRow, startCol, rowCount, colCount} = filter;
        const handleInput = key => e => onChange({[key]: e.target.value});

        return (
            <div className={styles.root}>
                <SheetFilter
                    sheets={sheets}
                    current={current}
                    onChange={onChange}
                />
                <Input addonBefore="起始行" value={startRow} onInput={handleInput('startRow')} />
                <Input addonBefore="起始列" value={startCol} onInput={handleInput('startCol')} />
                <Input addonBefore="显示行数" value={rowCount} onInput={handleInput('rowCount')} />
                <Input addonBefore="显示列数" value={colCount} onInput={handleInput('colCount')} />
            </div>
        );
    }
}

export default Filters;
